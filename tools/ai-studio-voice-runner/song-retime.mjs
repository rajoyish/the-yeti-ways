#!/usr/bin/env node
// Re-times a film's song from its song-lines file, without the audio: rewrites the song's lines (and their
// choreographed `parts`) in an existing film timeline, rebuilds the clip plan, and writes the timeline's .json
// and .md again. Use it after correcting song-lines.json by ear or adding who sings each phrase.
//
//   node tools/ai-studio-voice-runner/song-retime.mjs speech-prompts/<slug>-film-timeline.json [--song-lines speech-prompts/<slug>-song-lines.json]
//
// The song stays where film-audio.mjs laid it into the master (its start on the film clock); only the sung
// lines move. The .md keeps the Notes and audio folder of the one it replaces. Each line's `parts`
// ([{ text, start, end, singers, screen }], in song seconds) become the Song lines of the clips, phrase by
// phrase; a phrase belongs to the clip its start is in, so split a phrase at a clip cut.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Timeline = require("./timeline.js");

const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
const jsonPath = argv.find(a => a.endsWith("-film-timeline.json"));
if (!jsonPath) { console.error("Usage: song-retime.mjs speech-prompts/<slug>-film-timeline.json [--song-lines file.json]"); process.exit(2); }
const timeline = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const linesPath = opt("--song-lines") || path.join(path.dirname(jsonPath), `${timeline.slug}-song-lines.json`);
const sl = JSON.parse(fs.readFileSync(linesPath, "utf8"));
const song = (timeline.songs || []).find(s => s.file === sl.song) || (timeline.songs || [])[0];
if (!song) { console.error(`${jsonPath} has no song; lay one in with film-audio.mjs --song first.`); process.exit(1); }

// Each line's parts must spell the line, in order, and sit inside it.
const norm = s => s.replace(/\s+/g, " ").trim();
let problems = 0;
for (const l of sl.lines) {
  if (!l.parts?.length) continue;
  if (norm(l.parts.map(p => p.text).join(" ")) !== norm(l.text)) { console.error(`  "${l.text}": its parts read "${l.parts.map(p => p.text).join(" ")}".`); problems++; }
  for (const p of l.parts) {
    if (p.start < l.start - 0.1 || p.end > l.end + 0.1 || p.end <= p.start) { console.error(`  "${p.text}" (${p.start}-${p.end}) is outside its line (${l.start}-${l.end}).`); problems++; }
    if (!p.singers || !/^(on screen|off-screen)$/.test(p.screen || "on screen")) { console.error(`  "${p.text}" needs singers and screen "on screen" or "off-screen".`); problems++; }
  }
}
if (problems) { console.error(`${problems} problem(s) in ${linesPath}; nothing written.`); process.exit(1); }

song.lines = Timeline.songLines(song.start, sl.lines);
const plan = Timeline.clipPlan(timeline);
timeline.plan = plan;

const mdPath = jsonPath.replace(/\.json$/, ".md");
const old = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, "utf8").replace(/\r\n/g, "\n") : "";
const notes = (old.match(/^## Notes\n\n([\s\S]*?)\n\n## /m)?.[1] || "").split("\n").filter(x => x.startsWith("- ")).map(x => x.slice(2));
const audioDir = old.match(/\(in `([^`]+)`\)/)?.[1] || ".";
fs.writeFileSync(jsonPath, JSON.stringify(timeline, null, 1));
fs.writeFileSync(mdPath, Timeline.planMarkdown({ title: timeline.title, slug: timeline.slug, timeline, plan, notes, audioDir }));

const withParts = sl.lines.filter(l => l.parts?.length).length;
console.log(`${song.file}: ${sl.lines.length} sung lines (${withParts} with parts) re-timed on the film clock from ${Timeline.fmt(song.start)}.`);
console.log(`Wrote ${jsonPath} and ${mdPath}.`);
