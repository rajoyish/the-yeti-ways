#!/usr/bin/env node
/**
 * check_tts.mjs
 *
 * Checks an AI Studio speech guide (speech-prompts/<slug>-tts.md) against its storyboard's ## Script table.
 * It checks text and structure only; it cannot hear a take.
 *
 * Usage:
 *   node .agents/skills/ai-studio-tts/check_tts.mjs speech-prompts/<slug>-tts.md prompts/<slug>-storyboard.md
 *
 * Prints "Problem:" lines (must be fixed; exit status 1) and "Note:" lines, then "OK" when there are no problems.
 */

import fs from "node:fs";

const [guideFile, boardFile] = process.argv.slice(2);
if (!guideFile || !boardFile) {
  console.log("Usage: node .agents/skills/ai-studio-tts/check_tts.mjs speech-prompts/<slug>-tts.md prompts/<slug>-storyboard.md");
  process.exit(1);
}
for (const f of [guideFile, boardFile]) if (!fs.existsSync(f)) { console.error(`File not found: ${f}`); process.exit(1); }

let problems = 0;
const problem = (where, msg) => { problems++; console.log(`Problem: ${where}: ${msg}`); };
const note = (where, msg) => console.log(`Note: ${where}: ${msg}`);

const read = f => fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n").split("\n");
const cells = l => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
const unquote = s => s.trim().replace(/^["“]/, "").replace(/["”]$/, "").trim();
const untick = s => s.trim().replace(/^`/, "").replace(/`$/, "");
const untag = s => s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const secs = t => { const [m, s] = t.split(":"); return Number(m) * 60 + Number(s); };
const words = s => (s.match(/[A-Za-z0-9'’-]+/g) || []).length;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Rows of the table that follows a heading matching `re`.
function table(lines, re) {
  const i = lines.findIndex(l => re.test(l));
  if (i < 0) return null;
  const rows = [];
  let j = i + 1;
  while (j < lines.length && !lines[j].startsWith("|") && !/^#{1,3} /.test(lines[j])) j++;
  for (j += 2; j < lines.length && lines[j].startsWith("|"); j++) rows.push(cells(lines[j]));
  return rows;
}

const board = read(boardFile);
const guide = read(guideFile);

const script = table(board, /^## Script\s*$/);
if (!script || !script.length) { console.error(`No ## Script table in ${boardFile}.`); process.exit(1); }

// Voice cast, for the ## Voices table.
const cast = new Map((table(board, /^## Voice cast\s*$/) || []).map(r => [r[0], r[1]]));
const voices = table(guide, /^## Voices\s*$/);
if (!voices) problem("## Voices", "missing");
else for (const r of voices) {
  if (!cast.has(r[0])) problem("## Voices", `${r[0]} is not in the storyboard's ## Voice cast`);
  else if (r[1] !== cast.get(r[0])) problem("## Voices", `${r[0]}'s voice differs from ## Voice cast: "${r[1]}"`);
}

// Cue sheet: one row per Script row, in order.
const cues = table(guide, /^## Cue sheet\s*$/);
if (!cues) { problem("## Cue sheet", "missing"); }
const byCue = new Map();
if (cues) {
  if (cues.length !== script.length) problem("## Cue sheet", `${cues.length} cues for ${script.length} Script rows`);
  script.forEach((s, i) => {
    const c = cues[i];
    const id = `C${String(i + 1).padStart(2, "0")}`;
    if (!c) return;
    const [cue, video, clip, film, speaker, text, file] = c;
    if (cue !== id) problem(id, `cue is numbered "${cue}"`);
    if (video !== s[0] || clip !== s[1] || film !== s[2] || speaker !== s[3]) problem(id, `video/time/speaker differ from Script row ${i + 1} (${s.slice(0, 4).join(", ")})`);
    if (text !== unquote(s[4])) problem(id, `text differs from the Script line: "${text}" vs ${s[4]}`);
    if (/<[^>]*>/.test(text) || /^["“]/.test(text)) problem(id, "cue sheet text holds a tag or quotation marks");
    const pick = video.match(/^Pick-up (\d+)$/);
    const v = pick ? `p${pick[1]}` : `v${String(video).padStart(2, "0")}`;
    const want = `${id}-${v}-${slug(speaker)}.wav`;
    if (untick(file || "") !== want) problem(id, `file is "${file}", expected ${want}`);
    byCue.set(id, { speaker, text, clip, film, seen: 0 });
  });
}

// Sessions: one per speaker, every block a cue of that speaker.
const sessionHeads = guide.map((l, i) => [l.match(/^## Session (\d+) - (.+?)\s*$/), i]).filter(([m]) => m);
if (!sessionHeads.length) problem("Sessions", "no ## Session N - <Speaker> sections");
const sessionSpeakers = new Set();
let lastSessionCue = new Map();
for (const [m] of sessionHeads) {
  const speaker = m[2];
  if (sessionSpeakers.has(speaker)) problem(`Session ${m[1]}`, `${speaker} has more than one session`);
  sessionSpeakers.add(speaker);
  const rows = table(guide, new RegExp(`^## Session ${m[1]} - `)) || [];
  if (!rows.length) problem(`Session ${m[1]}`, "no block table");
  let prev = 0;
  rows.forEach((r, k) => {
    const [block, cue, win, max, style, text] = r;
    const where = `Session ${m[1]} block ${block}`;
    if (Number(block) !== k + 1) problem(where, "blocks are not numbered 1, 2, 3, ...");
    const c = byCue.get(cue);
    if (!c) { problem(where, `unknown cue "${cue}"`); return; }
    c.seen++;
    if (c.speaker !== speaker) problem(where, `${cue} belongs to ${c.speaker}, not ${speaker}`);
    const n = Number(cue.slice(1));
    if (n <= prev) problem(where, "blocks are not in film order");
    prev = n;
    const t = untick(text || "");
    if (untag(t) !== c.text) problem(where, `text without tags differs from ${cue}: "${untag(t)}"`);
    const tags = t.match(/<[^>]*>/g) || [];
    if (tags.length > 2) problem(where, `${tags.length} tags; at most two`);
    const st = untick(style || "");
    if (!st) problem(where, "no style");
    else {
      if (words(st) > 14) note(where, `style is ${words(st)} words; aim for about 12`);
      if (!/brisk|natural pace|unhurried|slow/i.test(st)) problem(where, "style has no pace word");
    }
    const [a, b] = c.clip.split("-").map(secs);
    const w = b - a;
    if (Math.abs(parseFloat(win) - w) > 0.05) problem(where, `window is ${win}, the cue's is ${w.toFixed(1)} s`);
    const mx = parseFloat(max);
    if (!(mx >= w) || mx > w + 1.05) problem(where, `max ${max} is outside ${w.toFixed(1)}-${(w + 1).toFixed(1)} s`);
    const rate = words(c.text) / w;
    const pace = rate > 2.6 ? /brisk/i : rate >= 2.0 ? /natural pace/i : rate >= 1.4 ? /unhurried/i : /slow/i;
    if (st && !pace.test(st)) note(where, `rate ${rate.toFixed(1)} words/s suggests a different pace word`);
  });
}
for (const [id, c] of byCue) if (c.seen !== 1) problem(id, `appears in ${c.seen} session blocks; must be exactly one`);
for (const s of new Set(script.map(r => r[3]))) if (!sessionSpeakers.has(s)) problem("Sessions", `no session for ${s}`);

if (problems) { console.log(`${problems} problem(s).`); process.exit(1); }
console.log("OK");
