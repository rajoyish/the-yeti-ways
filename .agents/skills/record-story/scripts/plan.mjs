#!/usr/bin/env node
// record-story step 1: turn a speech-blocks file into the in-page AI Studio runner.
//
//   node .agents/skills/record-story/scripts/plan.mjs speech-prompts/<slug>-speech-blocks.md
//        [--takes ~/Downloads/speech-takes/<slug>] [--only B016,B023] [--missing]
//
// Writes <takes>/runner.js (paste it whole into the AI Studio generate-speech page) and prints the
// blocks, voices and styles exactly as the AI Studio Voice Runner would send them in
// "One speech block per run" mode (styles include its hints from the surrounding narration).
// --only voices just those blocks; --missing voices only blocks with no parts/pNN.wav yet.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
// fileURLToPath, not URL.pathname: on Windows the pathname is "/C:/...", which resolves to "C:\C:\...".
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../../..");
const Story = require(path.join(ROOT, "tools/ai-studio-voice-runner/story.js"));

const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const file = argv.find(a => a.endsWith(".md"));
if (!file) { console.error("Usage: plan.mjs <speech-blocks.md> [--takes dir] [--only B001,B002] [--missing]"); process.exit(2); }
const home = p => (p && p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);

const doc = Story.parseSpeechBlocks(fs.readFileSync(file, "utf8"), path.basename(file));
if (doc.source !== "blocks" || !doc.blocks.length) { console.error("Not a speech-blocks file (run /ai-studio-tts on the story first)."); process.exit(1); }
const styles = Story.stylesFor(doc.blocks, doc.styles);
const parts = Story.planParts(doc.blocks, { voices: doc.voices, styles: doc.styles, maxChars: 1 }); // one block per run
const takes = home(opt("--takes")) || path.join(os.homedir(), "Downloads", "speech-takes", doc.slug);

let list = doc.blocks.map((b, i) => ({ id: b.id, part: parts[i].id, speaker: b.speaker, voice: b.voice, style: styles[i], text: b.text }));
if (opt("--only")) { const want = new Set(opt("--only").split(",").map(s => s.trim().toUpperCase())); list = list.filter(b => want.has(b.id)); }
if (argv.includes("--missing")) list = list.filter(b => !fs.existsSync(path.join(takes, "parts", `${b.part.toLowerCase()}.wav`)));
if (!list.length) { console.log("Nothing to voice: every selected block already has a take."); process.exit(0); }

const tpl = fs.readFileSync(path.join(HERE, "runner.template.js"), "utf8");
const runner = tpl.replace("__BLOCKS__", JSON.stringify(list.map(({ part, ...b }) => b))).replace("__SLUG__", JSON.stringify(doc.slug));
fs.mkdirSync(takes, { recursive: true });
fs.writeFileSync(path.join(takes, "runner.js"), runner);

const voices = {};
for (const b of list) voices[`${b.speaker} (${b.voice})`] = (voices[`${b.speaker} (${b.voice})`] || 0) + 1;
console.log(`Story:   ${doc.title} (${doc.slug})`);
const nWords = list.reduce((n, b) => n + b.text.split(/\s+/).filter(w => /\w/.test(w)).length, 0);
const secs = Math.round(nWords / 1.9 + list.length * 0.7); // storyteller pace plus the gaps between takes
console.log(`Blocks:  ${list.length} of ${doc.blocks.length} to voice, one per run (${list.length} AI Studio request${list.length === 1 ? "" : "s"}; the daily quota is about 50)`);
console.log(`Voices:  ${Object.entries(voices).map(([k, n]) => `${k} ${n}`).join(", ")}`);
console.log(`Words:   ${nWords} (about ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")} of audio)`);
console.log(`Runner:  ${path.join(takes, "runner.js")} (${runner.length} characters)`);
