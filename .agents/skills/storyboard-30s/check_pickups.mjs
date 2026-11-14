#!/usr/bin/env node
/**
 * check_pickups.mjs
 *
 * Checks the pick-up shots of a Yeti storyboard (prompts/<slug>-<length>-storyboard.md), as
 * .agents/skills/storyboard-30s/references/pickup-shots.md sets them out. Shared by storyboard-30s,
 * storyboard-60s, nursery-rhyme-storyboard, and story-to-storyboard. It checks structure only.
 *
 * Usage:
 *   node .agents/skills/storyboard-30s/check_pickups.mjs prompts/<slug>-<length>-storyboard.md
 *
 * Prints "Problem:" lines (must be fixed; exit status 1) and "Note:" lines (read and decide),
 * then "OK" when there are no problems. A file with no pick-ups prints "OK (0 pick-ups)".
 */

import fs from "node:fs";

const file = process.argv[2];
if (!file || file === "--help" || file === "-h") {
  console.log("Usage: node .agents/skills/storyboard-30s/check_pickups.mjs prompts/<slug>-<length>-storyboard.md");
  process.exit(file ? 0 : 1);
}
if (!fs.existsSync(file)) { console.error(`File not found: ${file}`); process.exit(1); }

const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
let problems = 0;
let notes = 0;
const problem = (where, msg) => { problems++; console.log(`Problem: ${where}: ${msg}`); };
const note = (where, msg) => { notes++; console.log(`Note: ${where}: ${msg}`); };

const BOUNDS = ["00:00", "00:01.5", "00:03", "00:05", "00:07", "00:08.5", "00:10"];
const YETIS = ["@Papa Yeti", "@Mama Yeti", "@Babu Yeti"];

// Headings.
const videoIdx = [];
const pickups = [];
let coverIdx = -1;
lines.forEach((l, i) => {
  if (/^## Video \d+ - /.test(l)) videoIdx.push(i);
  if (coverIdx < 0 && /^## Cover image/.test(l)) coverIdx = i;
  if (/^## (B-roll|B roll|Broll|Insert|Inserts|Cutaway|Pickup|Pick up|Pick-Up|Pickups)\b/i.test(l) && !/^## Pick-up /.test(l)) {
    problem(`line ${i + 1}`, `"${l}" is an extra clip under another name; write it as "## Pick-up <n> - <Title>"`);
  }
  if (/^## Pick-up\b/.test(l)) {
    const m = l.match(/^## Pick-up (\d+) - (\S.*)$/);
    if (!m) problem(`line ${i + 1}`, `"${l}" is not in the form "## Pick-up <n> - <Title>"`);
    else pickups.push({ n: Number(m[1]), title: m[2].trim(), at: i });
  }
});
const N = videoIdx.length;
const lastVideo = videoIdx.length ? videoIdx[videoIdx.length - 1] : -1;

// No numbered video leans on a pick-up.
for (const vi of videoIdx) {
  let j = vi + 1;
  while (j < lines.length && !/^## /.test(lines[j])) {
    if (/Pick-up \d+|End frame P\d+/.test(lines[j])) problem(lines[vi].replace(/^## /, ""), "a numbered video names a pick-up; no video opens on or depends on one");
    j++;
  }
}

// Image map rows.
const mapRows = new Set();
const mapStart = lines.findIndex(l => /^## Image map\s*$/.test(l));
if (mapStart >= 0) {
  for (let i = mapStart + 1; i < lines.length && !/^## /.test(lines[i]); i++) {
    const m = lines[i].match(/^\| Pick-up (\d+) \|/);
    if (m) mapRows.add(Number(m[1]));
    if (/^\| (B-roll|Insert|Cutaway)/i.test(lines[i])) problem("Image map", `row "${lines[i].split("|")[1].trim()}" should be "Pick-up <n>"`);
  }
}

pickups.forEach((p, idx) => {
  const where = `Pick-up ${p.n}`;
  if (p.n !== idx + 1) problem(where, `pick-ups are not numbered in order from 1 (expected Pick-up ${idx + 1})`);
  if (p.at < lastVideo) problem(where, "comes before the last ## Video section; pick-ups follow the numbered videos");
  if (coverIdx >= 0 && p.at > coverIdx) problem(where, "comes after ## Cover image; pick-ups sit before the covers");
  if (!mapRows.has(p.n)) problem(where, "has no row in the ## Image map");

  let end = p.at + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end++;
  const sec = lines.slice(p.at + 1, end);
  const nonEmpty = sec.filter(l => l.trim() && l.trim() !== "---");

  const pickLine = nonEmpty.find(l => l.startsWith("Pick-up:"));
  const imagesLine = nonEmpty.find(l => l.startsWith("Images:"));
  const order = ["Pick-up:", "Images:", "Agent prompt:", "```text"].map(t => nonEmpty.findIndex(l => l.startsWith(t)));
  if (order.some(x => x < 0) || !(order[0] === 0 && order[0] < order[1] && order[1] < order[2] && order[2] < order[3])) {
    problem(where, "section must hold, in order, a Pick-up: line, an Images: line, an Agent prompt: line, and one ```text block");
  }

  if (pickLine) {
    if (!/continuity fix|missing reaction|bridge/i.test(pickLine)) problem(where, "Pick-up: line names no job (continuity fix, missing reaction, or bridge)");
    if (!/\b(insert|overlay)\b/i.test(pickLine)) problem(where, "Pick-up: line names no edit mode (insert or overlay)");
    if (!/\b(after|before|between|over) Video \d+/i.test(pickLine)) problem(where, "Pick-up: line does not say where it cuts (after, before, between, or over Video <N>)");
  }

  let imgs = null, chars = null;
  if (imagesLine) {
    const r = imagesLine.match(/References: (\d+) images? \+ (\d+) Characters? = (\d+) of 7/);
    const c = imagesLine.match(/Characters: (\d+) of 3/);
    if (!r || !c) problem(where, "Images: line lacks \"References: <i> image(s) + <c> Characters = <n> of 7. Characters: <c> of 3.\"");
    else {
      imgs = Number(r[1]); chars = Number(r[2]);
      if (imgs + chars !== Number(r[3])) problem(where, `Images: line adds up wrong (${imgs} + ${chars} != ${r[3]})`);
      if (Number(r[3]) > 7) problem(where, "more than 7 references");
      if (Number(c[1]) !== chars) problem(where, "Images: line's two Character counts differ");
    }
    if (!/Not part of the end-frame chain/.test(imagesLine)) problem(where, "Images: line does not say \"Not part of the end-frame chain: it opens on no end frame and saves none.\"");
  }

  const t0 = sec.findIndex(l => l.trim() === "```text");
  if (t0 < 0) return;
  let t1 = t0 + 1;
  while (t1 < sec.length && sec[t1].trim() !== "```") t1++;
  const body = sec.slice(t0 + 1, t1);
  const first = body[0] || "";
  const want = `Generate Pick-up ${p.n} - ${p.title} as one 10-second Omni 1.2 Flash video`;
  if (!first.startsWith(want)) problem(where, `first line must start "${want}"`);
  if (!/720p/.test(first)) problem(where, "first line does not say 720p");
  if (!/Reference-to-Video \(R2V, Ingredients\) mode, never First Frame \(I2V\) mode/.test(first)) problem(where, "first line does not ask for Reference-to-Video (R2V, Ingredients) mode, never First Frame (I2V) mode");
  if (!/does not open on an end frame and does not save one/.test(first)) problem(where, "first line does not say it does not open on an end frame and does not save one");
  const nm = first.match(/not one of the (\d+) numbered videos/);
  if (!nm) problem(where, "first line does not say \"not one of the <N> numbered videos\"");
  else if (Number(nm[1]) !== N) problem(where, `first line says ${nm[1]} numbered videos; the file has ${N}`);
  if (!first.includes(`Name the clip "Pick-up ${p.n} - ${p.title} - take <n>".`)) problem(where, `first line does not end Name the clip "Pick-up ${p.n} - ${p.title} - take <n>".`);
  if (/\b(open on|start frame|End frame V\d+ as its first frame)\b/i.test(first.replace(/does not open on an end frame/, ""))) note(where, "first line reads like a start-frame (I2V) request; give images as references");

  const cast = body.find(l => l.startsWith("Cast:")) || "";
  if (!cast) problem(where, "no Cast: line");
  const ats = [...new Set((cast.match(/@[A-Z][A-Za-z'-]*(?: [A-Z][A-Za-z'-]*)*/g) || []))];
  if (ats.length > 3) problem(where, `${ats.length} linked Characters; at most 3`);
  if (chars !== null && ats.length !== chars) problem(where, `Cast: line links ${ats.length} Character(s) but the Images: line counts ${chars}`);
  const yetiNames = ["Papa Yeti", "Mama Yeti", "Babu Yeti"];
  const shotLines = body.filter(l => /^\d{2}:\d{2}/.test(l));
  for (const y of yetiNames) {
    const inFrame = shotLines.some(l => (l.match(/In frame: (.*?), and no one else\./) || [])[1]?.includes(y));
    if (inFrame && !cast.includes(`@${y}`)) problem(where, `${y} is in frame but not linked as @${y} in the Cast: line`);
  }
  if (!YETIS.some(y => cast.includes(y)) && !/No Yetis/.test(cast)) problem(where, "a pick-up with no Yeti says \"No Yetis and no other characters appear in this video.\" in its Cast: line");
  if (/@[A-Z]/.test(body.filter(l => !l.startsWith("Cast:")).join(" "))) problem(where, "an @ name appears outside the Cast: line");

  ["Setting:", "Sound:", "Avoid:"].forEach(t => { if (!body.some(l => l.startsWith(t))) problem(where, `no ${t} line`); });

  if (shotLines.length < 1 || shotLines.length > 6) problem(where, `${shotLines.length} shot lines; a pick-up has one to six`);
  let prev = "00:00";
  for (const l of shotLines) {
    const m = l.match(/^(\d{2}:\d{2}(?:\.\d+)?)-(\d{2}:\d{2}(?:\.\d+)?), /);
    if (!m) { problem(where, `shot line has no "00:00-00:03, " timestamp: "${l.slice(0, 40)}"`); continue; }
    if (m[1] !== prev) problem(where, `shot ${m[1]}-${m[2]} does not start where the last ended (${prev})`);
    if (!BOUNDS.includes(m[1]) || !BOUNDS.includes(m[2])) problem(where, `shot ${m[1]}-${m[2]} is off the beat boundaries ${BOUNDS.join(", ")}`);
    const span = BOUNDS.indexOf(m[2]) - BOUNDS.indexOf(m[1]);
    if (BOUNDS.includes(m[1]) && BOUNDS.includes(m[2]) && (span < 1)) problem(where, `shot ${m[1]}-${m[2]} has no length`);
    if (!/In frame: /.test(l)) problem(where, `shot ${m[1]}-${m[2]} has no In frame: list`);
    if (!/Light: .*(shallow|deep) focus\.?$/.test(l.trim())) problem(where, `shot ${m[1]}-${m[2]} does not end its Light: part with shallow or deep focus`);
    prev = m[2];
  }
  if (shotLines.length && prev !== "00:10") problem(where, `shots end at ${prev}, not 00:10`);
  if (shotLines.length && !/ending on a held frame/.test(shotLines[shotLines.length - 1])) problem(where, "last shot does not end \"ending on a held frame\"");
  const fmt = body[1] || "";
  const words = ["one", "two", "three", "four", "five", "six"];
  const fm = fmt.match(/10 seconds, (one|two|three|four|five|six) shots?/);
  if (!fm) problem(where, "format line does not say \"10 seconds, <n> shot(s)\"");
  else if (words.indexOf(fm[1]) + 1 !== shotLines.length) problem(where, `format line says ${fm[1]} shot(s); there are ${shotLines.length}`);

  const speech = body.find(l => l.startsWith("Speech:"));
  const sound = body.find(l => l.startsWith("Sound:")) || "";
  if (!speech && !/No dialogue, no lyrics\.$/.test(sound.trim())) problem(where, "a pick-up with no speech ends its Sound: line \"No dialogue, no lyrics.\"");
  if (/Lyrics to sing verbatim:/.test(body.join("\n"))) problem(where, "a pick-up never carries lyrics; the song lives in the numbered clips");
  if (speech && pickLine && /\boverlay\b/i.test(pickLine)) problem(where, "an overlay pick-up plays under another clip's audio, so it carries no Speech: line");
});

console.log(problems ? `\n${problems} problem(s), ${notes} note(s).` : `\nOK (${pickups.length} pick-up${pickups.length === 1 ? "" : "s"}, ${N} numbered videos, ${notes} note(s) to read).`);
process.exit(problems ? 1 : 0);
