#!/usr/bin/env node
// record-story step 3: unpack the takes, join story-full.wav, write story-manifest.json, verify.
//
//   node .agents/skills/record-story/scripts/finish.mjs speech-prompts/<slug>-speech-blocks.md
//        [--takes ~/Downloads/speech-takes/<slug>] [--bundle file.bin] [--gap 0.7] [--no-verify]
//
// Reads every ~/Downloads/<slug>-takes*.bin the runner saved (oldest first, so a retake replaces the
// earlier take), writes each take as parts/pNN.wav (the AI Studio Voice Runner's layout), moves the
// bundles into <takes>/bundles/, and, once every block has a take, joins them exactly as the extension
// does (Stitch.joinTakes, 0.7 s between takes) into story-full.wav with its story-manifest.json, which
// film-audio.mjs reads to anchor every line. Then runs verify.mjs (whisper.cpp) unless --no-verify.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
// fileURLToPath, not URL.pathname: on Windows the pathname is "/C:/...", which resolves to "C:\C:\...".
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../../..");
const Story = require(path.join(ROOT, "tools/ai-studio-voice-runner/story.js"));
const Stitch = require(path.join(ROOT, "tools/ai-studio-voice-runner/stitch.js"));

const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const file = argv.find(a => a.endsWith(".md"));
if (!file) { console.error("Usage: finish.mjs <speech-blocks.md> [--takes dir] [--bundle file.bin] [--gap 0.7] [--no-verify]"); process.exit(2); }
const home = p => (p && p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);

const doc = Story.parseSpeechBlocks(fs.readFileSync(file, "utf8"), path.basename(file));
const parts = Story.planParts(doc.blocks, { voices: doc.voices, styles: doc.styles, maxChars: 1 });
const partOf = Object.fromEntries(parts.map(p => [p.blocks[0].id, p]));
const takes = home(opt("--takes")) || path.join(os.homedir(), "Downloads", "speech-takes", doc.slug);
fs.mkdirSync(path.join(takes, "parts"), { recursive: true });

// ---- unpack bundles: [u32 header length][JSON header][wav bytes ...] ----
const downloads = path.join(os.homedir(), "Downloads");
const bundles = opt("--bundle") ? [home(opt("--bundle"))]
  : fs.readdirSync(downloads).filter(n => n.startsWith(`${doc.slug}-takes`) && n.endsWith(".bin")).map(n => path.join(downloads, n))
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
let unpacked = 0;
for (const bf of bundles) {
  const bin = fs.readFileSync(bf);
  const hl = bin.readUInt32LE(0);
  let hdr = JSON.parse(bin.subarray(4, 4 + hl).toString("utf8"));
  if (Array.isArray(hdr)) hdr = { takes: hdr }; // first bundles (2026-11-27) held only the list
  let off = 4 + hl;
  for (const t of hdr.takes) {
    const wav = bin.subarray(off, off + t.bytes); off += t.bytes;
    const p = partOf[t.id];
    if (!p) { console.warn(`  ${t.id} is not in ${path.basename(file)}; skipped.`); continue; }
    fs.writeFileSync(path.join(takes, "parts", `${p.id.toLowerCase()}.wav`), wav);
    unpacked++;
  }
  fs.mkdirSync(path.join(takes, "bundles"), { recursive: true });
  const dest = path.join(takes, "bundles", `${new Date(fs.statSync(bf).mtimeMs).toISOString().replace(/[:.]/g, "-")}-${path.basename(bf)}`);
  fs.renameSync(bf, dest);
  console.log(`Unpacked ${hdr.takes.length} takes from ${path.basename(bf)} (kept in bundles/).`);
}
if (!bundles.length) console.log("No new bundle in Downloads; joining the takes already in parts/.");

// ---- join ----
const missing = parts.filter(p => !fs.existsSync(path.join(takes, "parts", `${p.id.toLowerCase()}.wav`)));
if (missing.length) {
  console.error(`Missing takes for ${missing.map(p => p.blocks[0].id).join(", ")}. Voice them (plan.mjs --missing), then run this again.`);
  process.exit(1);
}
const items = parts.map(p => { const b = fs.readFileSync(path.join(takes, "parts", `${p.id.toLowerCase()}.wav`)); return { id: p.id, wav: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) }; });
const r = Stitch.joinTakes({ items, gap: Number(opt("--gap") ?? 0.7) });
for (const n of r.notes) console.warn(`  ⚠ ${n}`);
fs.writeFileSync(path.join(takes, "story-full.wav"), Buffer.from(r.wav));
const manifest = { title: doc.title, slug: doc.slug, perBlock: true,
  parts: parts.map(p => ({ id: p.id, file: `parts/${p.id.toLowerCase()}.wav`, blocks: p.blocks.map(b => b.id), start: +(r.placed.find(x => x.id === p.id)?.start || 0).toFixed(3) })) };
fs.writeFileSync(path.join(takes, "story-manifest.json"), JSON.stringify(manifest, null, 1));
const mm = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
console.log(`Joined ${parts.length} takes${unpacked ? ` (${unpacked} new)` : ""} into ${path.join(takes, "story-full.wav")}: ${mm(r.length)} (${r.length.toFixed(2)} s), ${Math.ceil(r.length / 10)} ten-second clips.`);
console.log(`Manifest: ${path.join(takes, "story-manifest.json")}`);

if (!argv.includes("--no-verify")) {
  const v = spawnSync(process.execPath, [path.join(HERE, "verify.mjs"), file, "--takes", takes], { stdio: "inherit" });
  process.exit(v.status ?? 1);
}
