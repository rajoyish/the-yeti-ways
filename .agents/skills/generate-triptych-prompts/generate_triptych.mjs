#!/usr/bin/env node
/**
 * generate_triptych.mjs
 * 
 * Reads a storyboard markdown file containing individual panel prompts (e.g. prompts/*-3x2.md)
 * and combines them into formatted 3-panel (1x3 triptych) grid prompts.
 * 
 * Usage:
 *   node .agents/skills/generate-triptych-prompts/generate_triptych.mjs [file] [options]
 * 
 * Options:
 *   --save             Save output to prompts/<slug>-triptych.md
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

function findLatestStoryboardFile() {
  if (!fs.existsSync(PROMPTS_DIR)) {
    throw new Error(`Prompts directory not found at: ${PROMPTS_DIR}`);
  }
  const files = fs.readdirSync(PROMPTS_DIR)
    .filter(f => f.endsWith("-3x2.md"))
    .map(f => {
      const fullPath = path.join(PROMPTS_DIR, f);
      const stat = fs.statSync(fullPath);
      return { path: fullPath, file: f, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error(`No *-3x2.md storyboard files found in ${PROMPTS_DIR}`);
  }
  return files[0].path;
}

export function extractPanelsAndGenerateTriptychs(filePath, options = {}) {
  const content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

  // Locate videos: '## Video N - <Title>' or '## Video N'
  const videoRegex = /^## Video\s+(\d+)(?:[^\n]*)/gm;
  const videoMatches = [...content.matchAll(videoRegex)];

  if (videoMatches.length === 0) {
    throw new Error(`No "## Video <N>" sections found in ${filePath}`);
  }

  const results = [];

  for (let i = 0; i < videoMatches.length; i++) {
    const vMatch = videoMatches[i];
    const vNum = parseInt(vMatch[1], 10);
    const vHeading = vMatch[0].replace(/^##\s*/, "").trim();

    if (options.video && options.video !== vNum) {
      continue;
    }

    const startIndex = vMatch.index;
    const endIndex = i + 1 < videoMatches.length ? videoMatches[i + 1].index : content.length;
    const videoContent = content.slice(startIndex, endIndex);

    // Locate panels inside this video: '### Panel (\d+)'
    const panelRegex = /^### Panel\s+(\d+)[^\n]*/gm;
    const panelMatches = [...videoContent.matchAll(panelRegex)];

    const panels = {};

    for (let p = 0; p < panelMatches.length; p++) {
      const pMatch = panelMatches[p];
      const pNum = parseInt(pMatch[1], 10);
      const pStart = pMatch.index;
      const pEnd = p + 1 < panelMatches.length ? panelMatches[p + 1].index : videoContent.length;
      const pSection = videoContent.slice(pStart, pEnd);

      const ciIndex = pSection.indexOf("Create image:");
      if (ciIndex === -1) {
        console.warn(`[Warning] Video ${vNum} Panel ${pNum} does not contain "Create image:" text.`);
        continue;
      }

      let promptText = pSection.slice(ciIndex);

      // Handle closing code fence if present
      const fenceIndex = promptText.indexOf("```");
      if (fenceIndex !== -1) {
        promptText = promptText.slice(0, fenceIndex);
      }

      // Trim leading/trailing blank lines/spaces
      promptText = promptText.trim();
      panels[pNum] = promptText;
    }

    // Grid 1: Panels 1, 2, 3
    if (!options.grid || options.grid === 1) {
      const p1 = panels[1] || "";
      const p2 = panels[2] || "";
      const p3 = panels[3] || "";

      if (p1 && p2 && p3) {
        const grid1Prompt = [
          "Create image: Horizontal 16:9 aspect ratio. A 3-panel storyboard grid (1x3 triptych layout) separated by thick black borders, depicting sequential 3D animated cinematic action scenes:",
          "",
          `Panel 1 (Left): ${p1}`,
          "",
          `Panel 2 (Center): ${p2}`,
          "",
          `Panel 3 (Right): ${p3}`,
        ].join("\n");

        results.push({
          videoNumber: vNum,
          videoHeading: vHeading,
          gridNumber: 1,
          panels: [1, 2, 3],
          prompt: grid1Prompt
        });
      } else {
        console.warn(`[Warning] Video ${vNum} Grid 1 is missing one or more panels (found: 1=${!!p1}, 2=${!!p2}, 3=${!!p3})`);
      }
    }

    // Grid 2: Panels 4, 5, 6
    if (!options.grid || options.grid === 2) {
      const p4 = panels[4] || "";
      const p5 = panels[5] || "";
      const p6 = panels[6] || "";

      if (p4 && p5 && p6) {
        const grid2Prompt = [
          "Create image: Horizontal 16:9 aspect ratio. A 3-panel storyboard grid (1x3 triptych layout) separated by thick black borders, depicting sequential 3D animated cinematic action scenes:",
          "",
          `Panel 1 (Left): ${p4}`,
          "",
          `Panel 2 (Center): ${p5}`,
          "",
          `Panel 3 (Right): ${p6}`,
        ].join("\n");

        results.push({
          videoNumber: vNum,
          videoHeading: vHeading,
          gridNumber: 2,
          panels: [4, 5, 6],
          prompt: grid2Prompt
        });
      } else {
        console.warn(`[Warning] Video ${vNum} Grid 2 is missing one or more panels (found: 4=${!!p4}, 5=${!!p5}, 6=${!!p6})`);
      }
    }
  }

  return results;
}

export function formatMarkdownDocument(filePath, results) {
  const baseName = path.basename(filePath);
  const title = baseName.replace(/-3x2\.md$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const doc = [
    `# ${title} - Triptych Grid Prompts (1x3)`,
    "",
    `Generated from \`${filePath}\`.`,
    "Each 10-second video is split into two 3-panel (1x3 triptych) grids in horizontal 16:9 layout.",
    "",
  ];

  let currentVideo = null;
  for (const item of results) {
    if (currentVideo !== item.videoNumber) {
      currentVideo = item.videoNumber;
      doc.push(`## Video ${item.videoNumber}`);
      doc.push("");
    }

    doc.push(`### Video ${item.videoNumber} - Grid ${item.gridNumber}`);
    doc.push(`*Panels ${item.panels.join(", ")}*`);
    doc.push("");
    doc.push("```text");
    doc.push(item.prompt);
    doc.push("```");
    doc.push("");
  }

  return doc.join("\n");
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
  [file]            Path to storyboard file (e.g. prompts/yeti-forest-wind-strike-30s-3x2.md)
                    If omitted, the latest *-3x2.md file in prompts/ is used.

Options:
  --save            Save output markdown to prompts/<slug>-triptych.md
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
      // Try resolving relative to REPO or CWD
      const resolved = path.resolve(process.cwd(), targetFile);
      if (fs.existsSync(resolved)) {
        targetFile = resolved;
      } else {
        throw new Error(`File not found: ${targetFile}`);
      }
    }

    const results = extractPanelsAndGenerateTriptychs(targetFile, {
      video: videoNum,
      grid: gridNum,
    });

    if (results.length === 0) {
      console.log("No triptych prompts generated.");
      process.exit(0);
    }

    const mdOutput = formatMarkdownDocument(targetFile, results);

    if (save || outFile) {
      const destination = outFile || targetFile.replace(/-3x2\.md$/, "-triptych.md");
      fs.writeFileSync(destination, mdOutput, "utf8");
      console.log(`Successfully generated ${results.length} triptych grid prompts and saved to:\n  ${destination}`);
    } else {
      console.log(mdOutput);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
