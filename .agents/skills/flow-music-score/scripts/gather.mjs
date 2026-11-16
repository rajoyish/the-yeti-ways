#!/usr/bin/env node
// Builds the score brief for a Yeti film: one row per video with its window
// on the reference voice track, location, speakers, how much of it is speech
// (measured from the WAV with ffmpeg), the storyboard's music, ambience and
// effects, plus a suggested split into Flow Music movements (<= 3:00 each).
//
//   node .agents/skills/flow-music-score/scripts/gather.mjs \
//     --storyboard prompts/<film>-storyboard.md \
//     --audio "/path/to/story-full.wav" \
//     [--blocks speech-prompts/<film>-speech-blocks.md] \
//     [--timeline speech-prompts/<film>-film-timeline.json] \
//     [--overlap 4] [--target 150] [--json out.json]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, args, probe, silences, read, mmss, COMPOSE_MAX_SEC } from './lib.mjs';

const a = args();
if (!a.storyboard || !a.audio) {
  console.error('Usage: gather.mjs --storyboard <file> --audio <story-full.wav> [--blocks <file>] [--timeline <json>] [--overlap 4] [--target 150] [--json out.json]');
  process.exit(2);
}
const overlap = Number(a.overlap ?? 4);
const target = Number(a.target ?? 150);
const sb = read(a.storyboard);
const ref = probe(a.audio);

// ---- timeline (optional; found next to the speech blocks by name) ----
let timeline = null;
const guessTimeline = a.timeline || (a.blocks ? a.blocks.replace(/-speech-blocks\.md$/, '-film-timeline.json') : null);
if (guessTimeline && fs.existsSync(path.resolve(ROOT, guessTimeline))) timeline = JSON.parse(read(guessTimeline));
const clipLen = timeline?.clipLength || Number(a.clip || 10);

// ---- storyboard videos ----
const videos = [];
const re = /^## Video (\d+) - (.+)$/gm;
const heads = [];
let m;
while ((m = re.exec(sb))) heads.push({ n: Number(m[1]), title: m[2].trim(), at: m.index, end: re.lastIndex });
heads.forEach((h, i) => {
  const next = sb.slice(h.end).search(/^## /m);
  const body = sb.slice(h.end, next < 0 ? sb.length : h.end + next);
  const plate = (body.match(/Plate - ([^`]+)`/) || [])[1] || '';
  const setting = ((body.match(/^Setting: (.+)$/m) || [])[1] || '').split(/[,:;]/)[0].trim();
  const sound = ((body.match(/^Sound: (.+)$/m) || [])[1] || '').replace(/\s*No lyrics[^.]*\.?\s*$/i, '').trim();
  const [music, ...amb] = sound.split(/(?<=\.)\s+/);
  const effects = [...body.matchAll(/Effects: ([^.]+)\./g)].map((x) => x[1].trim());
  const speakers = [...new Set([...((body.match(/^Speech: (.+)$/m) || [])[1] || '').matchAll(/\d\d:\d\d(?:\.\d)?-\d\d:\d\d(?:\.\d)?, ([^,]+),/g)].map((x) => x[1].trim()))];
  const start = (h.n - 1) * clipLen;
  // A video that attaches no plate continues in the previous video's place.
  const place = plate || videos[videos.length - 1]?.plate || '';
  videos.push({ n: h.n, title: h.title, start, end: Math.min(h.n * clipLen, ref.duration), plate: place, setting, speakers, music: (music || '').replace(/,?\s*(?:all\s+)?kept low under every spoken line\.?/i, '').trim(), ambience: amb.join(' ').trim(), effects });
});
if (!videos.length) { console.error('No "## Video N - Title" sections found.'); process.exit(1); }
const last = videos[videos.length - 1];
const expectEnd = videos.length * clipLen;
const notes = [];
if (ref.duration > expectEnd + 0.01) notes.push(`The voice track (${ref.duration.toFixed(3)} s) runs past the last video (${expectEnd} s). The last movement must still end at ${ref.duration.toFixed(3)} s.`);
if (ref.duration < (videos.length - 1) * clipLen) notes.push(`The voice track (${ref.duration.toFixed(3)} s) ends before Video ${last.n} starts. Check the storyboard matches this recording.`);
last.end = ref.duration;

// ---- speech from the recording itself ----
const quiet = silences(a.audio, Number(a.noise ?? -40), 0.35);
const speech = [];
let t = 0;
for (const q of quiet) { if (q.start > t + 0.05) speech.push({ start: t, end: q.start }); t = q.end; }
if (t < ref.duration - 0.05) speech.push({ start: t, end: ref.duration });
const overlapLen = (s0, s1) => speech.reduce((acc, s) => acc + Math.max(0, Math.min(s1, s.end) - Math.max(s0, s.start)), 0);
const speakingAt = (x) => speech.some((s) => x > s.start + 0.1 && x < s.end - 0.1);
for (const v of videos) {
  const len = v.end - v.start;
  v.speechPct = Math.round((overlapLen(v.start, v.end) / len) * 100);
  const gaps = quiet.map((q) => ({ start: Math.max(q.start, v.start), end: Math.min(q.end, v.end) })).filter((g) => g.end - g.start > 0);
  const g = gaps.sort((x, y) => (y.end - y.start) - (x.end - x.start))[0];
  v.longestPause = g ? { at: g.start, len: g.end - g.start } : null;
  if (timeline?.plan?.[v.n - 1]?.entries) v.speakers = [...new Set(timeline.plan[v.n - 1].entries.map((e) => e.speaker))];
}
const breaths = quiet.filter((q) => q.end - q.start >= 1.5).map((q) => ({ start: q.start, end: q.end, len: q.end - q.start }));

// ---- movement split (DP over video boundaries) ----
const N = videos.length;
const best = new Array(N + 1).fill(Infinity);
const from = new Array(N + 1).fill(-1);
best[0] = 0;
for (let j = 1; j <= N; j++) {
  for (let i = 0; i < j; i++) {
    if (!Number.isFinite(best[i])) continue;
    const s = videos[i].start;
    const e = videos[j - 1].end;
    const d = e - s;
    const lastSeg = j === N;
    const firstSeg = i === 0;
    const askFor = d + (lastSeg ? 2 : overlap) - (firstSeg ? 0 : 0);
    if (askFor > COMPOSE_MAX_SEC) continue;
    let cost = 4 + ((d - target) ** 2) / 400;
    if (!lastSeg) {
      if (videos[j - 1].plate && videos[j - 1].plate === videos[j].plate) cost += 6;   // same place across the cut
      if (speakingAt(e)) cost += 2;                                                     // cut mid-sentence
    }
    if (best[i] + cost < best[j]) { best[j] = best[i] + cost; from[j] = i; }
  }
}
if (!Number.isFinite(best[N])) { console.error('Could not split the film into <= 3:00 movements (a single video window is too long?).'); process.exit(1); }
const cuts = [];
for (let j = N; j > 0; j = from[j]) cuts.unshift([from[j], j]);
const movements = cuts.map(([i, j], k) => ({
  n: k + 1,
  videos: [videos[i].n, videos[j - 1].n],
  start: videos[i].start,
  end: videos[j - 1].end,
  duration: videos[j - 1].end - videos[i].start,
  places: [...new Set(videos.slice(i, j).map((v) => v.plate).filter(Boolean))],
}));

// ---- output ----
const brief = { storyboard: a.storyboard, audio: { ...ref, file: path.basename(a.audio) }, clipLength: clipLen, videos: N, overlap, notes, movements, breaths, rows: videos };
if (a.json) fs.writeFileSync(path.resolve(process.cwd(), a.json), JSON.stringify(brief, null, 2));

const L = [];
L.push(`# Score brief: ${path.basename(a.storyboard)}`);
L.push('');
L.push(`Reference: ${path.basename(a.audio)} = **${ref.duration.toFixed(3)} s** (${ref.frames} frames @ ${ref.rate} Hz, ${ref.channels} ch). ${N} videos of ${clipLen} s; the last ends at ${mmss(ref.duration)}.`);
for (const n of notes) L.push(`- NOTE: ${n}`);
L.push('');
L.push(`## Suggested movements (each asks Flow Music for its window + ${overlap} s overlap, max 3:00)`);
L.push('');
L.push('| Movement | Videos | Film Window | Seconds | Places |');
L.push('| --- | --- | --- | --- | --- |');
for (const mv of movements) L.push(`| ${mv.n} | V${String(mv.videos[0]).padStart(2, '0')}–V${String(mv.videos[1]).padStart(2, '0')} | \`${mmss(mv.start)} – ${mmss(mv.end)}\` | ${mv.duration.toFixed(2)} | ${mv.places.join(', ')} |`);
L.push('');
L.push('## Pauses in the voice track of 1.5 s or more (room for a musical swell or a clear effect)');
L.push('');
L.push(breaths.length ? breaths.map((b) => `${mmss(b.start)} (${b.len.toFixed(1)} s)`).join(', ') : 'None.');
L.push('');
L.push('## Videos');
L.push('');
L.push('| V | Window | Title | Place | Speakers | Speech % | Longest pause | Music (storyboard) | Ambience | Effects |');
L.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const v of videos) {
  L.push(`| ${v.n} | ${mmss(v.start)}–${mmss(v.end)} | ${v.title} | ${v.plate || v.setting} | ${v.speakers.join(', ')} | ${v.speechPct} | ${v.longestPause ? `${v.longestPause.len.toFixed(1)} s @ ${mmss(v.longestPause.at)}` : '—'} | ${v.music} | ${v.ambience} | ${v.effects.join('; ')} |`);
}
console.log(L.join('\n'));
