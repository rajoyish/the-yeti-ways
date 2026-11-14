#!/usr/bin/env node
// Puts the film together from the Flow clips and the AI Studio audio (needs ffmpeg and ffprobe on PATH).
//
//   Preview one or more clips with their AI Studio audio, to judge lip sync before approving a take:
//     node tools/ai-studio-voice-runner/assemble.mjs --timeline speech-prompts/<slug>-film-timeline.json --clips <folder> --preview 7,8
//     (--preview all for every clip found). Writes <clips>/previews/V07-preview.mp4: the Flow picture with the
//     clip's slice of the master audio, and Flow's own audio mixed in very low so a mismatch is easy to hear.
//
//   Assemble the film:
//     node tools/ai-studio-voice-runner/assemble.mjs --timeline speech-prompts/<slug>-film-timeline.json --clips <folder> --out <film.mp4> [--tail 2]
//     Every clip in order (a file whose name holds "V<number>" or "Video <number>"; the newest one wins when a
//     video has several takes), Flow's audio removed, the master audio laid under it from 0:00, and the film cut
//     to the master's length. --tail holds the last frame for that many extra seconds of silence at the end.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const tlPath = opt("--timeline"), clipDir = opt("--clips");
if (!tlPath || !clipDir) {
  console.log("Usage: node tools/ai-studio-voice-runner/assemble.mjs --timeline <film-timeline.json> --clips <folder> (--preview <n,n|all> | --out <film.mp4> [--tail <seconds>] [--audio <master.wav>])");
  process.exit(1);
}
const tl = JSON.parse(fs.readFileSync(tlPath, "utf8"));
const audioDir = opt("--audio-dir");
const master = opt("--audio") || findMaster();
function findMaster() {
  const guesses = [audioDir, path.join(process.env.USERPROFILE || process.env.HOME || "", "Downloads", "speech-takes", tl.slug)].filter(Boolean);
  for (const d of guesses) { const f = path.join(d, tl.master); if (fs.existsSync(f)) return f; }
  console.error(`Cannot find ${tl.master}; pass --audio <path>.`); process.exit(1);
}

const run = (cmd, a) => execFileSync(cmd, a, { stdio: ["ignore", "pipe", "pipe"] }).toString();
const probe = f => Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).trim());

// Clips: the newest file per video number.
const clips = new Map();
for (const name of fs.readdirSync(clipDir)) {
  if (!/\.(mp4|mov|webm)$/i.test(name)) continue;
  const m = name.match(/\bV(?:ideo)?[\s_-]*0*(\d+)\b/i);
  if (!m) continue;
  const n = Number(m[1]), f = path.join(clipDir, name), t = fs.statSync(f).mtimeMs;
  if (!clips.has(n) || clips.get(n).t < t) clips.set(n, { n, f, t });
}
if (!clips.size) { console.error(`No clips named V<number> in ${clipDir}.`); process.exit(1); }

const L = tl.clipLength;
const preview = opt("--preview");
if (preview) {
  const want = preview === "all" ? [...clips.keys()] : preview.split(",").map(Number);
  const outDir = path.join(clipDir, "previews");
  fs.mkdirSync(outDir, { recursive: true });
  for (const n of want.sort((a, b) => a - b)) {
    const c = clips.get(n);
    if (!c) { console.log(`V${n}: no clip found`); continue; }
    const d = probe(c.f);
    const out = path.join(outDir, `V${String(n).padStart(2, "0")}-preview.mp4`);
    // Master slice for this clip, plus Flow's own track at -18 dB as a guide.
    run("ffmpeg", ["-y", "-v", "error", "-i", c.f, "-ss", String((n - 1) * L), "-t", String(L), "-i", master,
      "-filter_complex", "[0:a]volume=0.12[g];[1:a][g]amix=inputs=2:duration=first:normalize=0[a]",
      "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", String(L), out]);
    console.log(`V${n}: ${path.basename(c.f)} (${d.toFixed(2)} s${Math.abs(d - L) > 0.05 ? " - NOT 10 s" : ""}) -> ${out}`);
  }
  process.exit(0);
}

const outPath = opt("--out");
if (!outPath) { console.error("Pass --out <film.mp4> or --preview <n>."); process.exit(1); }
const missing = [];
for (let n = 1; n <= tl.clips; n++) if (!clips.has(n)) missing.push(n);
if (missing.length) { console.error(`Missing clips: V${missing.join(", V")}. The film needs ${tl.clips}.`); process.exit(1); }
const list = [];
for (let n = 1; n <= tl.clips; n++) {
  const c = clips.get(n), d = probe(c.f);
  if (Math.abs(d - L) > 0.05) console.log(`Note: V${n} is ${d.toFixed(2)} s, not ${L} s; the film after it shifts by ${(d - L).toFixed(2)} s.`);
  list.push(`file '${c.f.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`);
}
const listFile = path.join(clipDir, "concat-list.txt");
fs.writeFileSync(listFile, list.join("\n"));
const tail = Math.max(0, Number(opt("--tail") || 0));
const total = tl.duration + tail;
const vf = tail ? ["-vf", `tpad=stop_mode=clone:stop_duration=${tail + L}`] : [];
// Replacing Flow's audio removes its music and effects too. --bed <file> lays a music or ambience track under the
// voices (--bed-db, default -16 dB, looped to the film's length, faded out over the last 2 s).
const bed = opt("--bed");
let audioArgs;
if (bed) {
  const db = Number(opt("--bed-db") || -16);
  audioArgs = ["-stream_loop", "-1", "-i", bed, "-filter_complex",
    `[1:a]apad=pad_dur=${tail}[v];[2:a]volume=${db}dB,afade=t=out:st=${Math.max(0, total - 2).toFixed(2)}:d=2[b];[v][b]amix=inputs=2:duration=first:normalize=0[a]`,
    "-map", "0:v", "-map", "[a]"];
} else audioArgs = ["-map", "0:v", "-map", "1:a", ...(tail ? ["-af", `apad=pad_dur=${tail}`] : [])];
run("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listFile, "-i", master, ...audioArgs,
  ...vf, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-t", total.toFixed(3), outPath]);
console.log(`Wrote ${outPath}: ${tl.clips} clips, ${probe(outPath).toFixed(2)} s (audio ${tl.duration.toFixed(2)} s${tail ? ` + ${tail} s held ending` : ""}).`);
