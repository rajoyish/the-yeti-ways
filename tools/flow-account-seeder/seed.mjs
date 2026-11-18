#!/usr/bin/env node
// Flow Account Seeder: the local half.
//
//   node tools/flow-account-seeder/seed.mjs build <prompts/...-storyboard.md>
//       Runs the create-flow-assets inventory on the storyboard and writes a seed
//       folder, references/flow-seed/<storyboard-stem>/, holding manifest.json and
//       every image the new Flow account needs: the three Yetis, the film's story
//       cast (front + turnaround + Character info), its plates (named exactly as
//       Flow must name them), and its three Agent instruction cards. Pick that
//       folder in the extension's Import tab.
//
//   node tools/flow-account-seeder/seed.mjs build --all
//       Seeds every Character in the local library (no plates, no cards) into
//       references/flow-seed/all-characters/: the way to copy Characters made in
//       one account into the other. Import skips the ones the account has.
//
//   node tools/flow-account-seeder/seed.mjs collect [<export .zip | dir>] [--storyboard <file>]
//       Moves what the extension's Export tab downloaded (default
//       ~/Downloads/flow-seed-export) into references/characters/ and
//       references/plates/<stem>/. Never overwrites a different file: it saves a
//       -v2 sibling and says so. Adds a "Generated reference images" section to a
//       story cast Character file that has none.
//
// Never calls a network service.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

createRequire(import.meta.url)(path.join(path.dirname(fileURLToPath(import.meta.url)), "zip.js")); // defines globalThis.FasZip

const ROOT = process.cwd();
const INVENTORY = path.join(ROOT, ".agents/skills/create-flow-assets/scripts/inventory.mjs");
const RULES = path.join(ROOT, ".agents/rules/character-consistency.md");
const CHAR_PROMPTS = path.join(ROOT, "prompts/characters");
const CHAR_IMAGES = path.join(ROOT, "references/characters");
const PLATES = path.join(ROOT, "references/plates");
const SEEDS = path.join(ROOT, "references/flow-seed");
const YETIS = ["Papa Yeti", "Mama Yeti", "Babu Yeti"];
const VOICES_MD = path.join(ROOT, ".agents/skills/ai-studio-tts/references/voices.md");
const VOICES_JSON = path.join(ROOT, "references/characters/voices.json");
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

const kebab = (s) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const rel = (p) => path.relative(ROOT, p);
const textBlocks = (md) => [...md.matchAll(/```text\n([\s\S]*?)\n```/g)].map((m) => ({ at: m.index, text: m[1] }));

function findImage(dir, base) {
  for (const ext of IMAGE_EXT) {
    const p = path.join(dir, base + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Width and height from a PNG, JPEG, or WebP header.
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === "PNG") return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), type: "PNG" };
  if (b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP") {
    const chunk = b.slice(12, 16).toString();
    if (chunk === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3), type: "WebP" };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1, type: "WebP" };
    }
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff, type: "WebP" };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5), type: "JPEG" };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

// ---------------------------------------------------------------- Character info sources

// The Copy-Ready Google Flow Character Lock for a Yeti, verbatim.
function yetiLock(name) {
  const md = fs.readFileSync(RULES, "utf8");
  for (const b of textBlocks(md)) if (b.text.startsWith(`${name}:`)) return b.text;
  return null;
}

// The `## Character info` text block of a story cast Character file.
function castInfo(file) {
  const md = fs.readFileSync(file, "utf8");
  const at = md.search(/^## Character info/m);
  return at < 0 ? null : textBlocks(md.slice(at))[0]?.text ?? null;
}

// Info exported from the old Flow account wins: it is what the Character really holds.
function exportedInfo(name) {
  const p = path.join(CHAR_IMAGES, `${kebab(name)}-info.txt`);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").replace(/\n$/, "") : null;
}

// ---------------------------------------------------------------- voices

// Flow's 30 voices and the fixed speakers' voices, from the ai-studio-tts
// skill's voices.md (the one list every skill uses).
function voiceList() {
  const md = fs.readFileSync(VOICES_MD, "utf8");
  const all = new Set();
  const meta = {};
  const fixed = {};
  const allAt = md.indexOf("## All voices");
  for (const m of md.slice(allAt).matchAll(/^\| ([A-Z][a-z]+) \| (Male|Female|Ungendered) \| ([^|]+) \| ([^|]+) \| yes \|$/gm)) {
    all.add(m[1]);
    meta[m[1]] = { gender: m[2], description: m[3].trim().toLowerCase(), pitch: m[4].trim().toLowerCase() };
  }
  const fixedPart = md.slice(md.indexOf("## Fixed voices"), allAt);
  for (const m of fixedPart.matchAll(/^\| ([A-Z][A-Za-z ]+?) \| ([A-Z][a-z]+) \|/gm)) if (m[1] !== "Speaker") fixed[m[1]] = m[2];
  return { all, fixed, meta };
}

// Words in a storyboard's voice description → Flow's voice descriptions and pitches.
const STYLE_WORDS = {
  soft: ["soft", "hushed", "quiet"],
  friendly: ["friendly", "kind", "cheery"],
  gravelly: ["gravelly", "husky", "raspy", "crackly", "gruff", "rough"],
  "easy-going": ["easy-going", "easygoing", "relaxed", "laid-back", "calm"],
  firm: ["firm", "stern", "commanding", "regal", "strict"],
  breezy: ["breezy", "airy", "light"],
  bright: ["bright", "sparkling", "clear-eyed"],
  informative: ["informative", "explaining", "teacherly"],
  smooth: ["smooth", "silky", "sly", "cool", "velvety"],
  breathy: ["breathy", "whispery", "wheezy"],
  clear: ["clear", "crisp"],
  excitable: ["excitable", "excited", "quick", "eager", "chattery", "chattering", "fussy", "jittery", "huffy"],
  mature: ["mature", "old", "elderly", "aged", "grandmotherly", "grandfatherly", "wise"],
  upbeat: ["upbeat", "cheerful", "playful", "jolly", "happy"],
  forward: ["forward", "bold", "confident", "showy"],
  knowledgeable: ["knowledgeable", "learned", "scholarly", "wise"],
  even: ["even", "steady", "measured", "slow"],
  warm: ["warm", "loving", "tender"],
  gentle: ["gentle", "kindly", "mild", "soothing"],
  casual: ["casual", "chatty", "easy"],
  lively: ["lively", "sing-song", "bouncy", "animated", "spirited"],
  youthful: ["youthful", "young", "little", "small", "childlike", "tiny"],
};
const PITCH_WORDS = {
  high: ["high", "squeaky", "squeaking", "piping", "tiny", "shrill", "little"],
  low: ["low", "deep", "rumbling", "booming", "bass", "gravelly"],
};

// Pick the Flow voice closest to a speaker's described voice.
function suggestVoice(description, characterText, taken, voices) {
  const d = ` ${description.toLowerCase().replace(/[^a-z\- ]/g, " ")} `;
  const has = (w) => d.includes(` ${w} `);
  const t = ` ${(characterText || "").toLowerCase()} `;
  const count = (re) => (t.match(re) || []).length;
  const she = count(/\b(she|her|hers|girl|mother|queen|lady|woman)\b/g);
  const he = count(/\b(he|him|his|boy|father|king|man|grandfather)\b/g);
  const gender = she > he * 1.5 ? "Female" : he > she * 1.5 ? "Male" : null;
  const wantHigh = PITCH_WORDS.high.some(has);
  const wantLow = PITCH_WORDS.low.some(has);
  let best = null;
  for (const [name, v] of Object.entries(voices.meta)) {
    if (taken.has(name)) continue;
    let score = 0;
    if (gender && v.gender !== gender && v.gender !== "Ungendered") score -= 10;
    if (gender && v.gender === gender) score += 3;
    for (const word of (STYLE_WORDS[v.description] || [v.description])) if (has(word)) score += 2;
    if (wantHigh) score += /high|younger/.test(v.pitch) ? 3 : v.pitch === "mid" ? 0 : -2;
    if (wantLow) score += /low/.test(v.pitch) ? 3 : v.pitch === "mid" ? 0 : -2;
    if (!wantHigh && !wantLow && v.pitch === "mid") score += 1;
    if (!best || score > best.score) best = { name, score };
  }
  return best?.name ?? null;
}

// The first Flow voice named in a table cell ("Sadachbia (Zeno is not in Flow)" → Sadachbia).
function voiceIn(cell, all) {
  for (const w of (cell || "").match(/[A-Z][a-z]+/g) || []) if (all.has(w)) return w;
  return null;
}

// Speaker → Flow voice from a storyboard's `## Voice cast` table: the column
// headed "Flow Character voice" (or "Flow voice"), else a Voice column that
// holds a Flow voice name.
function storyboardVoices(md, all) {
  const at = md.search(/^## Voice cast/m);
  const out = { voices: {}, descriptions: {} };
  if (at < 0) return out;
  const section = md.slice(at).split(/\n## (?!#)/)[0];
  const rows = section.split("\n").filter((l) => l.startsWith("|")).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  if (rows.length < 3) return out;
  const head = rows[0].map((h) => h.toLowerCase());
  const col = head.findIndex((h) => h.includes("flow") && h.includes("voice"));
  const descCol = head.findIndex((h) => h === "voice" || h.startsWith("voice ("));
  for (const r of rows.slice(2)) {
    const speaker = r[0];
    if (!speaker) continue;
    const cell = col >= 0 ? r[col] : r.slice(1).find((c) => voiceIn(c, all) && c.split(/\s+/).length <= 4);
    const v = voiceIn(cell, all);
    if (v) out.voices[speaker] = v;
    if (descCol >= 0 && r[descCol]) out.descriptions[speaker] = r[descCol];
  }
  return out;
}

const exportedVoices = () => (fs.existsSync(VOICES_JSON) ? JSON.parse(fs.readFileSync(VOICES_JSON, "utf8")) : {});

// Give each seeded Character its voice: a Yeti always its fixed voice; a story
// cast member the storyboard's choice, else the voice exported from Flow.
// Enforces voices.md: no story character takes a fixed voice, no two share one.
function assignVoices(characters, cast, missing) {
  const voices = voiceList();
  const { all, fixed } = voices;
  const fromStoryboard = cast.voices || {};
  const described = cast.descriptions || {};
  const exported = exportedVoices();
  const fixedVoices = new Set(Object.values(fixed));
  const used = new Map();
  // Fixed and named voices first, so a suggestion never takes one of them.
  const order = [...characters].sort((a, b) => (fromStoryboard[a.name] || YETIS.includes(a.name) ? 0 : 1) - (fromStoryboard[b.name] || YETIS.includes(b.name) ? 0 : 1));
  for (const c of order) {
    let v = null, source = null;
    if (YETIS.includes(c.name)) {
      v = fixed[c.name];
      source = "fixed";
      if (fromStoryboard[c.name] && fromStoryboard[c.name] !== v)
        missing.push([c.name, `storyboard voice ${fromStoryboard[c.name]}`, `ignored: ${c.name} always speaks with ${v} (voices.md)`]);
    } else if (fromStoryboard[c.name]) {
      v = fromStoryboard[c.name];
      source = "storyboard";
    } else if (described[c.name]) {
      const file = path.join(CHAR_PROMPTS, `${kebab(c.name)}-flow-character.md`);
      const text = (c.info || "") + (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
      v = suggestVoice(described[c.name], text, new Set([...used.keys(), ...fixedVoices]), voices);
      source = `suggested from "${described[c.name]}"`;
      if (v) missing.push([c.name, `voice ${v}`, `suggested from the storyboard's description; write "${v}" in its Voice cast (Flow Character voice) to keep it`]);
    } else if (exported[c.name] && all.has(exported[c.name])) {
      v = exported[c.name];
      source = "exported";
    }
    if (v && !YETIS.includes(c.name) && fixedVoices.has(v)) {
      missing.push([c.name, `voice ${v}`, "not set: that voice belongs to a fixed speaker (voices.md); choose another in the storyboard's Voice cast"]);
      v = null;
    }
    if (v && used.has(v)) {
      missing.push([c.name, `voice ${v}`, `not set: ${used.get(v)} already speaks with ${v}; choose another in the storyboard's Voice cast`]);
      v = null;
    }
    if (v) used.set(v, c.name);
    c.voice = v;
    c.voiceSource = v ? source.replace(/^suggested.*/, "suggested") : null;
  }
}

// ---------------------------------------------------------------- the local library

// Every Character with local images, keyed by kebab name. Names come from
// references/characters/library.json (written by collect), the Character
// file's heading, or the Yeti names.
const LIBRARY_INDEX = path.join(CHAR_IMAGES, "library.json");
const readIndex = () => (fs.existsSync(LIBRARY_INDEX) ? JSON.parse(fs.readFileSync(LIBRARY_INDEX, "utf8")) : {});

function nameFor(k) {
  const idx = readIndex();
  if (idx[k]) return idx[k];
  const y = YETIS.find((n) => kebab(n) === k);
  if (y) return y;
  const file = path.join(CHAR_PROMPTS, `${k}-flow-character.md`);
  if (fs.existsSync(file)) {
    const m = fs.readFileSync(file, "utf8").match(/^# (.+?) Flow Character/m);
    if (m) return m[1];
  }
  return k.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function library() {
  const keys = new Set();
  if (fs.existsSync(CHAR_IMAGES))
    for (const f of fs.readdirSync(CHAR_IMAGES)) {
      const m = f.match(/^(.+?)-(front|turnaround)\.(png|jpe?g|webp)$/i);
      if (m) keys.add(m[1]);
    }
  return [...keys].sort().map((k) => {
    const name = nameFor(k);
    const file = path.join(CHAR_PROMPTS, `${k}-flow-character.md`);
    return {
      name,
      key: k,
      kind: YETIS.includes(name) ? "yeti" : "cast",
      front: findImage(CHAR_IMAGES, `${k}-front`),
      turnaround: findImage(CHAR_IMAGES, `${k}-turnaround`),
      info: exportedInfo(name) ?? (YETIS.includes(name) ? yetiLock(name) : fs.existsSync(file) ? castInfo(file) : null),
    };
  });
}

// ---------------------------------------------------------------- build

function cards(md) {
  const out = [];
  const start = md.search(/^## Google Flow Agent instructions/m);
  if (start < 0) return out;
  const section = md.slice(start).split(/\n## (?!#)/)[0];
  const heads = [...section.matchAll(/^### Instruction (\d+) - (.+)$/gm)];
  heads.forEach((h, i) => {
    const body = section.slice(h.index, heads[i + 1]?.index ?? section.length);
    const refLine = (body.match(/^Reference:\s*(.+)$/m) || [])[1] || "None";
    const plate = ((refLine.match(/`(Plate - [^`]+)`/) || refLine.match(/(Plate - [^(,;`]+)/) || [])[1] || "").trim() || null;
    const text = textBlocks(body)[0]?.text;
    out.push({ n: Number(h[1]), title: `Instruction ${h[1]} - ${h[2].trim()}`, reference: plate, text: text ?? null });
  });
  return out;
}

function build(storyboard) {
  if (!storyboard || !fs.existsSync(storyboard)) die("Usage: seed.mjs build <prompts/...-storyboard.md>");
  const inv = JSON.parse(execFileSync("node", [INVENTORY, storyboard, "--json"], { cwd: ROOT, encoding: "utf8" }));
  const md = fs.readFileSync(storyboard, "utf8");
  const stem = path.basename(storyboard, ".md");
  const out = path.join(SEEDS, stem);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, "characters"), { recursive: true });
  fs.mkdirSync(path.join(out, "plates"), { recursive: true });

  const missing = [];
  const copy = (src, dest) => {
    fs.copyFileSync(src, path.join(out, dest));
    return dest;
  };

  const characters = [];
  const addCharacter = (name, kind, info, front, turnaround, fix) => {
    const k = kebab(name);
    const entry = { name, kind, info, front: null, turnaround: null };
    if (front) entry.front = copy(front, `characters/${k}-front${path.extname(front)}`);
    if (turnaround) entry.turnaround = copy(turnaround, `characters/${k}-turnaround${path.extname(turnaround)}`);
    if (!info) missing.push([name, "Character info", fix.info]);
    if (!front) missing.push([name, "front image", fix.image]);
    if (!turnaround) missing.push([name, "turnaround image", fix.image]);
    characters.push(entry);
  };

  // All three Yetis, every time: Instruction 1 names all of them.
  for (const name of YETIS) {
    const k = kebab(name);
    addCharacter(
      name,
      "yeti",
      exportedInfo(name) ?? yetiLock(name),
      findImage(CHAR_IMAGES, `${k}-front`),
      findImage(CHAR_IMAGES, `${k}-turnaround`),
      { info: "Export it from the old account", image: "Export it from the old account (never generated)" }
    );
  }
  for (const c of inv.storyCast) {
    const fix = c.promptFile
      ? { info: "Add ## Character info to its file", image: "Export it from the old account, or run /create-flow-assets" }
      : { info: "Run /create-flow-assets (it builds the Character file)", image: "Run /create-flow-assets" };
    addCharacter(
      c.name,
      "cast",
      exportedInfo(c.name) ?? (c.promptFile ? castInfo(path.join(ROOT, c.promptFile)) : null),
      c.front && path.join(ROOT, c.front),
      c.turnaround && path.join(ROOT, c.turnaround),
      fix
    );
  }

  assignVoices(characters, storyboardVoices(md, voiceList().all), missing);

  const plates = [];
  for (const p of inv.plates) {
    if (p.name.startsWith("UNNAMED")) {
      missing.push([p.name, "plate label", "Label the plate line with the storyboard skill"]);
      continue;
    }
    const entry = { name: p.name, image: null };
    if (p.image) entry.image = copy(path.join(ROOT, p.image), `plates/${p.name}${path.extname(p.image)}`);
    else missing.push([p.name, "plate image", "Export it from the old account, or run /create-flow-assets"]);
    plates.push(entry);
  }

  const instructions = cards(md);
  if (!instructions.length) missing.push(["Agent instructions", "## Google Flow Agent instructions", "Rewrite the storyboard with its skill"]);
  for (const c of instructions) {
    if (!c.text) missing.push([c.title, "guideline text block", "Fix the storyboard"]);
    if (c.reference && !plates.some((p) => p.name === c.reference && p.image))
      missing.push([c.title, `reference ${c.reference}`, "Seed that plate first"]);
  }

  const manifest = {
    version: 1,
    storyboard: rel(path.resolve(storyboard)),
    title: (md.match(/^#\s+(.+)$/m) || [])[1] || stem,
    built: new Date().toISOString(),
    characters,
    plates,
    instructions,
    library: library().map((c) => c.name),
  };
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const zipped = zipFolder(out);
  const lines = [`# Flow seed for ${manifest.storyboard}`, "", `Seed: \`${rel(zipped)}\` (or the folder \`${rel(out)}\`); choose it in the extension's Import tab`, ""];
  lines.push("| Item | Kind | Voice | Ready |", "| --- | --- | --- | --- |");
  for (const c of characters) lines.push(`| ${c.name} | ${c.kind} Character | ${c.voice ? `${c.voice} (${c.voiceSource})` : "none"} | ${c.front && c.turnaround && c.info ? "yes" : "no"} |`);
  for (const p of plates) lines.push(`| ${p.name} | plate | | ${p.image ? "yes" : "no"} |`);
  for (const c of instructions) lines.push(`| ${c.title} | card${c.reference ? ` (ref ${c.reference})` : ""} | | ${c.text ? "yes" : "no"} |`);
  if (missing.length) {
    lines.push("", "## Missing", "", "| Item | What | Next step |", "| --- | --- | --- |");
    for (const [a, b, c] of missing) lines.push(`| ${a} | ${b} | ${c} |`);
    lines.push("", "Import skips anything missing; run build again once it exists.");
  }
  console.log(lines.join("\n"));
}

function buildAll() {
  const out = path.join(SEEDS, "all-characters");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, "characters"), { recursive: true });
  const lib = library();
  const characters = [];
  const missing = [];
  for (const c of lib) {
    const entry = { name: c.name, kind: c.kind, info: c.info, front: null, turnaround: null };
    for (const view of ["front", "turnaround"]) {
      if (!c[view]) { missing.push([c.name, `${view} image`]); continue; }
      entry[view] = `characters/${c.key}-${view}${path.extname(c[view])}`;
      fs.copyFileSync(c[view], path.join(out, entry[view]));
    }
    if (!c.info) missing.push([c.name, "Character info"]);
    characters.push(entry);
  }
  const voiceProblems = [];
  assignVoices(characters, {}, voiceProblems);
  for (const [a, b, c] of voiceProblems) missing.push([a, `${b}: ${c}`]);
  const manifest = { version: 1, storyboard: null, title: "All Characters", built: new Date().toISOString(), characters, plates: [], instructions: [], library: lib.map((c) => c.name) };
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  const zipped = zipFolder(out);
  const lines = [`# Flow seed: all ${characters.length} library Characters`, "", `Seed: \`${rel(zipped)}\` (or the folder \`${rel(out)}\`); choose it in the extension's Import tab`, ""];
  lines.push("| Character | Voice | Ready |", "| --- | --- | --- |", ...characters.map((c) => `| ${c.name} | ${c.voice ? `${c.voice} (${c.voiceSource})` : "none"} | ${c.front && c.turnaround && c.info ? "yes" : "no"} |`));
  if (missing.length) lines.push("", "Missing: " + missing.map(([a, b]) => `${a} (${b})`).join("; ") + ". Export them from the account that has them.");
  console.log(lines.join("\n"));
}

// ---------------------------------------------------------------- collect

// Place src at dest without ever replacing a different file.
function place(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const ext = path.extname(dest);
  const base = dest.slice(0, -ext.length);
  // The same image under another extension counts as present.
  const existing = IMAGE_EXT.map((e) => base + e).find((p) => fs.existsSync(p)) ?? (fs.existsSync(dest) ? dest : null);
  if (!existing) {
    fs.copyFileSync(src, dest);
    return { status: "saved", path: dest };
  }
  if (Buffer.compare(fs.readFileSync(existing), fs.readFileSync(src)) === 0) return { status: "same", path: existing };
  for (let v = 2; ; v++) {
    const alt = `${base}-v${v}${ext}`;
    if (!fs.existsSync(alt)) {
      fs.copyFileSync(src, alt);
      return { status: `kept existing; saved as -v${v}`, path: alt };
    }
    if (Buffer.compare(fs.readFileSync(alt), fs.readFileSync(src)) === 0) return { status: "same", path: alt };
  }
}

function linkImages(name, front, turnaround) {
  const file = path.join(CHAR_PROMPTS, `${kebab(name)}-flow-character.md`);
  if (!fs.existsSync(file)) return "no Character file";
  const md = fs.readFileSync(file, "utf8");
  if (/^## Generated reference images/m.test(md)) return "file already links images (left as is)";
  const line = (label, p, shape) => {
    const s = imageSize(p);
    const dims = s ? `${s.w} × ${s.h} ${s.type}` : path.extname(p).slice(1).toUpperCase();
    return `- [${label}](../../${rel(p)}) — ${dims}, ${shape}.`;
  };
  const section = [
    "## Generated reference images",
    "",
    "Preparation status: exported from the saved Flow Character.",
    "",
    line("Portrait: front view", front, "square 1:1"),
    line("Body: turnaround", turnaround, "approximately 16:9"),
    "",
    "Exported from the saved Flow Character's Portrait and Body slots at full resolution with the Flow Account Seeder; they are the images the Character was saved with.",
    "",
  ].join("\n");
  const at = md.search(/^## Character name/m);
  fs.writeFileSync(file, at < 0 ? md + "\n" + section : md.slice(0, at) + section + "\n" + md.slice(at));
  return "linked";
}

// The storyboard whose Agent setup prompt names every exported plate.
function storyboardFor(names) {
  const dir = path.join(ROOT, "prompts");
  const hits = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith("-storyboard.md"))
    .filter((f) => {
      const md = fs.readFileSync(path.join(dir, f), "utf8");
      return names.every((n) => md.includes(`${n}:`) || md.includes(`"${n}"`));
    });
  return hits;
}

function collectCharacter(k, meta, files, rows) {
  if (meta.voice) {
    const voices = exportedVoices();
    if (voices[meta.name] !== meta.voice) {
      rows.push([meta.name, "voice", voices[meta.name] ? `${voices[meta.name]} → ${meta.voice}` : meta.voice, rel(VOICES_JSON)]);
      voices[meta.name] = meta.voice;
      fs.mkdirSync(path.dirname(VOICES_JSON), { recursive: true });
      fs.writeFileSync(VOICES_JSON, JSON.stringify(voices, null, 2) + "\n");
    }
  }
  const idx = readIndex();
  if (idx[k] !== meta.name) {
    idx[k] = meta.name;
    fs.mkdirSync(CHAR_IMAGES, { recursive: true });
    fs.writeFileSync(LIBRARY_INDEX, JSON.stringify(idx, null, 2) + "\n");
  }
  const placed = {};
  for (const view of ["front", "turnaround"]) {
    if (!files[view]) continue;
    const r = place(files[view], path.join(CHAR_IMAGES, `${k}-${view}${path.extname(files[view]).toLowerCase()}`));
    placed[view] = r.path;
    rows.push([meta.name, view, r.status, rel(r.path)]);
  }
  if (meta.info) {
    const tmp = path.join(os.tmpdir(), `flow-seed-${k}-info.txt`);
    fs.writeFileSync(tmp, meta.info + "\n");
    const r = place(tmp, path.join(CHAR_IMAGES, `${k}-info.txt`));
    rows.push([meta.name, "Character info", r.status, rel(r.path)]);
  }
  if (!YETIS.includes(meta.name) && placed.front && placed.turnaround)
    rows.push([meta.name, "Character file", linkImages(meta.name, placed.front, placed.turnaround), `prompts/characters/${k}-flow-character.md`]);
}

// plates: [{ name, file }] from one Flow project.
function collectPlates(label, plates, rows, storyboardArg) {
  if (!plates.length) return;
  let stem = storyboardArg ? path.basename(storyboardArg, ".md") : null;
  if (!stem) {
    const hits = storyboardFor(plates.map((p) => p.name));
    if (hits.length !== 1) {
      rows.push([label, "plates", `not placed: ${hits.length ? `matches ${hits.join(", ")}` : "no storyboard names these plates"}; run again with --storyboard <file>`, ""]);
      return;
    }
    stem = path.basename(hits[0], ".md");
  }
  for (const p of plates) {
    const r = place(p.file, path.join(PLATES, stem, `${kebab(p.name)}${path.extname(p.file).toLowerCase()}`));
    rows.push([p.name, "plate", r.status, rel(r.path)]);
  }
}

// A folder holding manifest.json (an unpacked export ZIP or seed).
function collectManifest(dir, rows, storyboardArg) {
  const m = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  for (const c of m.characters || []) {
    const files = {};
    for (const view of ["front", "turnaround"]) if (c[view] && fs.existsSync(path.join(dir, c[view]))) files[view] = path.join(dir, c[view]);
    collectCharacter(kebab(c.name), { name: c.name, info: c.info, voice: c.voice }, files, rows);
  }
  const byProject = new Map();
  for (const p of m.plates || []) {
    if (!p.image || !fs.existsSync(path.join(dir, p.image))) continue;
    const list = byProject.get(p.project || m.title) ?? [];
    list.push({ name: p.name, file: path.join(dir, p.image) });
    byProject.set(p.project || m.title, list);
  }
  for (const [label, plates] of byProject) collectPlates(label, plates, rows, storyboardArg);
}

// The loose layout of the first exports: characters/<k>-front.*, <k>-info.json,
// plates/<project>/<plate>.* + .json.
function collectLoose(dir, rows, storyboardArg) {
  const chars = path.join(dir, "characters");
  if (fs.existsSync(chars)) {
    const people = new Map();
    for (const f of fs.readdirSync(chars)) {
      const m = f.match(/^(.+?)-(front|turnaround)\.(png|jpe?g|webp)$/i) || f.match(/^(.+?)-(info)\.json$/i);
      if (!m) continue;
      const p = people.get(m[1]) ?? {};
      p[m[2]] = path.join(chars, f);
      people.set(m[1], p);
    }
    for (const [k, p] of people) {
      const meta = p.info ? JSON.parse(fs.readFileSync(p.info, "utf8")) : { name: nameFor(k) };
      collectCharacter(k, meta, p, rows);
    }
  }
  const plates = path.join(dir, "plates");
  if (fs.existsSync(plates)) {
    for (const project of fs.readdirSync(plates)) {
      const pdir = path.join(plates, project);
      if (!fs.statSync(pdir).isDirectory()) continue;
      const list = fs.readdirSync(pdir).filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase())).map((f) => {
        const meta = path.join(pdir, f.replace(/\.[^.]+$/, ".json"));
        return { name: fs.existsSync(meta) ? JSON.parse(fs.readFileSync(meta, "utf8")).name : f.replace(/\.[^.]+$/, ""), file: path.join(pdir, f) };
      });
      collectPlates(project, list, rows, storyboardArg);
    }
  }
}

async function unzipTo(zipFile) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "flow-seed-zip-"));
  for (const f of await FasZip.unzip(fs.readFileSync(zipFile))) {
    const dest = path.join(out, f.path);
    if (!dest.startsWith(out + path.sep)) continue; // never write outside the temp folder
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, f.data);
  }
  return out;
}

// collect [<export .zip | folder>]: default ~/Downloads/flow-seed-export, where
// every .zip and any loose exports are collected.
async function collect(src, storyboardArg) {
  src = src ?? path.join(os.homedir(), "Downloads/flow-seed-export");
  if (!fs.existsSync(src)) die(`Nothing at ${src}. Export from the extension first.`);
  const rows = [];
  const zips = src.toLowerCase().endsWith(".zip")
    ? [src]
    : fs.readdirSync(src).filter((f) => f.toLowerCase().endsWith(".zip")).sort().map((f) => path.join(src, f));
  for (const z of zips) {
    const dir = await unzipTo(z);
    rows.push([path.basename(z), "ZIP", "unpacked", ""]);
    if (fs.existsSync(path.join(dir, "manifest.json"))) collectManifest(dir, rows, storyboardArg);
    else collectLoose(dir, rows, storyboardArg);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (!src.toLowerCase().endsWith(".zip")) {
    if (fs.existsSync(path.join(src, "manifest.json"))) collectManifest(src, rows, storyboardArg);
    else collectLoose(src, rows, storyboardArg);
  }
  if (!rows.length) die(`Nothing to collect in ${src}.`);
  console.log(["| Item | What | Result | Path |", "| --- | --- | --- | --- |", ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n"));
  console.log("\nOpen every collected image and check it against its Character's checks before seeding.");
}

// Pack a seed folder into <folder>.zip beside it (Import takes either).
function zipFolder(dir) {
  const files = [];
  const walk = (d) => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (f !== ".DS_Store") files.push({ path: path.relative(dir, p).split(path.sep).join("/"), data: new Uint8Array(fs.readFileSync(p)) });
    }
  };
  walk(dir);
  const out = dir + ".zip";
  fs.writeFileSync(out, FasZip.zip(files));
  return out;
}

function die(msg) {
  console.error(msg);
  process.exit(2);
}

const [cmd, ...rest] = process.argv.slice(2);
const flag = (name) => (rest.includes(name) ? rest[rest.indexOf(name) + 1] : null);
const positional = rest.filter((a, i) => !a.startsWith("--") && !rest[i - 1]?.startsWith("--"));
if (cmd === "build" && rest.includes("--all")) buildAll();
else if (cmd === "build") build(positional[0]);
else if (cmd === "collect") await collect(positional[0], flag("--storyboard"));
else die("Usage: seed.mjs build <storyboard.md> | seed.mjs build --all | seed.mjs collect [<export dir>] [--storyboard <file>]");
