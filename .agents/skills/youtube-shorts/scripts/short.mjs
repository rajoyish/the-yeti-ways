// YouTube Short builder for a finished Yeti film (9:16, 30 or 60 seconds).
//
//   node short.mjs check  <run>/short.json              validate the config (no media written)
//   node short.mjs blocks <run>/short.json              write speech-prompts/<slug>-speech-blocks.md (AI Studio Voice Runner)
//   node short.mjs music  <run>/short.json              write music-prompts/<slug>-flow-music.md (Flow Music Score Runner)
//   node short.mjs build  <run>/short.json [--render]   word timings -> 9:16 shots -> plan.json [-> Remotion render + mix]
//
// Options: --vo <wav> overrides config.vo; --temp-vo makes a macOS `say` placeholder when the VO is missing.
// Paths in short.json are relative to the file's folder unless absolute. Run from the repository root.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [cmd, cfgArg] = process.argv.slice(2);
const flag = (k) => process.argv.includes(k);
const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
if (!cmd || !cfgArg) { console.error("Usage: short.mjs check|blocks|music|build <run>/short.json [--render] [--vo f.wav] [--temp-vo]"); process.exit(2); }

const CFG_PATH = path.resolve(cfgArg);
const RUN = path.dirname(CFG_PATH);
const cfg = JSON.parse(fs.readFileSync(CFG_PATH, "utf8"));
const rel = (p) => (p ? (path.isAbsolute(p) ? p : path.resolve(RUN, p)) : p);
const REPO = process.cwd();
const FPS = cfg.fps || 30;
const TAIL = cfg.tail ?? 1.2;
const run = (c, a, o = {}) => execFileSync(c, a, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 27, ...o }).toString();
const dur = (f) => Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const toSec = (v) => (typeof v === "number" ? v : String(v).replace(/[[\]]/g, "").split(":").reduce((a, x) => a * 60 + Number(x), 0));
const mmss = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;

// ---- check -----------------------------------------------------------------------
function check() {
  const errs = [], warns = [];
  for (const k of ["slug", "source", "sections", "voice"]) if (!cfg[k]) errs.push(`missing "${k}"`);
  if (cfg.source && !fs.existsSync(rel(cfg.source))) errs.push(`source video not found: ${rel(cfg.source)}`);
  if (cfg.bed?.file && !fs.existsSync(rel(cfg.bed.file))) errs.push(`music bed not found: ${rel(cfg.bed.file)}`);
  const ctas = (cfg.sections || []).filter((s) => s.cta).length;
  if (ctas !== 1) warns.push(`${ctas} sections have "cta": true (expected exactly one, the last)`);
  const srcDur = cfg.source && fs.existsSync(rel(cfg.source)) ? dur(rel(cfg.source)) : Infinity;
  let words = 0;
  (cfg.sections || []).forEach((s, si) => {
    const keys = s.text.split(/\s+/).map(norm);
    words += keys.length;
    if (!s.headline?.length) errs.push(`section ${si + 1}: no headline`);
    if (!s.shots?.length) errs.push(`section ${si + 1}: no shots`);
    (s.shots || []).forEach((sh, i) => {
      const from = toSec(sh.from), to = toSec(sh.to);
      if (!(to > from)) errs.push(`section ${si + 1} shot ${sh.id}: "to" must be after "from"`);
      if (to > srcDur) errs.push(`section ${si + 1} shot ${sh.id}: ends past the film (${srcDur.toFixed(1)} s)`);
      if (i > 0 && !keys.includes(norm(sh.at || ""))) errs.push(`section ${si + 1} shot ${sh.id}: cue word "${sh.at}" is not in the section's text`);
      if (sh.cx !== undefined && (sh.cx < 0 || sh.cx > 1)) errs.push(`shot ${sh.id}: cx must be 0..1`);
    });
  });
  const ids = (cfg.sections || []).flatMap((s) => s.shots.map((x) => x.id));
  if (new Set(ids).size !== ids.length) errs.push("shot ids must be unique");
  const est = words / 3.2; // brisk Shorts narration ≈ 3.2 words/s
  const target = cfg.length || 30;
  if (Math.abs(est + TAIL - target) > target * 0.2) warns.push(`${words} words ≈ ${est.toFixed(0)} s of narration, far from the ${target} s target`);
  warns.forEach((w) => console.log("warn:", w));
  if (errs.length) { errs.forEach((e) => console.error("error:", e)); process.exit(1); }
  console.log(`ok: ${cfg.sections.length} sections, ${ids.length} shots, ${words} words (≈ ${est.toFixed(0)} s spoken, target ${target} s)`);
}

// ---- speech blocks for the AI Studio Voice Runner ---------------------------------------
function blocks() {
  const v = cfg.voice;
  const out = path.join(REPO, "speech-prompts", `${cfg.slug}-speech-blocks.md`);
  const md = [
    `# ${cfg.title || cfg.slug} - Speech blocks`,
    "",
    `Voiceover for the ${cfg.length || 30}-second 9:16 YouTube Short${cfg.fullVideo ? ` that teases the full film (${cfg.fullVideo})` : ""}. One Narrator, ${cfg.sections.length} blocks, one per beat of the Short. Load this file in the AI Studio Voice Runner extension (\`tools/ai-studio-voice-runner/\`), Story mode. Built from \`short.json\` by the \`youtube-shorts\` skill.`,
    "",
    "## Voices",
    "",
    "| Speaker | Voice | Style | Blocks |",
    "| --- | --- | --- | --- |",
    `| Narrator | ${v.name} | ${v.style} | ${cfg.sections.length} |`,
    "",
    "## Speech blocks",
    "",
    ...cfg.sections.flatMap((s) => [`Speaker 1 - ${v.name}:`, s.text, "---", ""]),
  ].join("\n");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  console.log("wrote", path.relative(REPO, out));
  console.log("single-take text (AI Studio fallback):", cfg.sections.map((s) => s.text).join(" <short pause> "));
}

// ---- one-movement Flow Music guide for the Flow Music Score Runner -------------------------
function music() {
  const m = cfg.music || {};
  const vo = rel(opt("--vo", cfg.vo));
  // the runner fits every stem to the voice track, so the window ends exactly on its last sample
  if (!vo || !fs.existsSync(vo)) throw new Error(`Voice the Short first: ${vo} not found (the guide's window must match it).`);
  const voDur = dur(vo);
  if (voDur > 180) throw new Error("A Short over 3:00 needs more than one movement; split the guide by hand.");
  const mmssExact = (x) => `${String(Math.floor(x / 60)).padStart(2, "0")}:${(x % 60).toFixed(2).padStart(5, "0")}`;
  const endExact = mmssExact(voDur);
  const prompt = m.prompt || "Instrumental only. Suspenseful, playful storybook underscore for a children's animated YouTube Short: plucked strings, soft marimba, light taiko pulse, warm Himalayan flute colour, rising tension toward a cliffhanger ending. No vocals, no choir, no sound effects, no ambience.";
  const out = path.join(REPO, "music-prompts", `${cfg.slug}-flow-music.md`);
  const md = [
    `# ${cfg.title || cfg.slug} - Flow Music cue`,
    "",
    `One instrumental movement under the Short's voiceover, for the Flow Music Score Runner (\`tools/flow-music-score-runner/\`). Drop this guide and the Short's voice track (\`${path.relative(REPO, vo || "vo/story-full.wav")}\`) in the runner and generate the **Music** layer only; it builds \`<film>-music-score.wav\` exactly as long as the voice track. Built from \`short.json\` by the \`youtube-shorts\` skill.`,
    "",
    "## Movements",
    "",
    `### Movement 1: ${m.title || "Short underscore"}`,
    "",
    `- **Film Window:** \`00:00.0 – ${endExact}\` (the whole Short)`,
    `- **Meter & Tempo:** ${m.tempo || "4/4, 112 BPM"}`,
    "",
    "**Sound Box Prompt:**",
    "",
    "```text",
    prompt,
    "```",
    "",
    "## Cue sheet",
    "",
    "Music only: the Short's ambience and effects come from the film's own bed, so every effect column is empty.",
    "",
    "| Video | Film Time | Title / Scene | Ambience | Foley | Sound Effects |",
    "| :---: | :---: | :--- | :--- | :--- | :--- |",
    `| **V01** | \`00:00 - ${endExact}\` | ${cfg.title || cfg.slug} | — | — | — |`,
    "",
  ].join("\n");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  console.log("wrote", path.relative(REPO, out), `(window 00:00 – ${endExact} = the voice track)`);
}

// ---- build ------------------------------------------------------------------------------
function build() {
  check();
  const SRC = rel(cfg.source);
  const PUB = path.join(RUN, "short/public");
  const WORK = path.join(RUN, "work");
  if (!fs.existsSync(path.join(RUN, "short/package.json"))) throw new Error(`No Remotion project in ${RUN}/short: run setup.sh first.`);
  fs.mkdirSync(WORK, { recursive: true });
  let VO = rel(opt("--vo", cfg.vo || "vo/story-full.wav"));
  if (!fs.existsSync(VO)) {
    if (!flag("--temp-vo")) throw new Error(`Voiceover not found: ${VO}. Voice it with the AI Studio Voice Runner, or pass --temp-vo for a placeholder.`);
    if (process.platform !== "darwin") throw new Error("--temp-vo needs macOS `say`.");
    VO = path.join(RUN, "vo/temp-vo.wav");
    const ssml = cfg.sections.map((s) => s.text).join(" [[slnc 350]] ");
    run("say", ["-v", "Daniel", "-r", "205", "-o", path.join(WORK, "temp.aiff"), ssml]);
    run("ffmpeg", ["-v", "error", "-y", "-i", path.join(WORK, "temp.aiff"), "-ar", "48000", "-ac", "2", VO]);
    console.log("temporary macOS voice:", path.relative(RUN, VO));
  }

  // 1. word timings (whisper.cpp) aligned to the script words; the script text is what is shown
  const MODEL = process.env.WHISPER_MODEL || path.join(process.env.HOME || process.env.USERPROFILE, ".cache/whisper-cpp/ggml-medium.en.bin");
  if (!fs.existsSync(MODEL)) throw new Error(`whisper model not found: ${MODEL} (set WHISPER_MODEL)`);
  const wav16 = path.join(WORK, "vo16k.wav");
  run("ffmpeg", ["-v", "error", "-y", "-i", VO, "-ar", "16000", "-ac", "1", wav16]);
  run("whisper-cli", ["-m", MODEL, "-f", wav16, "-ml", "1", "-sow", "-oj", "-of", path.join(WORK, "vo"), "-l", "en"]);
  const wj = JSON.parse(fs.readFileSync(path.join(WORK, "vo.json"), "utf8"));
  const heard = wj.transcription.map((t) => ({ w: norm(t.text), s: t.offsets.from / 1000, e: t.offsets.to / 1000 })).filter((t) => t.w);
  fs.writeFileSync(path.join(WORK, "transcript.txt"), wj.transcription.map((t) => t.text).join("").trim() + "\n");

  const words = [];
  cfg.sections.forEach((sec, si) => sec.text.split(/\s+/).forEach((w) => words.push({ text: w, key: norm(w), sec: si })));
  let h = 0;
  for (const w of words) {
    for (let k = h; k < Math.min(h + 5, heard.length); k++) {
      if (heard[k].w === w.key || heard[k].w.startsWith(w.key) || w.key.startsWith(heard[k].w)) { w.s = heard[k].s; w.e = heard[k].e; h = k + 1; break; }
    }
  }
  let unmatched = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].s !== undefined) continue;
    unmatched++;
    const prev = words.slice(0, i).reverse().find((x) => x.s !== undefined);
    const next = words.slice(i + 1).find((x) => x.s !== undefined);
    words[i].s = prev ? prev.e : 0;
    words[i].e = Math.max(next ? next.s : words[i].s + 0.3, words[i].s + 0.15);
  }
  const voDur = dur(VO);
  const lastWordEnd = Math.max(...words.map((w) => w.e));
  const total = Math.min(voDur, lastWordEnd + 0.3) + TAIL;
  const secStart = cfg.sections.map((_, si) => (si === 0 ? 0 : words.find((w) => w.sec === si).s - 0.12));
  const secEnd = cfg.sections.map((_, si) => (si < cfg.sections.length - 1 ? secStart[si + 1] : total));

  // 2. shots: each starts on its cue word, is cropped to 9:16 around cx, and fills until the next cut
  const shotDir = path.join(PUB, "shots");
  fs.rmSync(shotDir, { recursive: true, force: true });
  fs.mkdirSync(shotDir, { recursive: true });
  const [sw, shh] = run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", SRC]).trim().split(",").map(Number);
  const cropW = Math.round((shh * 9) / 16 / 2) * 2;
  const shots = [];
  cfg.sections.forEach((sec, si) => {
    const sw2 = words.filter((w) => w.sec === si);
    const starts = sec.shots.map((s, i) => (i === 0 ? secStart[si] : sw2.find((x) => x.key === norm(s.at)).s - 0.1));
    sec.shots.forEach((s, i) => {
      const a = Math.round(starts[i] * FPS);
      const b = Math.round((i < sec.shots.length - 1 ? starts[i + 1] : secEnd[si]) * FPS);
      shots.push({ ...s, from: toSec(s.from), to: toSec(s.to), sec: si, startFrame: a, frames: b - a });
    });
  });
  const notes = [];
  for (const s of shots) {
    if (s.frames <= 0) throw new Error(`shot ${s.id} has no time: its cue word comes before the previous shot's`);
    const hold = s.hold || 0;
    const need = s.frames / FPS - hold;
    const have = Math.min(s.to - s.from, hold ? Math.max(need, 0.1) : Infinity);
    const x = Math.round(Math.min(sw - cropW, Math.max(0, (s.cx ?? 0.5) * sw - cropW / 2)));
    const speed = need > have ? Math.max(have / need, 0.85) : 1; // slow up to 15 %, then hold the last frame
    const frozen = Math.max(0, need - have / speed);
    if (speed < 1) notes.push(`${s.id} slowed to ${speed.toFixed(2)}x`);
    if (frozen > 0.05) notes.push(`${s.id} holds its last frame ${frozen.toFixed(2)} s (pick a longer shot or an earlier cue)`);
    const vf = [`crop=${cropW}:${shh}:${x}:0`, "scale=1080:1920:flags=lanczos", `setpts=PTS/${speed}`, `fps=${FPS}`,
      `tpad=stop_mode=clone:stop_duration=${(frozen + hold + 0.2).toFixed(3)}`].join(",");
    run("ffmpeg", ["-v", "error", "-y", "-ss", String(s.from), "-i", SRC, "-t", String(have), "-an", "-vf", vf,
      "-frames:v", String(s.frames), "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", path.join(shotDir, `${s.id}.mp4`)]);
  }

  // 3. plan for Remotion
  const plan = {
    fps: FPS,
    durationInFrames: Math.round(total * FPS),
    sections: cfg.sections.map((s, i) => ({ headline: s.headline, cta: !!s.cta, startFrame: Math.round(secStart[i] * FPS), endFrame: Math.round(secEnd[i] * FPS) })),
    shots: shots.map((s) => ({ id: s.id, file: `shots/${s.id}.mp4`, startFrame: s.startFrame, frames: s.frames, sec: s.sec, holdFrames: Math.round((s.hold || 0) * FPS) })),
    words: words.map((w) => ({ text: w.text, sec: w.sec, s: +w.s.toFixed(3), e: +w.e.toFixed(3) })),
  };
  fs.writeFileSync(path.join(PUB, "plan.json"), JSON.stringify(plan, null, 1));
  console.log(`VO ${voDur.toFixed(2)} s -> Short ${total.toFixed(2)} s; ${words.length} words, ${unmatched} not heard (see work/transcript.txt)`);
  console.log("sections:", secStart.map((s, i) => `${s.toFixed(2)}-${secEnd[i].toFixed(2)}`).join("  "));
  console.log("shots:", shots.map((s) => `${s.id} ${(s.frames / FPS).toFixed(2)}s`).join(", "));
  notes.forEach((n) => console.log("note:", n));
  const target = cfg.length || 30;
  if (total > target + 5) console.log(`warn: ${total.toFixed(1)} s is well over the ${target} s target; tighten the script`);

  // 4. render (Remotion) + mix (ffmpeg): VO full level, film bed ducked under it, -14 LUFS
  if (!flag("--render")) return;
  fs.mkdirSync(path.join(RUN, "output"), { recursive: true });
  const silent = path.join(WORK, "video.mp4");
  execFileSync("npx", ["remotion", "render", "Short", silent, "--codec=h264", "--crf=16", "--muted"], { cwd: path.join(RUN, "short"), stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
  const final = path.join(RUN, "output", `${cfg.slug}-9x16.mp4`);
  const inputs = ["-i", silent, "-i", VO];
  let fc;
  const mixTail = `alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
  if (cfg.bed?.file) {
    inputs.push("-ss", String(toSec(cfg.bed.start || 0)), "-i", rel(cfg.bed.file));
    fc = [
      `[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${total},asplit=2[vo][sc]`,
      `[2:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${total},asetpts=PTS-STARTPTS,volume=${cfg.bed.gainDb ?? -15}dB,afade=t=in:d=0.4,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[bed]`,
      `[bed][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck]`,
      `[vo][duck]amix=inputs=2:normalize=0:duration=first,${mixTail}`,
    ].join(";");
  } else {
    fc = `[1:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${total},${mixTail}`;
  }
  run("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy",
    "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-t", String(total), "-movflags", "+faststart", final]);
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", final, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
  const I = (r.stderr.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop();
  const P = (r.stderr.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop();
  console.log("wrote", final);
  console.log("loudness:", I, "|", P);
}

const COMMANDS = { check, blocks, music, build };
if (!COMMANDS[cmd]) { console.error(`unknown command "${cmd}"`); process.exit(2); }
COMMANDS[cmd]();
