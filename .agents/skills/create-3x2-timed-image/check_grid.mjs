#!/usr/bin/env node
// Check a 3x2 file's panel image prompts against its storyboard's Agent prompts and the rule files.
//
// Usage: node .agents/skills/create-3x2-timed-image/check_grid.mjs prompts/<slug>-<length>-3x2.md [--images]
//
// Finds the storyboard by name (prompts/<slug>-<length>-storyboard.md) and, for each video the 3x2 file
// holds (all of the film's videos or only some), reads that video's Agent prompt: its format line,
// Setting: line, and timestamped shot lines (framing, angle, In frame:, faces, Light:), as SKILL.md's
// "Reading an Agent prompt" sets out. Reads the character locks from .agents/rules/character-consistency.md,
// the style lock, avoid line, and expression table from .agents/rules/prompt-assembly.md, the story cast
// sentences from prompts/characters/, and the fixed panel image sentences from this skill's SKILL.md each
// time it runs. Prints OK or the problems for each video, prints Note: lines for things worth a look that
// are not always wrong, and exits with status 1 if anything fails.
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
// Beat boundaries: a shot is one beat or two beats in a row, so a video has three to six shots.
const BOUNDS = ["00:00", "00:01.5", "00:03", "00:05", "00:07", "00:08.5", "00:10"];
const PANELS = ["00:00.0–00:01.5", "00:01.5–00:03.0", "00:03.0–00:05.0",
  "00:05.0–00:07.0", "00:07.0–00:08.5", "00:08.5–00:10.0"];
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
// For each panel 1-6: { shot: index into the video's shots, first, last } (filled per video).
const IN_FRAME = /In frame: [^.]*\./;
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

const CHAR_DIR = path.join(REPO, "prompts", "characters");
const ts = (s) => s.replace(/^(\d\d:\d\d)\.0$/, "$1");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function castSentences() {
  // { <Character name>: <its "Full, for still image prompts" sentence> } from prompts/characters/.
  const out = {};
  if (!fs.existsSync(CHAR_DIR)) return out;
  for (const f of fs.readdirSync(CHAR_DIR).filter((x) => x.endsWith("-flow-character.md"))) {
    const t = read(path.join(CHAR_DIR, f));
    const name = /^# (.+?) Flow Character\s*$/m.exec(t);
    const full = /Full, for still image prompts:\s*\n\s*`([^`]+)`/.exec(t);
    if (name && full) out[name[1]] = full[1].trim();
  }
  return out;
}

function parseAgentPrompt(body, ctx) {
  // The pieces a panel image needs, from one video's Agent prompt, as SKILL.md's "Reading an Agent prompt" sets out.
  const { style, NAME, names, adultFaces, babyFaces } = ctx;
  const problems = [];
  const block = /Agent prompt:\s*\n+```text\n([\s\S]*?)\n```/.exec(body);
  if (!block) return { problems: ["has no 'Agent prompt:' block"] };
  const lines = block[1].split("\n").map((l) => l.trim()).filter(Boolean);
  const format = lines.find((l) => /^(Vertical 9:16|Horizontal 16:9) video\b/.test(l));
  let aspect = null;
  if (!format) problems.push("has no format line ('Vertical 9:16 video, ...')");
  else {
    aspect = format.startsWith("Vertical") ? "Vertical 9:16 aspect ratio, full-frame vertical composition."
      : "Horizontal 16:9 aspect ratio, full-frame widescreen composition.";
    if (!format.includes(style)) problems.push("format line does not carry the style lock word for word");
  }
  const setting = lines.find((l) => l.startsWith("Setting: "));
  if (!setting) problems.push("has no 'Setting:' line");
  const env = setting ? `Environment: ${setting.slice("Setting: ".length)}` : null;

  const shotLines = lines.filter((l) => /^\d\d:\d\d(?:\.\d+)?-\d\d:\d\d(?:\.\d+)?, /.test(l));
  const faceRows = [...adultFaces, ...babyFaces];
  const shots = [];
  let at = 0;
  for (const [k, line] of shotLines.entries()) {
    const where = `Shot ${k + 1}`;
    const m = /^(\S+?)-(\S+?), (.+?)\. (In frame: .+?\.) (.*)$/.exec(line);
    if (!m) { problems.push(`${where} is not '<start>-<end>, <Framing>, <Angle>. In frame: ... .'`); continue; }
    const a = BOUNDS.indexOf(ts(m[1])), b = BOUNDS.indexOf(ts(m[2]));
    if (a !== at || b - a < 1 || b - a > 2) {
      problems.push(`${where} runs ${m[1]}-${m[2]}; shots must run in order from 00:00 to 00:10 on the beat boundaries ${BOUNDS.join(", ")}, each one or two beats long`);
      at = -99;
      continue;
    }
    at = b;
    const head = m[3].replace(/\s*\([^)]*\)/g, "");
    const fm = /^(.+?)(?: to (.+?))?, (.+?)(?: to (.+))?$/.exec(head);
    if (!fm) problems.push(`${where} framing and angle '${head}' do not parse`);
    const rest = m[5];
    const light = /Light: ([^]*?)$/.exec(rest);
    if (!light) problems.push(`${where} has no 'Light:' part`);
    const yetis = names.filter((n) => m[4].includes(n));
    const others = Object.keys(ctx.cast).filter((n) => m[4].includes(n));
    // Faces: each table row used in the line, owned by the last Yeti named before it.
    const hits = [];
    for (const f of faceRows) { let i = line.indexOf(f); while (i !== -1) { hits.push([i, f]); i = line.indexOf(f, i + 1); } }
    hits.sort((x, y) => x[0] - y[0]);
    const closing = {};
    for (const [i, f] of hits) {
      const before = [...line.slice(0, i).matchAll(new RegExp(NAME, "g"))].map((x) => x[0]);
      const owner = before.length ? before[before.length - 1] : yetis[0];
      if (owner) closing[owner] = f;
    }
    shots.push({
      beats: b - a, open: fm ? fm[1] : null, close: fm ? fm[2] || fm[1] : null,
      angleOpen: fm ? fm[3] : null, angleClose: fm ? fm[4] || fm[3] : null,
      inFrame: m[4], yetis, others, faces: closing,
      lighting: light ? `Lighting: ${cap(light[1].trim())}` : null,
    });
  }
  if (at !== BOUNDS.length - 1 && at !== -99) problems.push(`shots end at ${BOUNDS[at] || "?"}, not 00:10`);
  const panels = [];
  shots.forEach((sh, si) => { for (let j = 0; j < sh.beats; j++) panels.push({ shot: si, first: j === 0, last: j === sh.beats - 1 }); });
  return { problems, aspect, env, shots, panels, sceneBreak: /^Scene break:/m.test(body) };
}

function main(target, withImages) {
  const file = path.resolve(target);
  const fm = /(.+)-(\d+s)-3x2\.md$/.exec(path.basename(file));
  if (!fm) { console.log(`${target} is not named <slug>-<duration>-3x2.md`); return 1; }
  const boardPath = path.join(path.dirname(file), `${fm[1]}-${fm[2]}-storyboard.md`);
  if (!fs.existsSync(boardPath)) { console.log(`Storyboard not found: ${boardPath}`); return 1; }
  const slug = fm[1];

  const { locks, style, avoid, adultFaces, babyFaces } = loadRules();
  const lockOf = Object.fromEntries(locks.map((l) => [l.name, l.lock]));
  const names = locks.map((l) => l.name);
  const NAME = names.map(esc).join("|");
  const facesFor = (name) => (name === BABY ? babyFaces : adultFaces);
  const cast = castSentences();

  function expressions(text, where, problems) {
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
    return { pairs, index: hits[0].index };
  }

  const fixedPanel = quotes(section(read(SKILL), "Fixed panel image sentences"));
  if (fixedPanel.length !== 2) { console.log(`Expected 2 fixed panel image sentences in ${SKILL}, found ${fixedPanel.length}.`); return 1; }
  const [noYetiImage, panelClosing] = fixedPanel;

  let failed = false;
  const notes = [];
  let problems = [];
  const board = read(boardPath);
  if (/^\| Timestamp /m.test(board)) {
    console.log("Storyboard is in the older table format; revise it with its storyboard skill first.");
    return 1;
  }
  const boardVideos = Object.fromEntries(videos(board).map(([n, t, b]) => [n, { title: t, body: b }]));

  const text = read(file);
  const fileVideos = videos(text);
  if (!fileVideos.length) { console.log("No '## Video N - <Title>' sections in the 3x2 file."); return 1; }
  const imagePaths = [];
  let previousLast = null, previousNum = null;
  for (const [num, title, body] of fileVideos) {
    let problems = [];
    const bv = boardVideos[num];
    if (!bv) { console.log(`Video ${num}: not in the storyboard`); failed = true; continue; }
    if (bv.title !== title) problems.push(`heading title '${title}' is not the storyboard's '${bv.title}'`);
    const sb = parseAgentPrompt(bv.body, { style, NAME, names, adultFaces, babyFaces, cast });
    problems.push(...sb.problems.map((p) => `storyboard: ${p}`));
    if (sb.problems.length) { failed = true; console.log(`Video ${num}: ${problems.join("; ")}`); previousLast = null; continue; }

    PANEL_HEAD.lastIndex = 0;
    const heads = [...body.matchAll(PANEL_HEAD)];
    const pre = heads.length ? body.slice(0, heads[0].index) : body;
    if (/^```/m.test(pre)) problems.push("has a code block before the first panel image; the grid has no prompt");
    const gridPath = `3x2-timed-storyboard-images/${slug}/Grid_V${num}.jpg`;
    if (!pre.includes(`Grid image: \`${gridPath}\``)) problems.push(`no 'Grid image: \`${gridPath}\`' line`);
    if (heads.length !== PANELS.length) problems.push(`${heads.length} panel images, expected exactly ${PANELS.length}`);

    const titles = [], pictures = [], facesByPanel = {};
    heads.slice(0, PANELS.length).forEach((h, idx) => {
      const i = idx + 1, where = `panel image ${i}`;
      if (Number(h[1]) !== i || h[2] !== PANELS[i - 1]) problems.push(`${where} heading should read '### Panel ${i} · ${PANELS[i - 1]}'`);
      const ttl = h[5];
      if (!TITLE.test(ttl)) problems.push(`${where} title '${ttl}' is not two to four words in capitals`);
      titles.push(ttl);
      const pm = sb.panels[i - 1];
      const shot = pm ? sb.shots[pm.shot] : null;
      const shotNo = pm ? pm.shot + 1 : "?";
      const framing = h[3], angle = h[4];
      if (shot) {
        const okF = shot.beats === 1 ? [shot.open, shot.close] : [pm.first ? shot.open : shot.close];
        if (!okF.includes(framing)) problems.push(`${where} framing '${framing}' should be ${okF.join(" or ")}, Shot ${shotNo}'s framing at this beat`);
        const okA = shot.beats === 1 ? [shot.angleOpen, shot.angleClose] : [pm.first ? shot.angleOpen : shot.angleClose];
        if (!okA.includes(angle)) problems.push(`${where} angle '${angle}' should be ${okA.join(" or ")}, Shot ${shotNo}'s angle at this beat`);
      }

      const partEnd = idx + 1 < heads.length ? heads[idx + 1].index : body.length;
      const part = body.slice(h.index + h[0].length, partEnd);
      const wantPath = `3x2-timed-storyboard-images/${slug}/Panel_${i}_V${num}.jpg`;
      if (!part.includes(`Image: \`${wantPath}\`.`)) problems.push(`${where} has no line 'Image: \`${wantPath}\`.'`);
      imagePaths.push({ num, panel: i, file: wantPath, grid: gridPath });
      const blocks = [...part.matchAll(/^```\n([\s\S]*?)\n```/gm)].map((m) => m[1]);
      if (blocks.length !== 1) { problems.push(`${where} has ${blocks.length} prompts, expected 1`); return; }
      const prompt = blocks[0].split("\n").map((l) => l.trim()).filter(Boolean).join(" ");

      if (!prompt.startsWith(`Create image: ${sb.aspect} ${style} `)) problems.push(`${where} does not open with 'Create image:', the aspect ratio line, and the style lock`);
      const pieces = [["Environment: sentence", sb.env], ["Lighting: sentence", shot && shot.lighting], ["In frame: sentence", shot && shot.inFrame]];
      for (const [name, piece] of pieces)
        if (piece && count(prompt, piece) !== 1) problems.push(`${where} ${name} is not the storyboard shot's, word for word`);
      for (const [name, piece] of [["avoid line", avoid], ["closing sentence", panelClosing]])
        if (count(prompt, piece) !== 1) problems.push(`${where} ${name} appears ${count(prompt, piece)} times (expected 1)`);
      if (!prompt.endsWith(panelClosing)) problems.push(`${where} does not end with the closing sentence`);
      const castHere = shot ? shot.others.map((n) => cast[n]) : [];
      for (const c of castHere) if (count(prompt, c) !== 1) problems.push(`${where} story cast sentence from prompts/characters/ is not word for word`);
      if (/\b(?:Camera|Transition|Faces|Characters|Setting|Cast|Light): | · |No dialogue|3x2|storyboard grid|@/.test(prompt))
        problems.push(`${where} contains Camera:, Transition:, Characters:, Setting:, Cast:, Light:, an @ name, grid, label, or audio text`);
      if (OLD_LOCKS.test(prompt)) problems.push(`${where} carries the older character text or a Head lock:, Look lock:, or Scale lock: sentence`);

      const present = [];
      for (const n of names) {
        const k = count(prompt, lockOf[n]);
        if (k > 1) problems.push(`${where} has ${n}'s lock ${k} times`);
        if (k >= 1) present.push({ name: n, at: prompt.indexOf(lockOf[n]) });
        else if (prompt.includes(`${n}: `)) problems.push(`${where} has a lock for ${n} that is not word for word`);
      }
      present.sort((a, b) => a.at - b.at);
      const order = present.map((p) => p.name);
      if (shot) {
        for (const n of order) if (!shot.yetis.includes(n)) problems.push(`${where} has ${n}'s lock, but Shot ${shotNo}'s In frame: does not name ${n}`);
        for (const n of shot.yetis) if (!order.includes(n)) problems.push(`${where} has no lock for ${n}, whom Shot ${shotNo}'s In frame: names`);
      }
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
        if (shot && pm.last) for (const n of order)
          if (shot.faces[n] && faces[n] !== undefined && faces[n] !== shot.faces[n])
            problems.push(`${where} face for ${n} should be Shot ${shotNo}'s closing face '${shot.faces[n]}'`);
      } else {
        if (count(prompt, noYetiImage) !== 1) problems.push(`${where} has no Yeti but does not say '${noYetiImage}'`);
        if (/Expressions: /.test(prompt)) problems.push(`${where} has no Yeti but has an Expressions: sentence`);
      }
      facesByPanel[i] = faces;

      const opener = `Action: ${framing}, ${angle} still. `;
      if (count(prompt, opener) !== 1) problems.push(`${where} Action: does not open '${opener.trim()}'`);
      const action = /Action: (.*?)(?: Effects: .*)? Single still reference image\./.exec(prompt);
      pictures.push(action ? action[1].toLowerCase().replace(/\s+/g, " ") : `missing ${i}`);

      const marks = [prompt.indexOf(style), prompt.indexOf(sb.env || "Environment: "), prompt.indexOf((shot && shot.lighting) || "Lighting: "),
        order.length ? present[0].at : prompt.indexOf(noYetiImage)];
      if (order.length) marks.push(exAt);
      for (const c of castHere) if (prompt.includes(c)) marks.push(prompt.indexOf(c));
      marks.push(prompt.indexOf((shot && shot.inFrame) || "In frame: "), prompt.indexOf(avoid), prompt.indexOf("Action: "), prompt.lastIndexOf(panelClosing));
      if (marks.includes(-1) || !sorted(marks))
        problems.push(`${where} pieces missing or out of order (style, Environment, Lighting, locks, Expressions, cast, In frame, avoid, Action, closing)`);
    });

    if (new Set(titles).size !== titles.length) problems.push("panel titles repeat; every panel needs its own");
    if (new Set(pictures).size !== pictures.length) problems.push("two panels describe the same picture; each beat is its own panel");
    if (previousLast && previousNum === num - 1 && !sb.sceneBreak)
      for (const n of Object.keys(previousLast))
        if (facesByPanel[1] && facesByPanel[1][n] && facesByPanel[1][n] !== previousLast[n])
          notes.push(`Video ${num} panel 1 face for ${n} differs from the previous video's panel 6; fine only if the first beat changes it`);
    previousLast = facesByPanel[PANELS.length] || null;
    previousNum = num;

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
