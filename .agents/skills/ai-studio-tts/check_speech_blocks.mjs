#!/usr/bin/env node
// Checks a story speech-blocks file against its story.
//   node .agents/skills/ai-studio-tts/check_speech_blocks.mjs speech-prompts/<slug>-speech-blocks.md stories/<slug>-story.md
// Prints every problem, then OK or FAILED.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [blocksPath, storyPath] = process.argv.slice(2);
if (!blocksPath || !storyPath) { console.error("usage: check_speech_blocks.mjs <speech-blocks.md> <story.md>"); process.exit(2); }

const here = dirname(fileURLToPath(import.meta.url));
// The Yeti voices never change; the Narrator defaults to Charon and may be any Flow voice no one else uses.
const FIXED = { "Papa Yeti": "Iapetus", "Mama Yeti": "Erinome", "Babu Yeti": "Puck" };
const NARRATOR_DEFAULT = "Charon";
const HEAD = /^\s*Speaker\s+(\d+)\s*-\s*([^:\n]+?)\s*:\s*$/i;
const SEP = /^\s*---+\s*$/;
const errors = [], notes = [];
const err = m => errors.push(m), note = m => notes.push(m);

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
function section(lines, name) {
  const i = lines.findIndex(l => new RegExp(`^##\\s+${name}\\s*$`, "i").test(l.trim()));
  if (i < 0) return null;
  let j = i + 1;
  while (j < lines.length && !/^##\s/.test(lines[j])) j++;
  return lines.slice(i + 1, j);
}
const cleanMd = s => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/(^|\W)[*_](.+?)[*_](?=\W|$)/g, "$1$2").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const words = s => cleanMd(s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").split(/\s+/).filter(Boolean);

// The voices a story may use: the 30 in Google Flow (references/voices.md, | Voice | Gender | Description | Pitch | In Flow |).
const known = new Set(), inFlow = new Set();
for (const l of read(join(here, "references", "voices.md")).split("\n")) {
  const m = l.match(/^\|\s*([A-Z][a-z]+)\s*\|\s*(Male|Female|Ungendered)\s*\|\s*[^|]+\|\s*[^|]+\|\s*(yes|no)\s*\|/);
  if (m) { known.add(m[1]); if (m[3] === "yes") inFlow.add(m[1]); }
}

const lines = read(blocksPath).split("\n");
const story = read(storyPath).split("\n");

// Voices table
const table = section(lines, "Voices");
if (!table) err("No ## Voices table.");
const voiceOf = {}, speakerOf = {};
for (const row of (table || []).filter(l => /^\s*\|/.test(l))) {
  const c = row.trim().replace(/^\||\|$/g, "").split("|").map(s => s.trim().replace(/^`|`$/g, ""));
  if (!c[0] || /^-+$/.test(c[0]) || /^speaker$/i.test(c[0])) continue;
  const [spk, voice, style] = c;
  if (!voice) { err(`Voices: ${spk} has no voice.`); continue; }
  if (known.size && !known.has(voice)) err(`Voices: ${spk}'s voice "${voice}" is not one of the 30 Google Flow voices (references/voices.md).`);
  if (FIXED[spk] && FIXED[spk] !== voice) err(`Voices: ${spk} must be ${FIXED[spk]}, not ${voice}.`);
  if (!FIXED[spk] && Object.values(FIXED).includes(voice)) err(`Voices: ${spk} uses ${voice}, a fixed voice of ${Object.keys(FIXED).find(k => FIXED[k] === voice)}.`);
  if (speakerOf[voice]) err(`Voices: ${spk} and ${speakerOf[voice]} share ${voice}; every speaker needs its own voice.`);
  if (spk !== "Narrator" && inFlow.size && known.has(voice) && !inFlow.has(voice)) note(`Voices: ${spk}'s voice ${voice} is not in Google Flow, so its Flow Character cannot speak with the same voice; prefer a voice marked "In Flow" in references/voices.md.`);
  if (!style) note(`Voices: ${spk} has no style.`);
  else if (style.split(/\s+/).length > 16) note(`Voices: ${spk}'s style is ${style.split(/\s+/).length} words; keep it short.`);
  voiceOf[spk] = voice; speakerOf[voice] ??= spk;
}
if (!voiceOf.Narrator) err("Voices: no Narrator row.");
const narr = voiceOf.Narrator || NARRATOR_DEFAULT;

// Speech blocks
const body = section(lines, "Speech blocks");
if (!body) err("No ## Speech blocks section.");
const blocks = [];
let cur = null, n = 0;
(body || []).forEach((l, i) => {
  const h = l.match(HEAD);
  if (h) {
    if (cur) err(`Block ${cur.n} (${cur.voice}) is not closed with --- before the next block.`);
    cur = { n: ++n, num: h[1], voice: h[2].trim(), lines: [] };
    if (!/^Speaker 1 - [^:]+:$/.test(l.trim())) err(`Block ${n}: write the head as "Speaker 1 - ${cur.voice}:" exactly.`);
    return;
  }
  if (SEP.test(l)) {
    if (!cur) { err(`A --- with no block before it (line ${i + 1} of the section).`); return; }
    blocks.push(cur); cur = null; return;
  }
  if (cur) cur.lines.push(l);
  else if (l.trim()) err(`Text outside a block: "${l.trim().slice(0, 50)}".`);
});
if (cur) err(`The last block (${cur.voice}) is not closed with ---.`);

blocks.forEach((b, i) => {
  const text = b.lines.map(s => s.trim()).filter(Boolean);
  b.text = text.join("\n");
  const tag = `Block ${b.n} (${b.voice})`;
  if (!text.length) { err(`${tag} is empty.`); return; }
  if (b.lines.some(s => s.trim() === "") && b.lines.findIndex(s => s.trim()) < b.lines.findLastIndex(s => s.trim() === "")) note(`${tag} has a blank line inside; paragraphs go on consecutive lines.`);
  if (!speakerOf[b.voice] && !Object.values(FIXED).includes(b.voice)) err(`${tag}: ${b.voice} is not in the Voices table.`);
  const quoted = text.every(s => /^["“].*["”]$/.test(s));
  const hasQuote = /["“”]/.test(b.text);
  b.kind = quoted ? "dialogue" : hasQuote ? "mixed" : "narration";
  if (b.kind === "mixed") err(`${tag} mixes narration and a quoted line; give the quote its own block.`);
  if (b.kind === "narration" && b.voice !== narr) err(`${tag} is narration but not in the Narrator's voice (${narr}).`);
  if (b.kind === "dialogue" && b.voice === narr) err(`${tag} is a quoted line in the Narrator's voice; who says it?`);
  if (/\[[^\]]+\]/.test(b.text)) err(`${tag} has a square-bracket tag, which can be read aloud.`);
  const prev = blocks[i - 1];
  if (prev && prev.voice === b.voice) err(`${tag} follows a block in the same voice; merge them into one block.`);
});

// Every word of ## Story, in order
const sb = section(story, "Story");
if (!sb) err("The story has no ## Story section.");
else {
  const want = words(sb.join(" ")), got = words(blocks.map(b => b.text).join(" "));
  const k = want.findIndex((w, i) => w !== got[i]);
  if (k >= 0 || want.length !== got.length) {
    const at = k >= 0 ? k : Math.min(want.length, got.length);
    err(`The blocks' words differ from ## Story at word ${at + 1}: story "${want.slice(Math.max(0, at - 4), at + 6).join(" ")}" / blocks "${got.slice(Math.max(0, at - 4), at + 6).join(" ")}".`);
  }
}

const count = {};
for (const b of blocks) count[speakerOf[b.voice] || b.voice] = (count[speakerOf[b.voice] || b.voice] || 0) + 1;
console.log(`${blocks.length} blocks: ${Object.entries(count).map(([s, c]) => `${s} ${c}`).join(", ")}`);
for (const m of notes) console.log(`Note: ${m}`);
for (const m of errors) console.log(`Error: ${m}`);
console.log(errors.length ? `FAILED (${errors.length})` : "OK");
process.exit(errors.length ? 1 : 0);
