#!/usr/bin/env node
/**
 * check_speech.mjs
 *
 * Checks the narration and dialogue of a story-to-storyboard film
 * (prompts/<slug>-<N x 10>s-storyboard.md): the Voices and Speech lines of every Agent prompt,
 * and the ## Script table. It checks timing and structure only; it cannot hear a clip.
 *
 * Usage:
 *   node .agents/skills/story-to-storyboard/check_speech.mjs prompts/<slug>-<N x 10>s-storyboard.md
 *
 * Prints "Problem:" lines (must be fixed; exit status 1) and "Note:" lines (read and decide),
 * then "OK" when there are no problems.
 */

import fs from "node:fs";

const MAX_RATE = 2.8;   // words per second of a line's window
const HARD_RATE = 3.2;  // above this a line is a problem, not a note
const MAX_WORDS = 22;   // spoken words per 10-second video
const FIRST = 0.5;      // no word before 00:00.5
const LAST = 9.5;       // no word after 00:09.5
const FIXED = "Each line is spoken once, exactly as written, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.";

const file = process.argv[2];
if (!file || file === "--help" || file === "-h") {
  console.log("Usage: node .agents/skills/story-to-storyboard/check_speech.mjs prompts/<slug>-<N x 10>s-storyboard.md");
  process.exit(file ? 0 : 1);
}
if (!fs.existsSync(file)) { console.error(`File not found: ${file}`); process.exit(1); }

const content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const lines = content.split("\n");

let problems = 0;
let notes = 0;
const problem = (where, msg) => { problems++; console.log(`Problem: ${where}: ${msg}`); };
const note = (where, msg) => { notes++; console.log(`Note: ${where}: ${msg}`); };

const secs = t => { const [m, s] = t.split(":"); return Number(m) * 60 + Number(s); };
const words = s => (s.match(/[A-Za-z0-9'’-]+/g) || []).length;
const fmtFilm = x => { const m = Math.floor(x / 60); const s = (x - m * 60).toFixed(1).padStart(4, "0"); return `${m}:${s}`; };

// Collect each video's Agent prompt.
const videos = [];
for (let i = 0; i < lines.length; i++) {
  const h = lines[i].match(/^## Video (\d+) - (.+)$/);
  if (!h) continue;
  let j = i + 1;
  while (j < lines.length && lines[j].trim() !== "```text" && !/^## /.test(lines[j])) j++;
  if (j >= lines.length || lines[j].trim() !== "```text") { problem(`Video ${h[1]}`, "no ```text Agent prompt block under the heading"); continue; }
  let k = j + 1;
  while (k < lines.length && lines[k].trim() !== "```") k++;
  videos.push({ n: Number(h[1]), title: h[2].trim(), body: lines.slice(j + 1, k) });
}
if (videos.length === 0) { console.error("No ## Video sections found."); process.exit(1); }

videos.forEach((v, idx) => {
  if (v.n !== idx + 1) problem(`Video ${v.n}`, `videos are not numbered in order (expected Video ${idx + 1})`);
});

// Voices must be identical across the film.
const voiceBook = new Map();
// Script rows expected from the Speech lines.
const expected = [];

const ENTRY = /(\d{2}:\d{2}(?:\.\d+)?)-(\d{2}:\d{2}(?:\.\d+)?), ([A-Z][A-Za-z' -]*?), (on screen|off-screen)((?:, [^:"]+)?): "([^"]+)"/g;

for (const v of videos) {
  const where = `Video ${v.n}`;
  const get = p => v.body.find(l => l.startsWith(p));
  const castLine = get("Cast:") || "";
  const voicesLine = get("Voices:");
  const speechLine = get("Speech:");
  const soundLine = get("Sound:") || "";
  const shots = v.body
    .map(l => l.match(/^(\d{2}:\d{2}(?:\.\d+)?)-(\d{2}:\d{2}(?:\.\d+)?), .*?In frame: (.*?)(?:, and no one else\.|\.(?= ))/))
    .filter(Boolean)
    .map(m => ({ start: secs(m[1]), end: secs(m[2]), inFrame: m[3] }));

  if (!soundLine) problem(where, "no Sound: line");

  if (!speechLine) {
    if (voicesLine) problem(where, "has a Voices: line but no Speech: line");
    if (soundLine && !/No dialogue, no lyrics\.$/.test(soundLine.trim())) problem(where, "a video with no speech ends its Sound: line \"No dialogue, no lyrics.\"");
    continue;
  }

  if (!voicesLine) problem(where, "has a Speech: line but no Voices: line");
  if (/No dialogue/i.test(soundLine)) problem(where, "Sound: line says \"No dialogue\" in a video that has speech");
  if (!/No lyrics, no singing, no other voices\.$/.test(soundLine.trim())) problem(where, "Sound: line in a video with speech ends \"No lyrics, no singing, no other voices.\"");
  if (!/kept low under every spoken line/.test(soundLine)) note(where, "Sound: line does not say the music is \"kept low under every spoken line\"");
  if (!speechLine.trim().endsWith(FIXED)) problem(where, "Speech: line does not end with the fixed one-voice, lip-sync sentence");

  // Order of lines in the block.
  const order = ["Cast:", "Setting:", "Voices:", "Speech:", "Sound:", "Avoid:"].map(p => v.body.findIndex(l => l.startsWith(p)));
  const firstShot = v.body.findIndex(l => /^\d{2}:\d{2}/.test(l));
  const lastShot = v.body.map(l => /^\d{2}:\d{2}/.test(l)).lastIndexOf(true);
  if (!(order[0] < order[1] && order[1] < order[2] && order[2] < firstShot && lastShot < order[3] && order[3] < order[4] && order[4] < order[5])) {
    problem(where, "lines are out of order (Cast, Setting, Voices, shot lines, Speech, Sound, Avoid)");
  }

  // Voices.
  const voices = new Map();
  if (voicesLine) {
    const body = voicesLine.replace(/^Voices:\s*/, "").replace(/\.\s*$/, "");
    for (const part of body.split(/;\s+/)) {
      const c = part.indexOf(": ");
      if (c < 0) { problem(where, `Voices: entry has no "Name: voice" form: "${part}"`); continue; }
      const name = part.slice(0, c).replace(/\s*\(.*\)\s*$/, "").trim();
      const desc = part.slice(c + 2).trim();
      voices.set(name, desc);
      if (/\b(sounds like|in the voice of|voice of|like (?:a|the) famous)\b/i.test(desc)) problem(where, `voice for ${name} compares it to someone ("${desc}")`);
      if (/\b(child|kid|toddler)\b/i.test(desc)) note(where, `voice for ${name} uses a child-risk word ("${desc}")`);
      if (voiceBook.has(name) && voiceBook.get(name) !== desc) problem(where, `voice for ${name} differs from an earlier video`);
      if (!voiceBook.has(name)) voiceBook.set(name, desc);
    }
  }

  // Speech entries.
  const entries = [...speechLine.matchAll(ENTRY)].map(m => ({
    a: secs(m[1]), b: secs(m[2]), clip: `${m[1]}-${m[2]}`, who: m[3].trim(), mode: m[4], text: m[6],
  }));
  if (entries.length === 0) problem(where, "Speech: line has no entries in the form `00:00.5-00:03, Speaker, on screen: \"words\"`");
  const spokenCount = (speechLine.match(/"/g) || []).length / 2;
  if (spokenCount !== entries.length) problem(where, `Speech: line has ${spokenCount} quoted line(s) but ${entries.length} parse as entries; check each entry's form`);

  let total = 0;
  let prevEnd = -1;
  for (const e of entries) {
    const w = words(e.text);
    total += w;
    const len = e.b - e.a;
    if (len <= 0) { problem(where, `${e.clip} ${e.who}: window ends before it starts`); continue; }
    if (e.a < FIRST - 1e-9) problem(where, `${e.clip} ${e.who}: starts before 00:00.5`);
    if (e.b > LAST + 1e-9) problem(where, `${e.clip} ${e.who}: ends after 00:09.5`);
    if (e.a < prevEnd - 1e-9) problem(where, `${e.clip} ${e.who}: overlaps the line before it (one voice at a time)`);
    prevEnd = e.b;
    const rate = w / len;
    if (rate > HARD_RATE) problem(where, `${e.clip} ${e.who}: ${w} words in ${len.toFixed(1)} s is ${rate.toFixed(2)} words/s; give it a longer window or fewer words`);
    else if (rate > MAX_RATE) note(where, `${e.clip} ${e.who}: ${rate.toFixed(2)} words/s is brisk (target ${MAX_RATE})`);
    if (!voices.has(e.who)) problem(where, `${e.who} speaks but is not in the Voices: line`);
    if (e.who === "Narrator") {
      if (e.mode !== "off-screen") problem(where, `${e.clip}: the Narrator is always off-screen`);
    } else {
      if (!castLine.includes(`@${e.who}`)) problem(where, `${e.who} speaks but is not called as @${e.who} in the Cast: line`);
      if (e.mode === "on screen") {
        const shot = shots.find(s => e.a >= s.start - 1e-9 && e.b <= s.end + 1e-9);
        if (!shot) problem(where, `${e.clip} ${e.who}: an on-screen line must sit inside one shot; this one crosses a cut`);
        else if (!shot.inFrame.includes(e.who)) problem(where, `${e.clip} ${e.who}: on screen, but the shot's In frame list does not name ${e.who}`);
      }
    }
    expected.push({ video: v.n, clip: e.clip, film: `${fmtFilm(e.a + (v.n - 1) * 10)}-${fmtFilm(e.b + (v.n - 1) * 10)}`, who: e.who, text: e.text });
  }
  if (total > MAX_WORDS) problem(where, `${total} spoken words; at most ${MAX_WORDS} per video`);
}

// Voice cast table.
const vcStart = lines.findIndex(l => /^## Voice cast\s*$/.test(l));
if (vcStart < 0) problem("file", "no ## Voice cast section");
else {
  const rows = [];
  for (let i = vcStart + 1; i < lines.length && !/^## /.test(lines[i]); i++) {
    const m = lines[i].match(/^\| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$/);
    if (m && !/^(Speaker|-+)$/.test(m[1].trim())) rows.push({ who: m[1].trim(), desc: m[2].trim() });
  }
  for (const [who, desc] of voiceBook) {
    const r = rows.find(x => x.who === who);
    if (!r) problem("Voice cast", `${who} speaks but has no row`);
    else if (r.desc !== desc) problem("Voice cast", `${who}'s voice differs from the Voices: lines`);
  }
  for (const r of rows) if (!voiceBook.has(r.who)) note("Voice cast", `${r.who} has a row but never speaks`);
}

// Script table.
const scStart = lines.findIndex(l => /^## Script\s*$/.test(l));
if (scStart < 0) problem("file", "no ## Script section");
else {
  const rows = [];
  for (let i = scStart + 1; i < lines.length && !/^## /.test(lines[i]); i++) {
    const m = lines[i].match(/^\| (\d+) \| ([0-9:.-]+) \| ([0-9:.-]+) \| ([^|]+?) \| "([^"]+)" \|$/);
    if (m) rows.push({ video: Number(m[1]), clip: m[2], film: m[3], who: m[4].trim(), text: m[5] });
  }
  if (rows.length !== expected.length) problem("Script", `${rows.length} row(s), but the Speech: lines hold ${expected.length} line(s)`);
  expected.forEach((e, i) => {
    const r = rows[i];
    if (!r) return;
    const tag = `row ${i + 1} (Video ${e.video}, ${e.who})`;
    if (r.video !== e.video || r.clip !== e.clip || r.who !== e.who) problem("Script", `${tag}: expected Video ${e.video}, ${e.clip}, ${e.who}; found Video ${r.video}, ${r.clip}, ${r.who}`);
    if (r.text !== e.text) problem("Script", `${tag}: words differ from the Speech: line ("${r.text}" vs "${e.text}")`);
    if (r.film !== e.film) problem("Script", `${tag}: film time should be ${e.film}, found ${r.film}`);
  });
}

console.log(problems ? `\n${problems} problem(s), ${notes} note(s).` : `\nOK (${videos.length} videos, ${expected.length} spoken lines, ${notes} note(s) to read).`);
process.exit(problems ? 1 : 0);
