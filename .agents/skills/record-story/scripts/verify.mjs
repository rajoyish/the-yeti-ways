#!/usr/bin/env node
// record-story step 4: check with whisper.cpp that story-full.wav says every word of the speech blocks.
//
//   node .agents/skills/record-story/scripts/verify.mjs speech-prompts/<slug>-speech-blocks.md
//        [--takes ~/Downloads/speech-takes/<slug>] [--audio file.wav]
//
// Transcribes the recording with whisper-cli and ggml-medium.en (WHISPER_CLI / WHISPER_MODEL override;
// install with setup-whisper.sh), primed with the story's names, aligns the transcript to the blocks
// word by word, and reports each difference under its block:
//   MISSING  two or more story words not heard (a skipped phrase: retake that block)
//   ADDED    three or more heard words not in the story (an invented phrase: retake that block)
//   spelling everything else, usually an invented name spelled another way ("Mili" -> "Millie")
// Writes <takes>/verify/transcript.txt and report.md. Exit 0 = no MISSING or ADDED, 1 = retakes needed.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, "../../../..");
const Story = require(path.join(ROOT, "tools/ai-studio-voice-runner/story.js"));

const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const file = argv.find(a => a.endsWith(".md"));
if (!file) { console.error("Usage: verify.mjs <speech-blocks.md> [--takes dir] [--audio file.wav]"); process.exit(2); }
const home = p => (p && p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);

const doc = Story.parseSpeechBlocks(fs.readFileSync(file, "utf8"), path.basename(file));
const takes = home(opt("--takes")) || path.join(os.homedir(), "Downloads", "speech-takes", doc.slug);
const audio = home(opt("--audio")) || path.join(takes, "story-full.wav");
if (!fs.existsSync(audio)) { console.error(`No recording at ${audio}.`); process.exit(1); }

// ---- whisper.cpp ----
const which = c => spawnSync("sh", ["-c", `command -v ${c}`], { encoding: "utf8" }).stdout.trim();
const cli = process.env.WHISPER_CLI || which("whisper-cli") || (fs.existsSync("/opt/homebrew/bin/whisper-cli") ? "/opt/homebrew/bin/whisper-cli" : "");
const model = process.env.WHISPER_MODEL || path.join(os.homedir(), ".cache/whisper-cpp/ggml-medium.en.bin");
if (!cli || !fs.existsSync(model)) {
  console.error(`whisper.cpp is not ready (${!cli ? "whisper-cli not found" : `no model at ${model}`}). Run: sh .agents/skills/record-story/scripts/setup-whisper.sh`);
  process.exit(3);
}
const out = path.join(takes, "verify");
fs.mkdirSync(out, { recursive: true });
const wav16 = path.join(out, "story-16k.wav");
let r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", audio, "-ar", "16000", "-ac", "1", wav16], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr || "ffmpeg failed"); process.exit(1); }
// Prime whisper with the story's proper names so invented names come back spelled the story's way.
const names = [...new Set(doc.blocks.flatMap(b => b.text.match(/(?<![.!?"]\s)(?<!^)\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/gm) || []))].join(", ").slice(0, 600);
console.log(`Transcribing ${path.basename(audio)} with ${path.basename(model)} ...`);
r = spawnSync(cli, ["-m", model, "-f", wav16, "-otxt", "-of", path.join(out, "transcript"), "-np", "--prompt", names], { encoding: "utf8", maxBuffer: 1 << 26 });
if (r.status !== 0) { console.error(r.stderr || "whisper-cli failed"); process.exit(1); }
fs.rmSync(wav16, { force: true });

// ---- align ----
const norm = s => (s.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9']+/g) || []).map(w => w.replace(/^'+|'+$/g, "")).filter(Boolean);
const ref = [], owner = [];
for (const b of doc.blocks) for (const w of norm(b.text)) { ref.push(w); owner.push(b); }
const hyp = norm(fs.readFileSync(path.join(out, "transcript.txt"), "utf8"));
// LCS word alignment, then runs of non-matching words become ops.
const n = ref.length, m = hyp.length, W = m + 1;
const L = new Uint32Array((n + 1) * W);
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
  L[i * W + j] = ref[i] === hyp[j] ? L[(i + 1) * W + j + 1] + 1 : Math.max(L[(i + 1) * W + j], L[i * W + j + 1]);
const ops = [];
let i = 0, j = 0, a0 = 0, b0 = 0;
const flush = () => { if (i > a0 || j > b0) ops.push({ a: a0, a2: i, b: b0, b2: j }); };
while (i < n || j < m) {
  if (i < n && j < m && ref[i] === hyp[j]) { flush(); i++; j++; a0 = i; b0 = j; }
  else if (j >= m || (i < n && L[(i + 1) * W + j] >= L[i * W + j + 1])) i++;
  else j++;
}
flush();

const rows = [];
let problems = 0;
for (const o of ops) {
  const miss = o.a2 - o.a, add = o.b2 - o.b;
  const kind = miss - add >= 2 ? "MISSING" : add - miss >= 3 ? "ADDED" : "spelling";
  if (kind !== "spelling") problems++;
  const blk = owner[Math.min(o.a, n - 1)];
  rows.push({ kind, block: blk ? `${blk.id} ${blk.speaker}` : "end", story: ref.slice(o.a, o.a2).join(" "), heard: hyp.slice(o.b, o.b2).join(" ") });
}
const report = [
  `# ${doc.title} - recording check`, "",
  `Recording: \`${audio}\`  `, `Model: \`${model}\`  `, `Story words: ${n}. Heard: ${m}. Retakes needed: ${problems}.`, "",
  "| Kind | Block | Story | Heard |", "| --- | --- | --- | --- |",
  ...rows.map(x => `| ${x.kind} | ${x.block} | ${x.story} | ${x.heard} |`), "",
].join("\n");
fs.writeFileSync(path.join(out, "report.md"), report);
console.log(`Story words ${n}, heard ${m}.`);
for (const x of rows) console.log(`  ${x.kind.padEnd(8)} ${x.block.padEnd(24)} "${x.story}" -> "${x.heard}"`);
console.log(problems ? `${problems} block(s) need a retake: plan.mjs --only <ids>, voice them, finish.mjs again.` : "OK: every word of the story is in the recording (the differences above are spellings).");
console.log(`Report: ${path.join(out, "report.md")}`);
process.exit(problems ? 1 : 0);
