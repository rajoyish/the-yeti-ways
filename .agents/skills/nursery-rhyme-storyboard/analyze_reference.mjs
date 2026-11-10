#!/usr/bin/env node
/**
 * analyze_reference.mjs
 *
 * Measures a reference nursery rhyme recording for nursery-rhyme-storyboard: its duration and an
 * estimated tempo. It decodes the audio with ffmpeg (mono, 11025 Hz), builds an onset-strength
 * envelope, and autocorrelates it over 60-180 BPM. The estimate is a starting point: the strongest
 * peak is often half or double the felt tempo, so the two runners-up are printed too, and the skill
 * picks the one that fits the lyrics' stresses.
 *
 * Usage:
 *   node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <audio or video file> [--stanzas N]
 *
 * With --stanzas N it also prints the average seconds per stanza and the beats per stanza at each
 * candidate tempo.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--stanzas");
const si = args.indexOf("--stanzas");
const stanzas = si >= 0 ? Number(args[si + 1]) : 0;
if (!file || args.includes("-h") || args.includes("--help")) {
  console.log("Usage: node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file> [--stanzas N]");
  process.exit(file ? 0 : 1);
}
if (!fs.existsSync(file)) { console.error(`File not found: ${file}`); process.exit(1); }

const RATE = 11025;
const ff = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-vn", "-ac", "1", "-ar", String(RATE), "-f", "f32le", "-"],
  { maxBuffer: 1 << 30 });
if (ff.error) { console.error("ffmpeg not found: install it, or estimate the tempo from the lyrics."); process.exit(1); }
if (ff.status !== 0) { console.error(`ffmpeg could not decode ${file}:\n${ff.stderr}`); process.exit(1); }

const buf = ff.stdout;
const pcm = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
const duration = pcm.length / RATE;
if (duration < 5) { console.error("The audio is under 5 seconds: too short to estimate a tempo."); process.exit(1); }

// Onset strength: positive change in log energy per hop.
const HOP = 128; // about 11.6 ms
const WIN = 512;
const frames = Math.floor((pcm.length - WIN) / HOP);
const energy = new Float32Array(frames);
for (let f = 0; f < frames; f++) {
  let s = 0;
  for (let i = 0; i < WIN; i++) { const v = pcm[f * HOP + i]; s += v * v; }
  energy[f] = Math.log(1e-9 + s);
}
const onset = new Float32Array(frames);
for (let f = 1; f < frames; f++) onset[f] = Math.max(0, energy[f] - energy[f - 1]);
const mean = onset.reduce((a, b) => a + b, 0) / frames;
for (let f = 0; f < frames; f++) onset[f] -= mean;

// Autocorrelation over the tempo range, weighted gently toward a moderate tempo.
const fps = RATE / HOP;
const scores = [];
for (let bpm = 60; bpm <= 180; bpm += 0.5) {
  const lag = (60 / bpm) * fps;
  let s = 0;
  for (const mult of [1, 2, 4]) {
    const l = lag * mult, l0 = Math.floor(l), fr = l - l0;
    let acc = 0;
    for (let f = 0; f + l0 + 1 < frames; f++) acc += onset[f] * (onset[f + l0] * (1 - fr) + onset[f + l0 + 1] * fr);
    s += acc / mult;
  }
  const weight = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 110), 2) / 0.6);
  scores.push({ bpm, s: s * weight });
}

// Local peaks, strongest first, at least 8 BPM apart.
const peaks = scores
  .filter((p, i) => i > 0 && i < scores.length - 1 && p.s >= scores[i - 1].s && p.s >= scores[i + 1].s && p.s > 0)
  .sort((a, b) => b.s - a.s);
const picked = [];
for (const p of peaks) {
  if (picked.every(q => Math.abs(q.bpm - p.bpm) >= 8)) picked.push(p);
  if (picked.length === 3) break;
}
if (picked.length === 0) { console.log(`Duration: ${duration.toFixed(1)} s\nNo clear pulse found; estimate the tempo from the lyrics.`); process.exit(0); }

const top = picked[0].s;
console.log(`File: ${file}`);
console.log(`Duration: ${duration.toFixed(1)} s`);
console.log(`Estimated tempo: ${picked[0].bpm} BPM`);
for (const p of picked.slice(1)) console.log(`  Alternative: ${p.bpm} BPM (relative strength ${(p.s / top).toFixed(2)})`);
console.log("Check half and double of each value against the lyrics' stresses before choosing.");
if (stanzas > 0) {
  const per = duration / stanzas;
  console.log(`\nStanzas: ${stanzas}, average ${per.toFixed(2)} s each (includes any intro, outro, or gaps).`);
  for (const p of picked) console.log(`  At ${p.bpm} BPM: about ${(per * p.bpm / 60).toFixed(1)} beats per stanza`);
}
