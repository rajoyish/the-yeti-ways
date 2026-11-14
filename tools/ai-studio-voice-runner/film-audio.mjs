#!/usr/bin/env node
// Builds the film's audio clock from a voiced story, for /story-to-storyboard.
//
//   node tools/ai-studio-voice-runner/film-audio.mjs --blocks speech-prompts/<slug>-speech-blocks.md --audio <takes>/story-full.wav
//       Keeps story-full.wav exactly as it is (the default): matches every speech block and sentence to it.
//   node tools/ai-studio-voice-runner/film-audio.mjs --blocks ... --takes <takes folder> --fit-lines
//       Builds a new master, story-film.wav, from the part takes in <takes>/parts/, lengthening a pause (never a
//       word) where a spoken line would otherwise cross a 10-second cut.
//
// Writes speech-prompts/<slug>-film-timeline.json and .md (every block and sentence with its time, and each clip's
// speech on its own 00:00-00:10 clock), and <takes>/clips/clip-NN.wav (each clip's slice of the master, 10 s).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const Stitch = require(path.join(here, "stitch.js"));
globalThis.Stitch = Stitch;
const Story = require(path.join(here, "story.js"));
const Timeline = require(path.join(here, "timeline.js"));

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const flag = k => args.includes(k);
const blocksPath = opt("--blocks");
if (!blocksPath || (!opt("--audio") && !opt("--takes"))) {
  console.log("Usage: node tools/ai-studio-voice-runner/film-audio.mjs --blocks speech-prompts/<slug>-speech-blocks.md (--audio <story-full.wav> | --takes <folder> --fit-lines) [--out speech-prompts] [--max-chars 1500]");
  process.exit(1);
}
const ab = f => { const b = fs.readFileSync(f); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };

const doc = Story.parseSpeechBlocks(fs.readFileSync(blocksPath, "utf8"), path.basename(blocksPath));
const blocks = doc.blocks.map(b => ({ id: b.id, speaker: b.speaker, voice: b.voice, text: b.text }));
const outDir = opt("--out") || path.dirname(blocksPath);

let timeline, notes, masterPath, mix, rate;
if (flag("--fit-lines")) {
  const dir = opt("--takes") || path.dirname(opt("--audio"));
  // Which blocks each part take holds: the extension's story-manifest.json, or the same plan the extension makes.
  const manifestPath = path.join(dir, "story-manifest.json");
  let partList;
  if (fs.existsSync(manifestPath)) {
    const man = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    partList = man.parts.map(p => ({ id: p.id, file: path.join(dir, p.file), blocks: p.blocks.map(id => blocks.findIndex(b => b.id === id)) }));
  } else {
    const parts = Story.planParts(doc.blocks, { voices: doc.voices, styles: doc.styles, maxChars: Number(opt("--max-chars") || 1500) });
    partList = parts.map(p => ({ id: p.id, file: path.join(dir, "parts", `${p.id.toLowerCase()}.wav`), blocks: p.blocks.map(b => blocks.findIndex(x => x.id === b.id)) }));
  }
  const missing = partList.filter(p => !fs.existsSync(p.file)).map(p => p.id);
  if (missing.length) { console.error(`Missing part takes: ${missing.join(", ")}`); process.exit(1); }
  const film = Timeline.buildFilm({ blocks, takes: partList.map(p => ({ id: p.id, wav: ab(p.file), blocks: p.blocks })) });
  ({ timeline, notes, mix, rate } = film);
  masterPath = path.join(dir, "story-film.wav");
  fs.writeFileSync(masterPath, Buffer.from(Stitch.encodeWav(mix, rate, 1)));
} else {
  masterPath = opt("--audio") || path.join(opt("--takes"), "story-full.wav");
  // Timing fixes heard by ear: { "B029": 370.69 } (a block's first word, in seconds of the master).
  const fixPath = opt("--fixes") || path.join(outDir, `${doc.slug}-timing-fixes.json`);
  const fixes = {};
  // The extension's story-manifest.json gives each part's start in story-full.wav (each part is trimmed to
  // 0.05 s before its first word), so the first block of every part is anchored exactly; with "one speech
  // block per run" that is every block, and nothing is left to matching.
  const manPath = path.join(path.dirname(masterPath), "story-manifest.json");
  if (fs.existsSync(manPath) && !flag("--no-manifest")) {
    const man = JSON.parse(fs.readFileSync(manPath, "utf8"));
    for (const p of man.parts || []) if (p.blocks?.length && Number.isFinite(p.start) && p.start > 0) fixes[p.blocks[0]] = p.start + 0.05;
  }
  if (fs.existsSync(fixPath)) Object.assign(fixes, JSON.parse(fs.readFileSync(fixPath, "utf8")));
  ({ timeline, notes } = Timeline.timelineOf({ wav: ab(masterPath), blocks, fixes }));
  const w = Stitch.parseWav(ab(masterPath));
  mix = w.data; rate = w.rate;
}
timeline.title = doc.title; timeline.slug = doc.slug; timeline.master = path.basename(masterPath);

// Each clip's 10-second slice of the master, for listening and for previews against the Flow clips.
const clipDir = path.join(path.dirname(masterPath), "clips");
fs.mkdirSync(clipDir, { recursive: true });
const L = Math.round(timeline.clipLength * rate);
for (let k = 0; k < timeline.clips; k++) {
  const slice = new Float32Array(L);
  slice.set(mix.subarray(k * L, Math.min(mix.length, (k + 1) * L)));
  fs.writeFileSync(path.join(clipDir, `clip-${String(k + 1).padStart(2, "0")}.wav`), Buffer.from(Stitch.encodeWav(slice, rate, 1)));
}

// Every spoken line on its own, cut from the master at its matched time, to confirm by ear: each file must hold
// exactly that line, start to end, in that speaker's voice. A wrong one is fixed in the timing-fixes file.
const lineDir = path.join(path.dirname(masterPath), "lines");
fs.rmSync(lineDir, { recursive: true, force: true });
fs.mkdirSync(lineDir, { recursive: true });
for (const b of timeline.blocks.filter(b => b.kind === "dialogue")) {
  const a = Math.max(0, Math.round((b.start - 0.3) * rate)), z = Math.min(mix.length, Math.round((b.end + 0.3) * rate));
  const slug = b.speaker.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  b.check = `lines/${b.id}-${slug}.wav`;
  fs.writeFileSync(path.join(path.dirname(masterPath), b.check), Buffer.from(Stitch.encodeWav(mix.subarray(a, z), rate, 1)));
}

const plan = Timeline.clipPlan(timeline);
timeline.plan = plan;
const base = path.join(outDir, `${doc.slug}-film-timeline`);
fs.writeFileSync(`${base}.json`, JSON.stringify(timeline, null, 1));
fs.writeFileSync(`${base}.md`, Timeline.planMarkdown({ title: doc.title, slug: doc.slug, timeline, plan, notes, audioDir: path.dirname(masterPath).replace(/\\/g, "/") }));

const spoken = timeline.blocks.filter(b => b.kind === "dialogue");
console.log(`${doc.title}: ${Timeline.fmt(timeline.duration)} of audio, ${timeline.clips} clips of ${timeline.clipLength} s, ${timeline.blocks.length} blocks (${spoken.length} spoken lines, ${spoken.filter(b => b.straddle).length} crossing a cut).`);
console.log(`Master: ${masterPath}`);
console.log(`Wrote ${base}.json, ${base}.md, and ${timeline.clips} clip slices in ${clipDir}`);
for (const n of notes) console.log(`Note: ${n}`);
