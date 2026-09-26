#!/usr/bin/env node
// Check a 3x2 file's panel image prompts, and its storyboard, against the rule files.
//
// Usage: node .agents/skills/create-3x2-timed-image/check_grid.mjs prompts/<slug>-<30s|60s>-3x2.md [--images]
//
// Finds the storyboard by name (prompts/<slug>-<30s|60s>-storyboard.md). Reads the character locks from
// .agents/rules/character-consistency.md, the style lock, avoid line, and expression table from
// .agents/rules/prompt-assembly.md, and the fixed panel image sentences from this skill's SKILL.md each
// time it runs, so it always checks against the current text. Prints OK or the problems for the
// storyboard and for each video's six panel images, prints Note: lines for things worth a look that are
// not always wrong, and exits with status 1 if anything fails.
//
// With --images it also checks the image files: every panel image named by an Image: line exists, and
// every grid named by a Grid image: line exists, is 1920x1080, and is newer than all six of its panel
// images (so it was composed from the current ones by compose_grid.ps1).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..", "..");
const CHARACTERS = path.join(REPO, ".agents", "rules", "character-consistency.md");
const ASSEMBLY = path.join(REPO, ".agents", "rules", "prompt-assembly.md");
const SKILL = path.join(HERE, "SKILL.md");

const LADDER = ["Extreme Wide Shot", "Wide Shot", "Full Shot", "Medium Wide Shot",
  "Medium Shot", "Medium Close-Up", "Close-Up", "Extreme Close-Up"];
const SHOTS = ["00:00 - 00:03", "00:03 - 00:07", "00:07 - 00:10"];
const PANELS = ["00:00.0–00:01.5", "00:01.5–00:03.0", "00:03.0–00:05.0",
  "00:05.0–00:07.0", "00:07.0–00:08.5", "00:08.5–00:10.0"];
const BEATS = 2;
const GRID_W = 1920, GRID_H = 1080;
const BABY = "Babu Yeti";
const NO_YETI_SHOT = "No Yeti is in this shot.";
const LEGACY = /^(Frames|Start frame|Midpoint frame|End frame):/m;
const IMAGE_LINES = /^(Grid|Stills):/m;
const OLD_GRID = /3x3|nine panel|panel images 3, 6, and 9/i;
const OLD_LOCKS = /Head lock:|Look lock:|Scale lock:|\[EXPRESSION\]|Character: /;
const PANEL_HEAD = /^### Panel (\d) · (\S+) · ([^·]+?), ([^·,]+?) · (.+?)[ \t]*$/gm;
const TITLE = /^[A-Z0-9'’&-]+(?: [A-Z0-9'’&-]+){1,3}$/;
const PLACES = { 2: ["On the left, ", "On the right, "], 3: ["On the left, ", "In the center, ", "On the right, "] };

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const count = (hay, needle) => hay.split(needle).length - 1;
const sorted = (a) => a.every((x, i) => i === 0 || x >= a[i - 1]);
const sentences = (t) => t.trim().split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
const shotOf = (panel) => Math.floor((panel - 1) / BEATS) + 1;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function section(text, heading) {
  // Body of the '## <heading>' section, up to the next '## ' heading.
  const m = new RegExp(`^## ${esc(heading)}.*$\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(text);
  return m ? m[1] : "";
}
const quotes = (body) => [...body.matchAll(/^"(.+)"$/gm)].map((m) => m[1]);
function videos(text) {
  // [[number, title, body]] for each '## Video N - <Title>' section.
  const out = [];
  for (const part of text.split(/^(?=## )/m)) {
    const m = /^## Video (\d+) - (.+?)[ \t]*$/m.exec(part);
    if (m && m.index === 0) out.push([Number(m[1]), m[2], part.slice(m[0].length)]);
  }
  return out;
}
function framings(cell) {
  // [opening, closing, angle] from a Shot Type cell such as 'Medium Shot to Close-Up, Low Angle'.
  const m = /^(.+?)(?: to (.+?))?, ([^,]+)$/.exec(cell.trim());
  return m ? [m[1], m[2] || m[1], m[3]] : null;
}
function jpegSize(file) {
  // [width, height] from a JPEG's SOF marker, or null.
  const b = fs.readFileSync(file);
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

function loadRules() {
  // The character locks, in file order, and the pieces prompt-assembly.md locks.
  const cc = read(CHARACTERS);
  const locks = [];
  for (const m of cc.matchAll(/^## Character \d+ — (.+?)[ \t]*$([\s\S]*?)(?=^## |(?![\s\S]))/gm)) {
    const block = /^```text\n([\s\S]*?)\n```/m.exec(m[2]);
    if (!block) throw new Error(`No Copy-Ready lock under '${m[1]}' in ${CHARACTERS}`);
    const lock = block[1].trim();
    if (!lock.startsWith(`${m[1]}: `)) throw new Error(`The lock under '${m[1]}' does not open with '${m[1]}: '`);
    locks.push({ name: m[1], lock });
  }
  if (!locks.length) throw new Error(`No '## Character N — <Name>' sections in ${CHARACTERS}`);
  const pa = read(ASSEMBLY);
  const style = quotes(section(pa, "1."))[0];
  const avoid = quotes(section(pa, "5."))[0];
  const rows = [...section(pa, "4.").matchAll(/^\| (?!Beat \|)(?!---)(.+?) \| (.+?) \| (.+?) \|$/gm)];
  if (!style || !avoid || !rows.length) throw new Error(`Style lock, avoid line, or expression table not found in ${ASSEMBLY}`);
  return { locks, style, avoid, adultFaces: new Set(rows.map((r) => r[2])), babyFaces: new Set(rows.map((r) => r[3])) };
}

function main(target, withImages) {
  const file = path.resolve(target);
  const fm = /(.+)-(30s|60s)-3x2\.md$/.exec(path.basename(file));
  if (!fm) { console.log(`${target} is not named <slug>-<30s|60s>-3x2.md`); return 1; }
  const boardPath = path.join(path.dirname(file), `${fm[1]}-${fm[2]}-storyboard.md`);
  if (!fs.existsSync(boardPath)) { console.log(`Storyboard not found: ${boardPath}`); return 1; }
  const expectedVideos = fm[2] === "30s" ? 3 : 6;
  const slug = fm[1];

  const { locks, style, avoid, adultFaces, babyFaces } = loadRules();
  const lockOf = Object.fromEntries(locks.map((l) => [l.name, l.lock]));
  const names = locks.map((l) => l.name);
  const NAME = names.map(esc).join("|");
  const ABSENT = new RegExp(`\\b(${NAME}) (?:is|are) not in\\b|\\b(?:neither|nor) (${NAME})\\b`, "g");
  const facesFor = (name) => (name === BABY ? babyFaces : adultFaces);

  function characters(sentence) {
    // Names, left to right, from a 'Characters: ...' sentence body, or null if it is not in a set form.
    const found = [...sentence.matchAll(new RegExp(NAME, "g"))].map((m) => m[0]);
    const forms = {
      1: (a) => a,
      2: (a, b) => `${a} on the left and ${b} on the right`,
      3: (a, b, c) => `${a} on the left, ${b} in the center, and ${c} on the right`,
    };
    const form = forms[found.length];
    return form && form(...found) === sentence && new Set(found).size === found.length ? found : null;
  }
  function expressions(text, where, problems) {
    // [[name, face]] from the prompt's one 'Expressions:' sentence, checking each face against the table.
    const hits = [...text.matchAll(/Expressions: ([^.]*)\./g)];
    if (hits.length !== 1) { if (hits.length) problems.push(`${where} has ${hits.length} Expressions: sentences`); return null; }
    const pairs = hits[0][1].split("; ").map((part) => {
      const m = new RegExp(`^(${NAME}), (.+)$`).exec(part);
      return m ? [m[1], m[2]] : [null, part];
    });
    for (const [name, face] of pairs) {
      if (!name) problems.push(`${where} Expressions: entry '${face}' does not open with a Yeti's name`);
      else if (!facesFor(name).has(face)) problems.push(`${where} face for ${name} '${face}' is not a row of the section 4 table in its column`);
    }
    return { pairs, index: hits[0].index, end: hits[0].index + hits[0][0].length };
  }

  const fixedPanel = quotes(section(read(SKILL), "Fixed panel image sentences"));
  if (fixedPanel.length !== 2) {
    console.log(`Expected 2 fixed panel image sentences in ${SKILL}, found ${fixedPanel.length}.`);
    return 1;
  }
  const [noYetiImage, panelClosing] = fixedPanel;

  let failed = false;
  const notes = [];

  // The storyboard: the panel images are only as right as the beats they are drawn from.
  const board = read(boardPath);
  const boardVideos = videos(board);
  let problems = [];
  if (LEGACY.test(board)) problems.push("still has Frames:, Start frame:, Midpoint frame:, or End frame: lines (revise it with the storyboard skill first)");
  if (IMAGE_LINES.test(board) || board.includes("Create image:")) problems.push("has Grid: or Stills: lines or an image prompt; the storyboard holds video prompts only (revise it with the storyboard skill first)");
  if (OLD_GRID.test(board)) problems.push("still refers to the old 3x3 grid, nine panels, or panel images 3, 6, and 9 (revise it with the storyboard skill first)");
  if (OLD_LOCKS.test(board)) problems.push("still carries the older character text, an [EXPRESSION] slot, or Head lock:, Look lock:, or Scale lock: sentences (revise it as section 9 of prompt-assembly.md sets out)");
  if (boardVideos.length !== expectedVideos) problems.push(`${boardVideos.length} videos, expected ${expectedVideos}`);
  let aspect = null;
  const shots = {};
  for (const [num, , body] of boardVideos) {
    const tableAt = body.search(/^\| Timestamp /m);
    const lockBlock = /^Character locks:\n\n```\n([\s\S]*?)\n```/m.exec(tableAt >= 0 ? body.slice(0, tableAt) : body);
    let inBlock = [];
    if (!lockBlock) problems.push(`Video ${num} has no 'Character locks:' block above its table`);
    else {
      const paras = lockBlock[1].split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
      for (const p of paras) {
        const hit = locks.find((l) => l.lock === p);
        if (hit) inBlock.push(hit.name);
        else problems.push(`Video ${num} Character locks: paragraph '${p.slice(0, 40)}...' is not a lock from character-consistency.md, word for word`);
      }
      if (!same(inBlock, names.filter((n) => inBlock.includes(n)))) problems.push(`Video ${num} Character locks: are not in the order ${names.join(", ")}`);
    }

    const cells = body.split("\n").filter((l) => l.startsWith("| **00:")).map((l) => l.split("|").map((c) => c.trim()));
    const stamps = cells.map((c) => (c.length > 1 ? c[1].replace(/^\*+|\*+$/g, "") : ""));
    if (stamps.join() !== SHOTS.join() || cells.some((c) => c.length !== 7)) {
      problems.push(`Video ${num} table rows are ${JSON.stringify(stamps)}, expected ${JSON.stringify(SHOTS)} with five cells each`);
      continue;
    }
    const seen = new Set();
    shots[num] = cells.map((c, i) => {
      const s = i + 1, visual = c[3], where = `Video ${num} Shot ${s}`;
      if (!visual.includes(style)) problems.push(`${where} has no style lock, word for word`);
      else if (aspect === null) aspect = visual.split(style)[0].trim();
      if (count(visual, avoid) !== 1) problems.push(`${where} avoid line appears ${count(visual, avoid)} times (expected 1)`);
      const action = /Action: (.*?) Camera: /.exec(visual);
      const beats = action ? sentences(action[1]) : [];
      if (beats.length !== BEATS) problems.push(`${where} Action has ${beats.length} sentences, the panels need exactly ${BEATS} beats`);
      const ends = framings(c[2]);
      if (!ends) problems.push(`${where} Shot Type '${c[2]}' is not '<Framing>, <Angle>'`);
      else if (LADDER.includes(ends[0]) && LADDER.includes(ends[1]) && Math.abs(LADDER.indexOf(ends[0]) - LADDER.indexOf(ends[1])) > 2)
        problems.push(`${where} moves more than two rungs (${c[2]})`);

      const env = /(Environment: .+?\.) Lighting: /.exec(visual);
      const light = /(Lighting: .+?\.) (?:Characters: |No Yeti is in this shot\.)/.exec(visual);
      if (!light) problems.push(`${where} has no Lighting: sentence followed by a Characters: or no-Yeti sentence`);
      const charM = /Characters: ([^.]*)\./.exec(visual);
      let cast = [], faces = {}, castEnd = -1;
      if (charM) {
        cast = characters(charM[1]) || [];
        if (!cast.length) problems.push(`${where} Characters: '${charM[1]}' is not in a form from section 3 of prompt-assembly.md`);
        const ex = expressions(visual, where, problems);
        if (!ex) problems.push(`${where} has no Expressions: sentence`);
        else {
          if (!same(ex.pairs.map((p) => p[0]), cast)) problems.push(`${where} Expressions: does not name the Characters: Yetis in the same order`);
          faces = Object.fromEntries(ex.pairs.filter((p) => p[0]));
          castEnd = ex.end;
        }
        for (const n of cast) {
          seen.add(n);
          if (lockBlock && !inBlock.includes(n)) problems.push(`${where} has ${n}, but the video's Character locks: block has no lock for ${n}`);
        }
      } else if (visual.includes(NO_YETI_SHOT)) {
        if (/Expressions: /.test(visual)) problems.push(`${where} has no Yeti but has an Expressions: sentence`);
        castEnd = visual.indexOf(NO_YETI_SHOT) + NO_YETI_SHOT.length;
      } else problems.push(`${where} has neither a Characters: sentence nor '${NO_YETI_SHOT}'`);
      if (action) for (const m of action[1].matchAll(ABSENT)) {
        const n = m[1] || m[2];
        if (cast.includes(n)) problems.push(`${where} names ${n} in Characters:, but its Action says ${n} is not in the shot`);
      }
      const extras = castEnd >= 0 && visual.includes(avoid) ? visual.slice(castEnd, visual.indexOf(avoid)).trim() : "";
      return { type: c[2], cast, faces, env: env && env[1], lighting: light && light[1], extras,
        sceneBreak: /^Scene break:/m.test(body) };
    });
    for (const n of inBlock) if (!seen.has(n)) problems.push(`Video ${num} Character locks: has ${n}, who is in none of its shots`);
  }
  if (aspect === null) problems.push("no visual cell opens with an aspect ratio line before the style lock");
  failed ||= problems.length > 0;
  console.log("Storyboard: " + (problems.length ? problems.join("; ") : "OK"));

  // The 3x2 file.
  const text = read(file);
  const fileVideos = videos(text);
  const boardHeads = boardVideos.map(([n, t]) => `${n} - ${t}`);
  const fileHeads = fileVideos.map(([n, t]) => `${n} - ${t}`);
  if (boardHeads.join("|") !== fileHeads.join("|")) {
    failed = true;
    console.log(`Video headings ${JSON.stringify(fileHeads)} do not match the storyboard's ${JSON.stringify(boardHeads)}.`);
  }
  const imagePaths = [];
  let previousLast = null;
  for (const [num, , body] of fileVideos) {
    problems = [];
    const sb = shots[num];
    PANEL_HEAD.lastIndex = 0;
    const heads = [...body.matchAll(PANEL_HEAD)];
    const pre = heads.length ? body.slice(0, heads[0].index) : body;
    if (/^```/m.test(pre)) problems.push("has a code block before the first panel image; the grid has no prompt and is composed from the panel images (delete the grid prompt)");
    const gridPath = `3x2-timed-storyboard-images/${slug}/Grid_V${num}.jpg`;
    if (!pre.includes(`Grid image: \`${gridPath}\``)) problems.push(`no 'Grid image: \`${gridPath}\`' line`);
    if (heads.length !== PANELS.length) problems.push(`${heads.length} panel images, expected exactly ${PANELS.length}`);

    const titles = [], pictures = [], facesByPanel = {};
    heads.slice(0, PANELS.length).forEach((h, idx) => {
      const i = idx + 1, where = `panel image ${i}`;
      if (Number(h[1]) !== i || h[2] !== PANELS[i - 1]) problems.push(`${where} heading should read '### Panel ${i} · ${PANELS[i - 1]}'`);
      const title = h[5];
      if (!TITLE.test(title)) problems.push(`${where} title '${title}' is not two to four words in capitals`);
      titles.push(title);
      const shot = sb ? sb[shotOf(i) - 1] : null;
      const framing = h[3], angle = h[4];
      const ends = shot ? framings(shot.type) : null;
      if (ends) {
        const last = i % BEATS === 0;
        const want = last ? ends[1] : ends[0];
        if (framing !== want) problems.push(`${where} framing '${framing}' should be ${want}, the shot's ${last ? "closing" : "opening"} framing`);
        if (angle !== ends[2]) {
          if (last) notes.push(`Video ${num} panel ${i} angle '${angle}' differs from the cell's '${ends[2]}'; fine only if the Camera: move ends on it`);
          else problems.push(`${where} angle '${angle}' is not the cell's '${ends[2]}'`);
        }
      }

      const partEnd = idx + 1 < heads.length ? heads[idx + 1].index : body.length;
      const part = body.slice(h.index + h[0].length, partEnd);
      const wantPath = `3x2-timed-storyboard-images/${slug}/Panel_${i}_V${num}.jpg`;
      if (!part.includes(`Image: \`${wantPath}\`.`)) problems.push(`${where} has no line 'Image: \`${wantPath}\`.'`);
      imagePaths.push({ num, panel: i, file: wantPath, grid: gridPath });
      const blocks = [...part.matchAll(/^```\n([\s\S]*?)\n```/gm)].map((m) => m[1]);
      if (blocks.length !== 1) { problems.push(`${where} has ${blocks.length} prompts, expected 1`); return; }
      const prompt = blocks[0].split("\n").map((l) => l.trim()).filter(Boolean).join(" ");

      const lighting = shot && shot.lighting;
      const env = shot && shot.env;
      const extras = shot ? shot.extras : "";
      if (!prompt.startsWith(`Create image: ${aspect} ${style} `)) problems.push(`${where} does not open with 'Create image:', the storyboard's aspect ratio line, and the style lock`);
      for (const [name, piece] of [["Environment: sentence", env], ["Lighting: sentence", lighting]])
        if (piece && count(prompt, piece) !== 1) problems.push(`${where} ${name} is not the storyboard shot's, word for word`);
      for (const [name, piece] of [["avoid line", avoid], ["closing sentence", panelClosing]])
        if (count(prompt, piece) !== 1) problems.push(`${where} ${name} appears ${count(prompt, piece)} times (expected 1)`);
      if (!prompt.endsWith(panelClosing)) problems.push(`${where} does not end with the closing sentence`);
      if (extras && count(prompt, extras) !== 1) problems.push(`${where} supporting cast sentences are not the storyboard's, word for word`);
      if (/\b(?:Camera|Transition|Faces|Characters): | · |No dialogue\.|3x2|storyboard grid|Horizontal 16:9 aspect ratio, full-frame widescreen composition\. Layout:/.test(prompt))
        problems.push(`${where} contains Camera:, Transition:, Faces:, Characters:, grid, label, or audio text`);
      if (OLD_LOCKS.test(prompt)) problems.push(`${where} carries the older character text or a Head lock:, Look lock:, or Scale lock: sentence`);

      // The Yetis in the panel are the ones whose full lock it carries.
      const present = [];
      for (const n of names) {
        const k = count(prompt, lockOf[n]);
        if (k > 1) problems.push(`${where} has ${n}'s lock ${k} times`);
        if (k >= 1) present.push({ name: n, at: prompt.indexOf(lockOf[n]) });
        else if (prompt.includes(`${n}: `)) problems.push(`${where} has a lock for ${n} that is not word for word`);
      }
      present.sort((a, b) => a.at - b.at);
      const order = present.map((p) => p.name);
      if (shot) for (const n of order)
        if (!shot.cast.includes(n)) problems.push(`${where} has ${n}, but Shot ${shotOf(i)}'s Characters: sentence does not`);
      if (PLACES[order.length]) {
        const missing = PLACES[order.length].filter((pl, k) => prompt.slice(present[k].at - pl.length, present[k].at) !== pl);
        if (missing.length) problems.push(`${where} places ${order.length} Yetis without ${PLACES[order.length].map((p) => p.replace(/[, ]+$/, "")).join(" / ")} directly before each lock`);
      }
      const faces = {};
      let exAt = -1;
      if (order.length) {
        if (prompt.includes(noYetiImage)) problems.push(`${where} has a Yeti but says '${noYetiImage}'`);
        const ex = expressions(prompt, where, problems);
        if (!ex) problems.push(`${where} has no Expressions: sentence`);
        else {
          exAt = ex.index;
          if (!same(ex.pairs.map((p) => p[0]), order)) problems.push(`${where} Expressions: does not name the placed Yetis in the same order`);
          for (const [n, f] of ex.pairs) if (n) faces[n] = f;
        }
        if (shot && i % BEATS === 0) for (const n of order)
          if (n in shot.faces && faces[n] !== undefined && faces[n] !== shot.faces[n])
            problems.push(`${where} face for ${n} is not Shot ${shotOf(i)}'s Expressions: face`);
      } else {
        if (count(prompt, noYetiImage) !== 1) problems.push(`${where} has no Yeti but does not say '${noYetiImage}'`);
        if (/Expressions: /.test(prompt)) problems.push(`${where} has no Yeti but has an Expressions: sentence`);
      }
      facesByPanel[i] = faces;

      const opener = `Action: ${framing}, ${angle} still. `;
      if (count(prompt, opener) !== 1) problems.push(`${where} Action: does not open '${opener.trim()}'`);
      const action = /Action: (.*?)(?: Effects: .*)? Single still reference image\./.exec(prompt);
      pictures.push(action ? action[1].toLowerCase().replace(/\s+/g, " ") : `missing ${i}`);

      const marks = [prompt.indexOf(style), prompt.indexOf(env || "Environment: "), prompt.indexOf(lighting || "Lighting: "),
        order.length ? present[0].at : prompt.indexOf(noYetiImage)];
      if (order.length) marks.push(exAt);
      if (extras && prompt.includes(extras)) marks.push(prompt.indexOf(extras));
      marks.push(prompt.indexOf(avoid), prompt.indexOf("Action: "), prompt.lastIndexOf(panelClosing));
      if (marks.includes(-1) || !sorted(marks))
        problems.push(`${where} pieces missing or out of order (style, Environment, Lighting, character locks, Expressions, cast, avoid, Action, closing)`);
    });

    if (sb) sb.forEach((shot, si) => {
      const s = si + 1;
      const shown = new Set([BEATS * s - 1, BEATS * s].flatMap((p) => Object.keys(facesByPanel[p] || {})));
      for (const n of shot.cast)
        if (!shown.has(n)) notes.push(`Video ${num} Shot ${s} names ${n} in Characters:, but neither of its panels shows ${n}`);
    });
    if (new Set(titles).size !== titles.length) problems.push("panel titles repeat; every panel needs its own");
    if (new Set(pictures).size !== pictures.length) problems.push("two panels describe the same picture; each beat is its own panel");
    if (previousLast && sb && !sb[0].sceneBreak)
      for (const n of Object.keys(previousLast))
        if (facesByPanel[1] && facesByPanel[1][n] && facesByPanel[1][n] !== previousLast[n])
          notes.push(`Video ${num} panel 1 face for ${n} differs from the previous video's panel 6; fine only if the first beat changes it`);
    previousLast = facesByPanel[PANELS.length] || null;

    failed ||= problems.length > 0;
    console.log(`Video ${num}: ` + (problems.length ? problems.join("; ") : "OK"));
  }

  if (withImages) {
    problems = [];
    const byGrid = new Map();
    for (const img of imagePaths) {
      const abs = path.join(REPO, img.file);
      if (!fs.existsSync(abs)) { problems.push(`missing ${img.file}`); continue; }
      if (!byGrid.has(img.grid)) byGrid.set(img.grid, []);
      byGrid.get(img.grid).push(fs.statSync(abs).mtimeMs);
    }
    for (const grid of new Set(imagePaths.map((i) => i.grid))) {
      const abs = path.join(REPO, grid);
      if (!fs.existsSync(abs)) { problems.push(`missing ${grid} (run compose_grid.ps1)`); continue; }
      const size = jpegSize(abs);
      if (!size || size[0] !== GRID_W || size[1] !== GRID_H) problems.push(`${grid} is ${size ? size.join("x") : "not a JPEG"}, expected ${GRID_W}x${GRID_H}`);
      const panels = byGrid.get(grid) || [];
      if (panels.length && fs.statSync(abs).mtimeMs < Math.max(...panels)) problems.push(`${grid} is older than one of its panel images (compose it again)`);
    }
    failed ||= problems.length > 0;
    console.log("Images: " + (problems.length ? problems.join("; ") : "OK"));
  }

  for (const note of notes) console.log("Note: " + note);
  return failed ? 1 : 0;
}

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith("--"));
if (!target) {
  console.log("Usage: node .agents/skills/create-3x2-timed-image/check_grid.mjs prompts/<slug>-<30s|60s>-3x2.md [--images]");
  process.exit(2);
}
process.exit(main(target, args.includes("--images")));
