#!/usr/bin/env node
// Inventory the Flow assets a storyboard needs: its location plates and its
// story cast Characters (front and turnaround), and what already exists.
//
// Usage (from the repository root):
//   node .agents/skills/create-flow-assets/scripts/inventory.mjs <storyboard.md> [--json] [--emit <dir>]
//
// --json   print the inventory as JSON instead of a Markdown report.
// --emit   write one ready-to-send prompt file per missing asset into <dir>
//          (plates: <plate-kebab>.txt; characters: <name-kebab>-front.txt and
//          <name-kebab>-turnaround.txt), copied verbatim from the storyboard
//          and the Character files.
//
// Read-only except for --emit. Never calls a network service.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const storyboard = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--emit");
const asJson = args.includes("--json");
const emitDir = args.includes("--emit") ? args[args.indexOf("--emit") + 1] : null;

if (!storyboard || !fs.existsSync(storyboard)) {
  console.error("Usage: node inventory.mjs <prompts/...-storyboard.md> [--json] [--emit <dir>]");
  process.exit(2);
}

const ROOT = process.cwd();
const CHAR_PROMPTS = path.join(ROOT, "prompts/characters");
const CHAR_IMAGES = path.join(ROOT, "references/characters");
const stem = path.basename(storyboard, ".md");
const PLATE_IMAGES = path.join(ROOT, "references/plates", stem);
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];
const YETIS = ["Papa Yeti", "Mama Yeti", "Babu Yeti"];

const kebab = (s) =>
  s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const rel = (p) => {
  const r = path.relative(ROOT, p);
  return r.startsWith("..") ? path.resolve(p) : r;
};

function findImage(dir, base) {
  for (const ext of IMAGE_EXT) {
    const p = path.join(dir, base + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function textBlocks(md) {
  const blocks = [];
  const re = /```text\n([\s\S]*?)\n```/g;
  let m;
  while ((m = re.exec(md))) blocks.push({ start: m.index, text: m[1] });
  return blocks;
}

function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

const md = fs.readFileSync(storyboard, "utf8");

// ---------- Plates, from the Agent setup prompt ----------
const plates = [];
const plateProblems = [];
const setupStart = md.indexOf("## Agent setup prompt");
if (setupStart < 0) {
  plateProblems.push("No `## Agent setup prompt` section found.");
} else {
  const after = md.slice(setupStart);
  const block = textBlocks(after)[0];
  if (!block) {
    plateProblems.push("The Agent setup prompt has no `text` block.");
  } else {
    const lines = block.text.split("\n");
    const listed = [...lines[0].matchAll(/"(Plate - [^"]+)"/g)].map((m) => m[1]);
    const labeled = [];
    const unlabeled = [];
    for (const line of lines.slice(1)) {
      const m = line.match(/^(Plate - [^:]+):\s*(.+)$/);
      if (m) labeled.push({ name: m[1].trim(), prompt: m[2].trim() });
      else if (/^Vertical 9:16 aspect ratio/.test(line)) unlabeled.push(line.trim());
    }
    for (const p of labeled) plates.push({ ...p, labeled: true });
    if (unlabeled.length) {
      const remaining = listed.filter((n) => !labeled.some((p) => p.name === n));
      if (remaining.length === unlabeled.length) {
        unlabeled.forEach((prompt, i) => plates.push({ name: remaining[i], prompt, labeled: false }));
        plateProblems.push(
          `${unlabeled.length} plate prompt line(s) carry no "Plate - <Location>:" label; matched to the first sentence's names by order. Confirm the match, and label the lines with the storyboard skill (step 6a).`
        );
      } else {
        unlabeled.forEach((prompt, i) => plates.push({ name: `UNNAMED PLATE ${i + 1}`, prompt, labeled: false }));
        plateProblems.push(
          `${unlabeled.length} plate prompt line(s) carry no label and cannot be matched to the names in the first sentence (${listed.length} listed). Label them with the storyboard skill before generating.`
        );
      }
    }
    const missingPrompt = listed.filter((n) => !plates.some((p) => p.name === n));
    if (missingPrompt.length) plateProblems.push(`Named in the first sentence but with no prompt line: ${missingPrompt.join(", ")}.`);
  }
}
for (const p of plates) {
  p.file = kebab(p.name);
  p.image = findImage(PLATE_IMAGES, p.file);
  p.target = path.join(PLATE_IMAGES, p.file + ".png");
  p.status = p.image ? "exists" : "missing";
}

// ---------- Cast, from every Agent prompt's Cast line ----------
const cast = new Map();
const headingRe = /^## (Video \d+ - .+)$/gm;
const headings = [...md.matchAll(headingRe)].map((m) => ({ at: m.index, title: m[1] }));
for (const b of textBlocks(md)) {
  const before = md.slice(Math.max(0, b.start - 40), b.start);
  if (!/Agent prompt:\s*$/.test(before)) continue;
  const video = [...headings].reverse().find((h) => h.at < b.start)?.title.match(/^Video (\d+)/)?.[1] ?? "?";
  const castLine = b.text.split("\n").find((l) => l.startsWith("Cast:"));
  if (!castLine) continue;
  for (const m of castLine.matchAll(/(each )?@([A-Z][\w'’-]*(?: [A-Z][\w'’-]*)*)/g)) {
    const name = m[2];
    const entry = cast.get(name) ?? { name, videos: new Set(), group: false };
    entry.videos.add(video);
    if (m[1]) entry.group = true;
    cast.set(name, entry);
  }
}

const existingFiles = fs.existsSync(CHAR_PROMPTS)
  ? fs.readdirSync(CHAR_PROMPTS).filter((f) => f.endsWith("-flow-character.md"))
  : [];
const existingNames = existingFiles.map((f) => {
  const head = fs.readFileSync(path.join(CHAR_PROMPTS, f), "utf8").match(/^# (.+?) Flow Character/m);
  return { file: f, name: head ? head[1] : f.replace(/-flow-character\.md$/, "") };
});

const yetis = [];
const storyCast = [];
for (const c of cast.values()) {
  const videos = [...c.videos].sort((a, b) => a - b);
  const k = kebab(c.name);
  if (YETIS.includes(c.name)) {
    const base = k; // papa-yeti, mama-yeti, babu-yeti
    yetis.push({
      name: c.name,
      videos,
      portrait: findImage(CHAR_IMAGES, base),
      front: findImage(CHAR_IMAGES, base + "-front"),
      turnaround: findImage(CHAR_IMAGES, base + "-turnaround"),
    });
    continue;
  }
  const promptFile = path.join(CHAR_PROMPTS, `${k}-flow-character.md`);
  const hasFile = fs.existsSync(promptFile);
  const front = findImage(CHAR_IMAGES, `${k}-front`);
  const turnaround = findImage(CHAR_IMAGES, `${k}-turnaround`);
  const similar = hasFile
    ? []
    : existingNames
        .filter((e) => {
          const a = norm(e.name), b = norm(c.name);
          const lastA = e.name.split(" ").pop().toLowerCase();
          const lastB = c.name.split(" ").pop().toLowerCase();
          return a === b || levenshtein(a, b) <= 2 || lastA === lastB;
        })
        .map((e) => `${e.name} (prompts/characters/${e.file})`);
  let status;
  if (!hasFile) status = "new: no Character file; run flow-character-builder first";
  else if (front && turnaround) status = "complete";
  else if (front) status = "turnaround missing";
  else if (turnaround) status = "front missing (regenerate both: the turnaround is made from the front)";
  else status = "images missing";
  storyCast.push({
    name: c.name,
    group: c.group,
    videos,
    promptFile: hasFile ? promptFile : null,
    front,
    turnaround,
    frontTarget: path.join(CHAR_IMAGES, `${k}-front.png`),
    turnaroundTarget: path.join(CHAR_IMAGES, `${k}-turnaround.png`),
    similar,
    status,
  });
}

// ---------- Emit prompt files ----------
function characterPrompts(file) {
  const text = fs.readFileSync(file, "utf8");
  const grab = (heading) => {
    const at = text.search(new RegExp(`^## ${heading}`, "m"));
    if (at < 0) return null;
    return textBlocks(text.slice(at))[0]?.text ?? null;
  };
  return { front: grab("Portrait"), turnaround: grab("Body") };
}

const emitted = [];
if (emitDir) {
  fs.mkdirSync(emitDir, { recursive: true });
  for (const p of plates) {
    if (p.status !== "missing" || p.name.startsWith("UNNAMED")) continue;
    const out = path.join(emitDir, `${p.file}.txt`);
    fs.writeFileSync(out, `Create image: ${p.prompt}\n`);
    emitted.push(out);
  }
  for (const c of storyCast) {
    if (!c.promptFile || c.status === "complete") continue;
    const pr = characterPrompts(c.promptFile);
    const k = kebab(c.name);
    if (pr.front && !c.front) {
      const out = path.join(emitDir, `${k}-front.txt`);
      fs.writeFileSync(out, pr.front + "\n");
      emitted.push(out);
    }
    if (pr.turnaround && !c.turnaround) {
      const out = path.join(emitDir, `${k}-turnaround.txt`);
      fs.writeFileSync(out, pr.turnaround + "\n");
      emitted.push(out);
    }
    if (!pr.front || !pr.turnaround) c.status += "; Portrait or Body prompt block not found in the Character file";
  }
}

// ---------- Report ----------
const result = {
  storyboard: rel(path.resolve(storyboard)),
  plateDir: rel(PLATE_IMAGES),
  plates: plates.map((p) => ({ name: p.name, labeled: p.labeled, status: p.status, image: p.image && rel(p.image), target: rel(p.target) })),
  plateProblems,
  yetis: yetis.map((y) => ({ ...y, portrait: y.portrait && rel(y.portrait), front: y.front && rel(y.front), turnaround: y.turnaround && rel(y.turnaround) })),
  storyCast: storyCast.map((c) => ({
    ...c,
    promptFile: c.promptFile && rel(c.promptFile),
    front: c.front && rel(c.front),
    turnaround: c.turnaround && rel(c.turnaround),
    frontTarget: rel(c.frontTarget),
    turnaroundTarget: rel(c.turnaroundTarget),
  })),
  emitted: emitted.map(rel),
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const yn = (v) => (v ? `\`${v}\`` : "missing");
  const out = [];
  out.push(`# Flow assets for ${result.storyboard}`, "");
  out.push("## Plates", "", "| Plate | Prompt line labeled | Image |", "| --- | --- | --- |");
  for (const p of result.plates) out.push(`| ${p.name} | ${p.labeled ? "yes" : "no"} | ${p.image ? `\`${p.image}\`` : `missing (save to \`${p.target}\`)`} |`);
  for (const pr of plateProblems) out.push("", `Problem: ${pr}`);
  out.push("", "## Yetis (never generated by this skill)", "", "| Yeti | Videos | Portrait | Front | Turnaround |", "| --- | --- | --- | --- | --- |");
  for (const y of result.yetis) out.push(`| ${y.name} | ${y.videos.join(", ")} | ${yn(y.portrait)} | ${yn(y.front)} | ${yn(y.turnaround)} |`);
  out.push("", "## Story cast", "", "| Character | Group | Videos | Character file | Front | Turnaround | Status |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const c of result.storyCast)
    out.push(`| ${c.name} | ${c.group ? "yes" : "no"} | ${c.videos.join(", ")} | ${yn(c.promptFile)} | ${yn(c.front)} | ${yn(c.turnaround)} | ${c.status} |`);
  for (const c of result.storyCast)
    if (c.similar.length) out.push("", `Check: ${c.name} has no file, but similar existing Characters exist: ${c.similar.join("; ")}. Ask whether it is the same character before building a new one.`);
  if (emitted.length) out.push("", "## Prompt files written", "", ...result.emitted.map((e) => `- \`${e}\``));
  console.log(out.join("\n"));
}
