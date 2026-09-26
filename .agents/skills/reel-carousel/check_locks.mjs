#!/usr/bin/env node
// Check a carousel's still prompts against the rule files.
//
// Usage: node .agents/skills/reel-carousel/check_locks.mjs carousels/<slug>-carousel.md
//
// Reads the character locks from .agents/rules/character-consistency.md, and the style lock, avoid
// line, and expression table from .agents/rules/prompt-assembly.md, each time it runs, so it always
// checks against the current rules. Prints OK or the problems for each still and exits with status 1
// if any still has a problem.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RULES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "rules");
const OPEN = "Create image: Square 1:1 aspect ratio, full-frame square composition. ";
const CLOSE = "Single square carousel image. No text, captions, or watermark.";
const NO_YETI = "No Yeti is in this image.";
const BABY = "Babu Yeti";
const OLD_LOCKS = /Head lock:|Look lock:|Scale lock:|\[EXPRESSION\]|Character: |Characters: /;
const PLACES = { 2: ["On the left, ", "On the right, "], 3: ["On the left, ", "In the center, ", "On the right, "] };

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const count = (hay, needle) => hay.split(needle).length - 1;
const sorted = (a) => a.every((x, i) => i === 0 || x >= a[i - 1]);
function section(text, num) {
  const m = new RegExp(`^## ${num}\\. .*$\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(text);
  return m ? m[1] : "";
}
const quote = (body) => (/^"(.+)"$/m.exec(body) || [])[1];

function main(file) {
  const cc = read(path.join(RULES, "character-consistency.md"));
  const locks = [...cc.matchAll(/^## Character \d+ — (.+?)[ \t]*$[\s\S]*?^```text\n([\s\S]*?)\n```/gm)]
    .map((m) => ({ name: m[1], lock: m[2].trim() }));
  const pa = read(path.join(RULES, "prompt-assembly.md"));
  const style = quote(section(pa, 1)), avoid = quote(section(pa, 5));
  const rows = [...section(pa, 4).matchAll(/^\| (?!Beat \|)(?!---)(.+?) \| (.+?) \| (.+?) \|$/gm)];
  const adult = new Set(rows.map((r) => r[2])), baby = new Set(rows.map((r) => r[3]));
  if (!locks.length || !style || !avoid || !rows.length) { console.log("Could not read the locks from the rule files."); return 1; }
  const NAME = locks.map((l) => esc(l.name)).join("|");

  const text = read(file);
  const stills = [...text.matchAll(/^### Still (\d+).*?\n\n```\n([\s\S]*?)\n```/gm)].map((m) => [m[1], m[2]]);
  let failed = stills.length !== 4;
  if (failed) console.log(`Expected 4 still prompts, found ${stills.length}.`);

  const castBlocks = {};
  for (const [num, p] of stills) {
    const problems = [];
    if (!p.startsWith(OPEN)) problems.push("does not open with the square Create image line");
    if (!p.endsWith(CLOSE)) problems.push("does not end with the closing line");
    for (const [name, piece] of [["style lock", style], ["avoid line", avoid]]) {
      const n = count(p, piece);
      if (n !== 1) problems.push(`${name} appears ${n} times word for word (expected 1)`);
    }
    if (OLD_LOCKS.test(p)) problems.push("carries the older character text, a Characters: sentence, or a Head lock:, Look lock:, or Scale lock: sentence");
    if (/\b(Camera|Transition): /.test(p)) problems.push("contains Camera: or Transition: text");

    const present = [];
    for (const { name, lock } of locks) {
      const n = count(p, lock);
      if (n > 1) problems.push(`${name}'s lock appears ${n} times`);
      if (n >= 1) present.push({ name, at: p.indexOf(lock) });
      else if (p.includes(`${name}: `)) problems.push(`${name}'s lock is not word for word`);
    }
    present.sort((a, b) => a.at - b.at);
    const order = present.map((x) => x.name);
    if (PLACES[order.length]) {
      const ok = PLACES[order.length].every((pl, k) => p.slice(present[k].at - pl.length, present[k].at) === pl);
      if (!ok) problems.push(`${order.length} Yetis are not placed with ${PLACES[order.length].map((x) => x.replace(/[, ]+$/, "")).join(" / ")} directly before each lock`);
    }

    let exEnd = -1, exAt = -1;
    const ex = [...p.matchAll(/Expressions: ([^.]*)\./g)];
    if (order.length) {
      if (ex.length !== 1) problems.push(`${ex.length} Expressions: sentences (expected 1)`);
      else {
        exAt = ex[0].index; exEnd = exAt + ex[0][0].length;
        const pairs = ex[0][1].split("; ").map((part) => new RegExp(`^(${NAME}), (.+)$`).exec(part));
        if (pairs.some((m) => !m) || pairs.map((m) => m[1]).join() !== order.join())
          problems.push("Expressions: does not name the placed Yetis, each as '<Name>, <face>', in the same order");
        for (const m of pairs) if (m && !(m[1] === BABY ? baby : adult).has(m[2]))
          problems.push(`face for ${m[1]} '${m[2]}' is not a row of the section 4 table in its column`);
      }
    } else {
      if (count(p, NO_YETI) !== 1) problems.push(`has no Yeti lock and does not say '${NO_YETI}'`);
      if (ex.length) problems.push("has no Yeti but has an Expressions: sentence");
      exEnd = p.indexOf(NO_YETI) + NO_YETI.length;
    }

    const marks = [p.indexOf(style), p.indexOf("Environment: "), p.indexOf("Lighting: "),
      order.length ? present[0].at : p.indexOf(NO_YETI)];
    if (order.length) marks.push(exAt);
    marks.push(p.indexOf(avoid), p.indexOf(" Action: "));
    if (marks.includes(-1) || !sorted(marks))
      problems.push("pieces missing or out of order (style, Environment, Lighting, character locks, Expressions, cast, avoid, Action)");
    if (exEnd >= 0 && p.includes(avoid)) castBlocks[num] = p.slice(exEnd, p.indexOf(avoid)).trim();

    failed ||= problems.length > 0;
    console.log(`Still ${num}: ` + (problems.length ? problems.join("; ") : "OK"));
  }

  if (new Set(Object.values(castBlocks)).size > 1) {
    failed = true;
    console.log("Supporting cast sentences differ between stills; they must be identical in all four.");
  }
  return failed ? 1 : 0;
}

const target = process.argv[2];
if (!target) {
  console.log("Usage: node .agents/skills/reel-carousel/check_locks.mjs carousels/<slug>-carousel.md");
  process.exit(2);
}
process.exit(main(target));
