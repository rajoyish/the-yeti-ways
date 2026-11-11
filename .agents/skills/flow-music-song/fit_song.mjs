#!/usr/bin/env node
/**
 * fit_song.mjs
 *
 * Checks a song downloaded from Google Flow Music against a storyboard's clock and, on request,
 * cuts it to the exact film length so it drops in under the storyboard's videos.
 *
 * It reports the song's duration, where the first sound starts (leading silence), and how far the
 * song runs past or short of the target. With --out it writes a WAV that starts at --offset and is
 * exactly --duration seconds long: a longer song is cut with a short fade on the last 0.15 s, a
 * shorter one is padded with silence. With --split N it also writes N equal clip-length WAVs
 * (one per video). With --video it replaces the audio of that video with the fitted song.
 *
 * Usage:
 *   node .agents/skills/flow-music-song/fit_song.mjs <song.wav|mp3|m4a> --duration 50
 *        [--offset <seconds>|auto] [--out <fitted.wav>] [--split 5 --split-dir <dir>]
 *        [--video <film.mp4> --video-out <film-with-song.mp4>]
 *
 * --offset auto skips the detected leading silence, so the first sung note lands on 00:00. Give a
 * number instead when an instrumental pickup must be cut (find it by listening). Requires ffmpeg.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
const flags = new Set(["--duration", "--offset", "--out", "--split", "--split-dir", "--video", "--video-out"]);
const file = argv.find((a, i) => !a.startsWith("--") && !flags.has(argv[i - 1]));
if (!file || argv.includes("-h") || argv.includes("--help")) {
  console.log("Usage: node .agents/skills/flow-music-song/fit_song.mjs <song> --duration <s> [--offset <s>|auto] [--out <wav>] [--split N --split-dir <dir>] [--video <mp4> --video-out <mp4>]");
  process.exit(file ? 0 : 1);
}
if (!fs.existsSync(file)) { console.error(`File not found: ${file}`); process.exit(1); }
const target = Number(opt("--duration"));
if (!(target > 0)) { console.error("Give the film length with --duration <seconds>, e.g. --duration 50."); process.exit(1); }

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.error) { console.error(`${cmd} not found: install ffmpeg (brew install ffmpeg).`); process.exit(1); }
  return r;
};

const probe = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file]);
const duration = Number(probe.stdout.trim());
if (!(duration > 0)) { console.error(`ffprobe could not read ${file}:\n${probe.stderr}`); process.exit(1); }

// Leading silence: the end of a silence that starts at 0.
const sd = run("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "silencedetect=noise=-40dB:d=0.05", "-f", "null", "-"]);
let lead = 0;
const starts = [...sd.stderr.matchAll(/silence_start: (-?[\d.]+)/g)].map(m => Number(m[1]));
const ends = [...sd.stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m => Number(m[1]));
if (starts.length && starts[0] <= 0.02 && ends.length) lead = ends[0];
// Trailing silence: a silence that never ends, or ends at the file end.
let tail = 0;
if (starts.length > ends.length) tail = duration - starts[starts.length - 1];

const f = n => n.toFixed(3);
console.log(`File:              ${file}`);
console.log(`Duration:          ${f(duration)} s (target ${f(target)} s, ${duration >= target ? "+" : ""}${f(duration - target)} s)`);
console.log(`Leading silence:   ${f(lead)} s (first sound at ${f(lead)} s; the first sung note should be at 0.000 after fitting)`);
console.log(`Trailing silence:  ${f(tail)} s`);
console.log("This measures sound, not words: listen to confirm the first sound is the first sung word, not an instrumental pickup.");

const outFile = opt("--out");
if (!outFile) process.exit(0);

const offArg = opt("--offset") ?? "0";
const offset = offArg === "auto" ? lead : Number(offArg);
if (!(offset >= 0)) { console.error("--offset must be a number of seconds or 'auto'."); process.exit(1); }
const remaining = duration - offset;
const fade = remaining > target ? `,afade=t=out:st=${f(target - 0.15)}:d=0.15` : "";
const filter = `atrim=start=${f(offset)},asetpts=PTS-STARTPTS,apad=whole_dur=${f(target)},atrim=end=${f(target)}${fade}`;
const w = run("ffmpeg", ["-y", "-v", "error", "-i", file, "-af", filter, "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", outFile]);
if (w.status !== 0) { console.error(w.stderr); process.exit(1); }
console.log(`Wrote ${outFile}: starts at ${f(offset)} s of the source, exactly ${f(target)} s long${remaining < target ? `, padded ${f(target - remaining)} s of silence` : fade ? ", last 0.15 s faded" : ""}.`);

const n = Number(opt("--split") ?? 0);
if (n > 0) {
  const dir = opt("--split-dir") ?? path.dirname(outFile);
  fs.mkdirSync(dir, { recursive: true });
  const seg = target / n;
  const base = path.basename(outFile, path.extname(outFile));
  for (let k = 0; k < n; k++) {
    const segOut = path.join(dir, `${base}-V${k + 1}.wav`);
    const s = run("ffmpeg", ["-y", "-v", "error", "-i", outFile, "-af", `atrim=start=${f(k * seg)}:end=${f((k + 1) * seg)},asetpts=PTS-STARTPTS`, "-c:a", "pcm_s16le", segOut]);
    if (s.status !== 0) { console.error(s.stderr); process.exit(1); }
    console.log(`Wrote ${segOut}: ${f(k * seg)}-${f((k + 1) * seg)} s`);
  }
}

const video = opt("--video");
if (video) {
  if (!fs.existsSync(video)) { console.error(`Video not found: ${video}`); process.exit(1); }
  const vOut = opt("--video-out") ?? video.replace(/(\.\w+)$/, "-with-song$1");
  const m = run("ffmpeg", ["-y", "-v", "error", "-i", video, "-i", outFile, "-map", "0:v:0", "-map", "1:a:0",
    "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", vOut]);
  if (m.status !== 0) { console.error(m.stderr); process.exit(1); }
  console.log(`Wrote ${vOut}: original picture, original audio replaced by the fitted song.`);
}
