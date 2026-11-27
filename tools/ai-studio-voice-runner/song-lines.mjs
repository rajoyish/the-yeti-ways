#!/usr/bin/env node
// Times every sung line of a story's song, for film-audio.mjs --song.
//
//   node tools/ai-studio-voice-runner/song-lines.mjs --song <song.wav> --lyrics stories/<slug>-story.md [--out speech-prompts/<slug>-song-lines.json]
//
// The lyrics are the first ```text block under the story file's `## Song` heading ([Verse N] tags, one sung line
// per line), or a plain text file of the same form. The song is transcribed with whisper.cpp (whisper-cli and
// ~/.cache/whisper-cpp/ggml-medium.en.bin; WHISPER_CLI / WHISPER_MODEL override) with word times, the words are
// aligned to the lyrics in order, and each line gets its start and end in seconds of the song. Lines whose words
// whisper missed are placed between their neighbours and marked "estimated". Sung words come back less cleanly
// than speech, so the output reports how many lyric words were matched.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const home = p => (p && p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);
const songPath = home(opt("--song")), lyricsPath = opt("--lyrics");
if (!songPath || !lyricsPath) { console.log("Usage: node tools/ai-studio-voice-runner/song-lines.mjs --song <song.wav> --lyrics <story.md|lyrics.txt> [--out file.json]"); process.exit(1); }

// ---- lyrics ----
let text = fs.readFileSync(lyricsPath, "utf8");
const sec = text.match(/^## Song\b[\s\S]*?```(?:text)?\n([\s\S]*?)```/m);
if (sec) text = sec[1];
const lines = [];
let verse = "";
for (const raw of text.split(/\r?\n/)) {
  const l = raw.trim();
  if (!l) continue;
  const tag = l.match(/^\[([^\]]+)\]$/);
  if (tag) { verse = tag[1]; continue; }
  lines.push({ verse, text: l });
}
if (!lines.length) { console.error("No lyric lines found."); process.exit(1); }

// ---- whisper word times ----
const which = c => spawnSync("sh", ["-c", `command -v ${c}`], { encoding: "utf8" }).stdout.trim();
const cli = process.env.WHISPER_CLI || which("whisper-cli") || "/opt/homebrew/bin/whisper-cli";
const model = process.env.WHISPER_MODEL || path.join(os.homedir(), ".cache/whisper-cpp/ggml-medium.en.bin");
if (!fs.existsSync(cli) && !which(cli)) { console.error("whisper-cli not found (brew install whisper-cpp)."); process.exit(3); }
if (!fs.existsSync(model)) { console.error(`No whisper model at ${model} (sh .agents/skills/record-story/scripts/setup-whisper.sh).`); process.exit(3); }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "song-lines-"));
let r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", songPath, "-ar", "16000", "-ac", "1", path.join(tmp, "s.wav")], { encoding: "utf8" });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
const names = [...new Set(lines.flatMap(l => l.text.match(/\b[A-Z][a-z]+/g) || []))].join(", ");
// Full JSON with token times, not -ml 1: one-word segments let whisper fold an instrumental intro into the first
// word (2026-11-27: the first line placed at 0.04 s, sung at 4.9 s), while whole segments label the intro
// "(upbeat music)" and time every token inside the singing.
// --dtw aligns each token to the audio (t_dtw, centiseconds); without it, token times inside a long segment are only
// spread evenly across it. DTW needs the model's preset name and flash attention off (-nfa).
const preset = (path.basename(model).match(/ggml-(.+?)\.bin$/) || [])[1];
const dtw = preset && /^(tiny|base|small|medium|large-v[123])(\.en)?$/.test(preset) ? ["--dtw", preset, "-nfa"] : [];
r = spawnSync(cli, ["-m", model, "-f", path.join(tmp, "s.wav"), "-ojf", "-of", path.join(tmp, "w"), "-np", "--prompt", names, ...dtw], { encoding: "utf8", maxBuffer: 1 << 26 });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
const segs = JSON.parse(fs.readFileSync(path.join(tmp, "w.json"), "utf8")).transcription || [];
fs.rmSync(tmp, { recursive: true, force: true });
const norm = s => (s.toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9']+/g) || []).map(w => w.replace(/^'+|'+$/g, "")).filter(Boolean);
// Tokens -> words: a token starting with a space starts a new word; special tokens ([_BEG_], [_TT_n]),
// music notes, and bracketed sound labels ("(upbeat music)") are left out.
const hyp = [];
for (const s of segs) {
  if (/^\s*[([].*[)\]]\s*$/.test(s.text)) continue;
  let cur = null;
  for (const t of s.tokens || []) {
    if (/^\[_/.test(t.text)) continue;
    const from = t.t_dtw >= 0 ? t.t_dtw / 100 : t.offsets.from / 1000, to = t.offsets.to / 1000;
    if (/^\s/.test(t.text) || !cur) { if (cur) hyp.push(cur); cur = { raw: t.text, start: from, end: to }; }
    else { cur.raw += t.text; cur.end = to; }
  }
  if (cur) hyp.push(cur);
}
// With DTW a word ends where the next one starts (capped at 1.5 s, for a held last note before a rest).
if (dtw.length) hyp.forEach((h, i) => { const nx = hyp[i + 1]; h.end = nx && nx.start > h.start ? Math.min(nx.start, h.start + 1.5) : h.start + 0.6; });
const words = hyp.flatMap(h => norm(h.raw).map(w => ({ w, start: h.start, end: h.end })));
hyp.length = 0; hyp.push(...words);

// ---- align words (LCS) ----
const ref = lines.flatMap((l, li) => norm(l.text).map(w => ({ w, li })));
const n = ref.length, m = hyp.length, W = m + 1, L = new Uint32Array((n + 1) * W);
for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
  L[i * W + j] = ref[i].w === hyp[j].w ? L[(i + 1) * W + j + 1] + 1 : Math.max(L[(i + 1) * W + j], L[i * W + j + 1]);
for (let i = 0, j = 0; i < n && j < m;) {
  if (ref[i].w === hyp[j].w) { ref[i].start = hyp[j].start; ref[i].end = hyp[j].end; i++; j++; }
  else if (L[(i + 1) * W + j] >= L[i * W + j + 1]) i++; else j++;
}
const matched = ref.filter(x => x.start !== undefined).length;
const r2 = x => Math.round(x * 100) / 100;
const out = lines.map((l, li) => {
  const ws = ref.filter(x => x.li === li && x.start !== undefined);
  return { verse: l.verse, text: l.text, start: ws.length ? r2(ws[0].start) : null, end: ws.length ? r2(ws.at(-1).end) : null, matched: ws.length, words: ref.filter(x => x.li === li).length };
});
// A line with no matched word sits between its neighbours.
out.forEach((l, i) => {
  if (l.start !== null) return;
  const prev = out.slice(0, i).reverse().find(x => x.end !== null), next = out.slice(i + 1).find(x => x.start !== null);
  l.start = prev ? prev.end : 0; l.end = next ? next.start : l.start + 4; l.estimated = true;
});
const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", songPath], { encoding: "utf8" }).stdout.trim());
const result = { song: path.basename(songPath), duration: r2(dur), matchedWords: matched, lyricWords: n, lines: out };
const outPath = opt("--out") || path.join("speech-prompts", `${path.basename(lyricsPath).replace(/-story\.md$|\.md$|\.txt$/, "")}-song-lines.json`);
fs.writeFileSync(outPath, JSON.stringify(result, null, 1));
console.log(`${result.song}: ${dur.toFixed(2)} s, ${lines.length} lines, ${matched} of ${n} lyric words matched.`);
for (const l of out) console.log(`  ${String(l.start).padStart(6)}-${String(l.end).padEnd(6)} ${l.verse.padEnd(8)} ${l.text}${l.estimated ? "  (estimated)" : l.matched < l.words ? `  (${l.matched}/${l.words} words heard)` : ""}`);
console.log(`Wrote ${outPath}`);
