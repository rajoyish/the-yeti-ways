#!/usr/bin/env node
/**
 * analyze_reference.mjs
 *
 * Analyzes a reference nursery rhyme recording or video (local file or YouTube / web URL):
 * - Downloads audio via yt-dlp if a URL is provided
 * - Measures exact audio duration and metadata
 * - Estimates tempo (BPM) via onset-strength autocorrelation
 * - Analyzes pitch/chroma distribution and estimates key & tonality (Major / Minor)
 * - Outputs a structured musical summary ready for the storyboard's Reference table
 *
 * Usage:
 *   node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <audio, video file or YouTube URL> [--stanzas N]
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const args = process.argv.slice(2);
const fileOrUrl = args.find(a => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--stanzas");
const si = args.indexOf("--stanzas");
const stanzas = si >= 0 ? Number(args[si + 1]) : 0;

if (args.includes("-h") || args.includes("--help")) {
  console.log("Usage: node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file|URL> [--stanzas N]");
  process.exit(0);
}
if (!fileOrUrl) {
  console.log("Usage: node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file|URL> [--stanzas N]");
  process.exit(1);
}

let targetFile = fileOrUrl;
let isTempFile = false;

// If input is a URL (e.g. YouTube video), download audio using yt-dlp
if (/^https?:\/\//i.test(fileOrUrl)) {
  console.log(`Input is a URL. Fetching audio with yt-dlp: ${fileOrUrl}...`);
  const tmpDir = os.tmpdir();
  const tmpAudio = path.join(tmpDir, `yeti_ref_${Date.now()}.mp3`);
  const yt = spawnSync("yt-dlp", ["-x", "--audio-format", "mp3", "-o", tmpAudio, fileOrUrl], {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf-8",
  });
  if (yt.status !== 0 || !fs.existsSync(tmpAudio)) {
    console.error(`yt-dlp failed to download audio from URL:\n${yt.stderr || yt.stdout}`);
    process.exit(1);
  }
  targetFile = tmpAudio;
  isTempFile = true;
}

if (!fs.existsSync(targetFile)) {
  console.error(`File not found: ${targetFile}`);
  process.exit(1);
}

// 1. Inspect metadata with ffprobe
let metadata = {};
const probe = spawnSync("ffprobe", [
  "-v", "quiet",
  "-print_format", "json",
  "-show_format",
  "-show_streams",
  targetFile
], { encoding: "utf-8" });

if (probe.status === 0 && probe.stdout) {
  try {
    const parsed = JSON.parse(probe.stdout);
    metadata = parsed.format?.tags || {};
  } catch (e) {}
}

const RATE = 11025;
const ff = spawnSync("ffmpeg", ["-v", "error", "-i", targetFile, "-vn", "-ac", "1", "-ar", String(RATE), "-f", "f32le", "-"],
  { maxBuffer: 1 << 30 });

if (ff.error) {
  console.error("ffmpeg not found: install ffmpeg to analyze audio.");
  if (isTempFile) fs.unlinkSync(targetFile);
  process.exit(1);
}
if (ff.status !== 0) {
  console.error(`ffmpeg could not decode ${targetFile}:\n${ff.stderr}`);
  if (isTempFile) fs.unlinkSync(targetFile);
  process.exit(1);
}

const buf = ff.stdout;
const pcm = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
const duration = pcm.length / RATE;

if (duration < 5) {
  console.error("The audio is under 5 seconds: too short to estimate tempo and key.");
  if (isTempFile) fs.unlinkSync(targetFile);
  process.exit(1);
}

// 2. Onset strength & Tempo Autocorrelation
const HOP = 128; // ~11.6 ms
const WIN = 512;
const frames = Math.floor((pcm.length - WIN) / HOP);
const energy = new Float32Array(frames);
for (let f = 0; f < frames; f++) {
  let s = 0;
  for (let i = 0; i < WIN; i++) {
    const v = pcm[f * HOP + i];
    s += v * v;
  }
  energy[f] = Math.log(1e-9 + s);
}
const onset = new Float32Array(frames);
for (let f = 1; f < frames; f++) onset[f] = Math.max(0, energy[f] - energy[f - 1]);
const mean = onset.reduce((a, b) => a + b, 0) / frames;
for (let f = 0; f < frames; f++) onset[f] -= mean;

const fps = RATE / HOP;
const scores = [];
for (let bpm = 60; bpm <= 180; bpm += 0.5) {
  const lag = (60 / bpm) * fps;
  let s = 0;
  for (const mult of [1, 2, 4]) {
    const l = lag * mult, l0 = Math.floor(l), fr = l - l0;
    let acc = 0;
    for (let f = 0; f + l0 + 1 < frames; f++) {
      acc += onset[f] * (onset[f + l0] * (1 - fr) + onset[f + l0 + 1] * fr);
    }
    s += acc / mult;
  }
  const weight = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 110), 2) / 0.6);
  scores.push({ bpm, s: s * weight });
}

const peaks = scores
  .filter((p, i) => i > 0 && i < scores.length - 1 && p.s >= scores[i - 1].s && p.s >= scores[i + 1].s && p.s > 0)
  .sort((a, b) => b.s - a.s);

const picked = [];
for (const p of peaks) {
  if (picked.every(q => Math.abs(q.bpm - p.bpm) >= 8)) picked.push(p);
  if (picked.length === 3) break;
}

// 3. Chroma & Key Tonality Estimation (Krumhansl-Schmuckler)
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const freqs = [];
// MIDI 48 (C3, 130.81Hz) to 76 (E5, 659.25Hz)
for (let m = 48; m <= 76; m++) {
  freqs.push({ midi: m, f: 440 * Math.pow(2, (m - 69) / 12), note: noteNames[m % 12] });
}

const chroma = new Float64Array(12);
const cWin = 2048;
for (let offset = 0; offset < pcm.length - cWin; offset += 4096) {
  for (const { f, midi } of freqs) {
    const k = Math.round(cWin * f / RATE);
    const w = (2 * Math.PI * k) / cWin;
    const coeff = 2 * Math.cos(w);
    let s0 = 0, s1 = 0, s2 = 0;
    for (let i = 0; i < cWin; i++) {
      const sample = pcm[offset + i] * (0.54 - 0.46 * Math.cos(2 * Math.PI * i / cWin));
      s0 = sample + coeff * s1 - s2;
      s2 = s1;
      s1 = s0;
    }
    const power = s1 * s1 + s2 * s2 - coeff * s1 * s2;
    chroma[midi % 12] += Math.max(0, power);
  }
}

// Krumhansl-Schmuckler key profiles
const majProf = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const minProf = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

const keyCandidates = [];
for (let r = 0; r < 12; r++) {
  let scoreMaj = 0, scoreMin = 0;
  for (let i = 0; i < 12; i++) {
    scoreMaj += chroma[(r + i) % 12] * majProf[i];
    scoreMin += chroma[(r + i) % 12] * minProf[i];
  }
  keyCandidates.push({ name: `${noteNames[r]} Major`, score: scoreMaj });
  keyCandidates.push({ name: `${noteNames[r]} Minor`, score: scoreMin });
}
keyCandidates.sort((a, b) => b.score - a.score);

// Format Results
console.log(`Source: ${fileOrUrl}`);
if (metadata.title) console.log(`Title: ${metadata.title}`);
if (metadata.artist) console.log(`Artist / Channel: ${metadata.artist}`);
console.log(`Duration: ${duration.toFixed(1)} s (${Math.floor(duration / 60)}m ${(duration % 60).toFixed(1)}s)`);

if (picked.length > 0) {
  const top = picked[0].s;
  console.log(`Estimated Tempo: ${picked[0].bpm.toFixed(1)} BPM`);
  for (const p of picked.slice(1)) {
    console.log(`  Alternative candidate: ${p.bpm.toFixed(1)} BPM (rel strength ${(p.s / top).toFixed(2)})`);
  }
}

console.log(`Estimated Key: ${keyCandidates[0].name}`);
console.log(`  Alternative key: ${keyCandidates[1].name}`);

if (stanzas > 0) {
  const per = duration / stanzas;
  console.log(`\nStanzas: ${stanzas}, average ${per.toFixed(2)} s each.`);
  for (const p of picked) {
    console.log(`  At ${p.bpm.toFixed(1)} BPM: about ${(per * p.bpm / 60).toFixed(1)} beats per stanza`);
  }
}

// Clean up temporary audio file if downloaded
if (isTempFile && fs.existsSync(targetFile)) {
  try { fs.unlinkSync(targetFile); } catch (e) {}
}
