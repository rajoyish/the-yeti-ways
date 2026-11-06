#!/usr/bin/env node
/**
 * generate_triptych.mjs
 *
 * Reads a panel image file (prompts/<slug>-<30s or 60s>-3x2.md) and combines each video's six
 * panel image prompts into two 3-panel (1x3 triptych) grid prompts: Grid 1 holds panels 1-3 and
 * Grid 2 holds panels 4-6. Every panel prompt is copied verbatim, and the output is checked
 * against the source before it is written.
 *
 * Usage:
 *   node .agents/skills/generate-triptych-prompts/generate_triptych.mjs [file] [options]
 *
 * Options:
 *   --save             Save output to prompts/<slug>-<30s or 60s>-triptych.md
 *   --out <path>       Specify custom output file path
 *   --video <number>   Generate prompts only for a specific video number
 *   --grid <1|2>       Generate prompts only for a specific grid (1 or 2)
 *   --help             Show help message
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..", "..");
const PROMPTS_DIR = path.join(REPO, "prompts");

const GRIDS = [
  { number: 1, panels: [1, 2, 3] },
  { number: 2, panels: [4, 5, 6] },
];
const POSITIONS = ["Left", "Center", "Right"];
const STACKED = ["Top", "Middle", "Bottom"];
const YETIS = ["Papa Yeti", "Mama Yeti", "Babu Yeti"];

// Character names: the three Yetis plus every story cast Character in prompts/characters/,
// read from the backticked name under each file's '## Character name' heading.
export function characterNames() {
  const names = new Set(YETIS);
  const dir = path.join(PROMPTS_DIR, "characters");
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".md"))) {
      const m = fs.readFileSync(path.join(dir, f), "utf8").match(/^## Character name\s*\n+\s*`([^`@]+)`/m);
      if (m) names.add(m[1].trim());
    }
  }
  // Longest first, so a name that contains another is matched whole.
  return [...names].sort((a, b) => b.length - a.length);
}

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Prefixes the first mention of each character in one panel with '@', so Flow links the saved
// Character (the lock label 'Papa Yeti:' becomes '@Papa Yeti:', and a story cast sentence's
// 'Terrace Farmer,' becomes '@Terrace Farmer,'). Later mentions keep the plain name.
export function prefixCharacters(text, names) {
  let out = text;
  for (const name of names) {
    const re = new RegExp(`(^|[^@\\w])(${escapeRe(name)})(?![\\w])`);
    out = out.replace(re, (_, pre, n) => `${pre}@${n}`);
  }
  return out;
}

function findLatestStoryboardFile() {
  if (!fs.existsSync(PROMPTS_DIR)) {
    throw new Error(`Prompts directory not found at: ${PROMPTS_DIR}`);
  }
  const files = fs.readdirSync(PROMPTS_DIR)
    .filter(f => f.endsWith("-3x2.md"))
    .map(f => {
      const fullPath = path.join(PROMPTS_DIR, f);
      return { path: fullPath, mtime: fs.statSync(fullPath).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error(`No *-3x2.md storyboard files found in ${PROMPTS_DIR}`);
  }
  return files[0].path;
}

// The canvas takes the shape that the three panels fill. Three vertical 9:16 panels side by side
// make a horizontal 16:9 grid read left to right; three horizontal 16:9 panels stacked one above
// another make a vertical 9:16 grid (3x1) read top to bottom.
export function isWidescreen(panelTexts) {
  return panelTexts.every(t => /Horizontal 16:9/.test(t));
}
function gridHeader(panelTexts) {
  if (isWidescreen(panelTexts)) {
    return "Create image: Vertical 9:16 aspect ratio. A 3-panel storyboard grid (3x1 triptych layout) of three wide horizontal 16:9 panels of equal height stacked one above another, each filling the full width of the frame from edge to edge, separated by two thin white horizontal dividers, with no outer border, read top to bottom as one continuous sequence of 3D animated cinematic scenes. Each panel follows its own description below, keeps the same characters, environment, and light from panel to panel, and holds no text, numbers, captions, or watermark:";
  }
  return "Create image: Horizontal 16:9 aspect ratio. A 3-panel storyboard grid (1x3 triptych layout) of three tall vertical 9:16 panels standing side by side and filling the frame from edge to edge, separated by thick black borders, read left to right as one continuous sequence of 3D animated cinematic scenes. Each panel follows its own description below, keeps the same characters, environment, and light from panel to panel, and holds no text, numbers, captions, or watermark:";
}

export function extractPanelsAndGenerateTriptychs(filePath, options = {}) {
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  // Video headings carry their titles: '## Video N - <Title>'
  const videoMatches = [...content.matchAll(/^## (Video\s+(\d+)[^\n]*)$/gm)];
  if (videoMatches.length === 0) {
    throw new Error(`No "## Video <N> - <Title>" sections found in ${filePath}`);
  }

  const results = [];
  const problems = [];
  const names = characterNames();

  for (let i = 0; i < videoMatches.length; i++) {
    const vMatch = videoMatches[i];
    const vNum = parseInt(vMatch[2], 10);
    const vHeading = vMatch[1].trim();
    if (options.video && options.video !== vNum) continue;

    const end = i + 1 < videoMatches.length ? videoMatches[i + 1].index : content.length;
    const videoContent = content.slice(vMatch.index, end);

    // '### Panel P · <timecode> · <Framing>, <Angle> · <TITLE>'
    const panelMatches = [...videoContent.matchAll(/^### Panel\s+(\d+)([^\n]*)$/gm)];
    const panels = {};

    for (let p = 0; p < panelMatches.length; p++) {
      const pMatch = panelMatches[p];
      const pNum = parseInt(pMatch[1], 10);
      const pEnd = p + 1 < panelMatches.length ? panelMatches[p + 1].index : videoContent.length;
      const pSection = videoContent.slice(pMatch.index, pEnd);

      const ciIndex = pSection.indexOf("Create image:");
      if (ciIndex === -1) {
        problems.push(`${vHeading}, Panel ${pNum}: no "Create image:" prompt`);
        continue;
      }
      let text = pSection.slice(ciIndex);
      const fenceIndex = text.indexOf("```");
      if (fenceIndex !== -1) text = text.slice(0, fenceIndex);

      const meta = pMatch[2].split("·").map(s => s.trim()).filter(Boolean);
      if (panels[pNum]) problems.push(`${vHeading}: Panel ${pNum} appears twice`);
      panels[pNum] = {
        text: text.trim(),
        timecode: meta[0] || "",
        title: meta.length > 1 ? meta[meta.length - 1] : "",
      };
    }

    const found = Object.keys(panels).map(Number).sort((a, b) => a - b);
    if (found.join(",") !== "1,2,3,4,5,6") {
      problems.push(`${vHeading}: expected Panels 1-6, found ${found.join(", ") || "none"}`);
      continue;
    }

    for (const grid of GRIDS) {
      if (options.grid && options.grid !== grid.number) continue;
      const parts = grid.panels.map(n => panels[n]);
      const wide = isWidescreen(parts.map(p => p.text));
      const places = wide ? STACKED : POSITIONS;
      const prompt = [
        gridHeader(parts.map(p => p.text)),
        ...parts.flatMap((p, k) => ["", `Panel ${k + 1} (${places[k]}): ${prefixCharacters(p.text, names)}`]),
      ].join("\n");

      const first = parts[0].timecode.split("–")[0];
      const last = parts[2].timecode.split("–").pop();
      results.push({
        videoNumber: vNum,
        videoHeading: vHeading,
        gridNumber: grid.number,
        panels: grid.panels,
        timecode: first && last ? `${first}–${last}` : "",
        titles: parts.map(p => p.title).filter(Boolean),
        sources: parts.map(p => p.text),
        linked: parts.map(p => prefixCharacters(p.text, names)),
        prompt,
        wide,
      });
    }
  }

  if (problems.length) {
    throw new Error(`The panel file has problems, so no triptychs were written:\n  - ${problems.join("\n  - ")}`);
  }
  return results;
}

function docTitle(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const h1 = content.match(/^# (.+?)(?: Panel Images and 3x2 Grids)?\s*$/m);
  if (h1) return h1[1].trim();
  return path.basename(filePath).replace(/-3x2\.md$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function formatMarkdownDocument(filePath, results) {
  const source = path.relative(REPO, path.resolve(filePath));
  const doc = [
    `# ${docTitle(filePath)} Triptych Grid Prompts (${results.length && results.every(r => r.wide) ? "3x1" : "1x3"})`,
    "",
    `Generated from \`${source}\` by \`.agents/skills/generate-triptych-prompts/generate_triptych.mjs\`. Do not edit this file by hand: change the panel prompts in the 3x2 file and run the script again.`,
    "",
    (results.length && results.every(r => r.wide)
      ? "Each 10-second video is split into two vertical 9:16 triptych grids, each three horizontal 16:9 panels stacked and read top to bottom: Grid 1 holds panels 1 to 3 and Grid 2 holds panels 4 to 6."
      : "Each 10-second video is split into two horizontal 16:9 triptych grids, each three vertical 9:16 panels side by side and read left to right: Grid 1 holds panels 1 to 3 and Grid 2 holds panels 4 to 6.") + " Every panel description is copied verbatim from the 3x2 file, character locks included, except that the first mention of each character in a panel is written with \`@\` (\`@Papa Yeti\`, \`@Terrace Farmer\`) so Flow links its saved Character; type \`@\` in the prompt box (or run Flow Character Linker) to confirm each name resolves. Generate each grid with the family reference image attached, and check every panel against its panel prompt and the look check in section 7 of `.agents/rules/prompt-assembly.md`, because an image model drawing three panels at once can drift between them.",
    "",
  ];

  let currentVideo = null;
  for (const item of results) {
    if (currentVideo !== item.videoNumber) {
      currentVideo = item.videoNumber;
      doc.push("---", "", `## ${item.videoHeading}`, "");
    }
    doc.push(`### Grid ${item.gridNumber} · Panels ${item.panels.join(", ")}${item.timecode ? ` · ${item.timecode}` : ""}`, "");
    if (item.titles.length) doc.push(`Panels: ${item.titles.join(" / ")}.`, "");
    doc.push("```text", item.prompt, "```", "");
  }
  return doc.join("\n");
}

// Every source panel must appear in the output exactly as it is in the 3x2 file, apart from the
// '@' added before each character's first mention.
function verify(mdOutput, results) {
  const missing = results.flatMap(r => r.sources
    .filter((s, k) => !mdOutput.includes(r.linked[k]) || r.linked[k].replace(/@/g, "") !== s.replace(/@/g, ""))
    .map(() => `${r.videoHeading} Grid ${r.gridNumber}`));
  if (missing.length) throw new Error(`Panel text was altered in: ${[...new Set(missing)].join(", ")}`);
}

// CLI Execution
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let targetFile = null;
  let save = false;
  let outFile = null;
  let videoNum = null;
  let gridNum = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: node .agents/skills/generate-triptych-prompts/generate_triptych.mjs [file] [options]

Arguments:
  [file]            Path to the panel image file (e.g. prompts/yeti-forest-wind-strike-30s-3x2.md)
                    If omitted, the latest *-3x2.md file in prompts/ is used.

Options:
  --save            Save output to prompts/<slug>-<30s or 60s>-triptych.md
  --out <path>      Specify custom output file path
  --video <N>       Generate for Video N only
  --grid <1|2>      Generate for Grid 1 or 2 only
  --help            Show this help message
`);
      process.exit(0);
    } else if (arg === "--save") {
      save = true;
    } else if (arg === "--out" && i + 1 < args.length) {
      outFile = args[++i];
    } else if (arg === "--video" && i + 1 < args.length) {
      videoNum = parseInt(args[++i], 10);
    } else if (arg === "--grid" && i + 1 < args.length) {
      gridNum = parseInt(args[++i], 10);
    } else if (!arg.startsWith("--") && !targetFile) {
      targetFile = arg;
    }
  }

  try {
    if (!targetFile) {
      console.log("No file provided. Locating latest storyboard file in prompts/...");
      targetFile = findLatestStoryboardFile();
      console.log(`Using latest file: ${targetFile}\n`);
    }
    if (!fs.existsSync(targetFile)) {
      const resolved = path.resolve(REPO, targetFile);
      if (!fs.existsSync(resolved)) throw new Error(`File not found: ${targetFile}`);
      targetFile = resolved;
    }
    if (gridNum && gridNum !== 1 && gridNum !== 2) throw new Error("--grid must be 1 or 2");

    const results = extractPanelsAndGenerateTriptychs(targetFile, { video: videoNum, grid: gridNum });
    if (results.length === 0) {
      console.log("No triptych prompts generated.");
      process.exit(0);
    }

    const mdOutput = formatMarkdownDocument(targetFile, results);
    verify(mdOutput, results);

    if (save || outFile) {
      const destination = outFile || targetFile.replace(/-3x2\.md$/, "-triptych.md");
      fs.writeFileSync(destination, mdOutput, "utf8");
      console.log(`Successfully generated ${results.length} triptych grid prompts and saved to:\n  ${destination}`);
      for (const r of results) console.log(`  ${r.videoHeading} · Grid ${r.gridNumber} · Panels ${r.panels.join(", ")}`);
    } else {
      console.log(mdOutput);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
