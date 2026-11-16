#!/usr/bin/env node
// Checks a music guide (music-prompts/<film>-flow-music.md) the way the
// Flow Music Score Runner extension will read it: through its own plan.js.
//
//   node .agents/skills/flow-music-score/scripts/check_score_guide.mjs \
//     music-prompts/<film>-flow-music.md --audio "/path/to/story-full.wav" \
//     [--storyboard prompts/<film>-storyboard.md] [--crossfade 3] [--show m02]
//
// Exit 0 = ready for the extension; 1 = errors; warnings never fail.
import { ScorePlan, args, probe, read, vocalHits, COMPOSE_MAX_SEC, SOUND_MAX } from './lib.mjs';

const a = args();
const guide = a._[0];
if (!guide || !a.audio) { console.error('Usage: check_score_guide.mjs <guide.md> --audio <story-full.wav> [--storyboard <file>] [--crossfade 3] [--show m01|a01|f01|s01]'); process.exit(2); }
const md = read(guide);
const ref = probe(a.audio);
const xf = Number(a.crossfade ?? 3);
const errors = [];
const warns = [];
const E = (s) => errors.push(s);
const W = (s) => warns.push(s);

// ---- movements as the guide states them (before the runner rebases) ----
const raw = ScorePlan.parseMovements(md);
if (!raw.length) E('No "### Movement N: Title" section with a "Film Window:" and a "Sound Box Prompt:" ```text block was found.');
const rawCount = (md.match(/^###\s+Movement\s+\d+\s*:/gm) || []).length;
if (rawCount !== raw.length) E(`${rawCount} "### Movement" headings but only ${raw.length} parse (each needs **Film Window:** \`MM:SS.s – MM:SS.s\` and **Sound Box Prompt:** with a \`\`\`text block).`);
raw.forEach((mv, i) => {
  if (!Number.isFinite(mv.start) || !Number.isFinite(mv.end)) E(`Movement ${mv.n}: unreadable Film Window.`);
  if (i === 0 && Math.abs(mv.start) > 0.001) E(`Movement ${mv.n} starts at ${mv.start} s; the first must start at 00:00.0.`);
  if (i > 0 && Math.abs(mv.start - raw[i - 1].end) > 0.001) E(`Movement ${mv.n} starts at ${mv.start} s but Movement ${raw[i - 1].n} ends at ${raw[i - 1].end} s (windows must touch, no gaps or overlaps).`);
  if (mv.n !== i + 1) E(`Movements are not numbered 1..N in order (found ${mv.n} at position ${i + 1}).`);
  if (!mv.bpm) W(`Movement ${mv.n}: no "NN BPM" in Meter & Tempo; Compose will pick its own tempo.`);
  const hits = vocalHits(mv.prompt);
  if (hits.length) E(`Movement ${mv.n}: Sound Box Prompt asks for a voice: ${[...new Set(hits)].join(', ')} (only negated forms such as "no vocals" are allowed).`);
  if (!/no vocals/i.test(mv.prompt)) W(`Movement ${mv.n}: prompt does not say "No vocals" (the runner adds a header, but say it in the prompt too).`);
  if (/\d\d:\d\d\.\d/.test(mv.prompt)) W(`Movement ${mv.n}: prompt contains film-clock times (MM:SS.s); cue times inside a prompt must be movement-relative (At 0:25).`);
  const rel = [...mv.prompt.matchAll(/\bAt (\d+):(\d\d)\b/g)].map((x) => Number(x[1]) * 60 + Number(x[2]));
  const span = mv.end - mv.start;
  for (const r of rel) if (r > span + 0.5) E(`Movement ${mv.n}: cue "At ${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}" is past the movement's ${span.toFixed(1)} s window (cues are movement-relative).`);
});
const lastRaw = raw[raw.length - 1];
if (lastRaw && Math.abs(lastRaw.end - ref.duration) > 0.06) E(`Last movement ends at ${lastRaw.end.toFixed(3)} s; the voice track is ${ref.duration.toFixed(3)} s. Set its Film Window end to ${ref.duration.toFixed(2)}.`);

// ---- the jobs the extension will send, for every stem ----
const plans = {};
for (const layer of ScorePlan.STEMS) {
  try { plans[layer] = ScorePlan.buildPlan(md, { duration: ref.duration, overlap: xf + 1, layer }); } catch (e) { E(e.message); break; }
  for (const j of plans[layer].jobs) {
    if (j.slot + j.overlap > COMPOSE_MAX_SEC) E(`${j.id}: window ${j.slot.toFixed(1)} s + ${j.overlap} s overlap exceeds Flow Music's 3:00. Split it.`);
    if (j.sound.length > SOUND_MAX) E(`${j.id}: ${layer} prompt is ${j.sound.length} chars (max ${SOUND_MAX}).`);
    if (j.fxLevel === 1) W(`${j.id}: ${layer} prompt too long; the runner keeps only the first clause per video. Shorten that column's cues for Videos in Movement ${j.n}.`);
    if (j.fxLevel === 2) W(`${j.id}: ${layer} prompt far too long; the runner cut it down. Shorten that column's cues for Movement ${j.n}.`);
    for (const w of j.warnings) E(`${j.id}: ${w}`);
  }
}
const plan = plans.music;

// ---- SFX cue table ----
const cues = ScorePlan.parseCues(md);
if (!cues.length) E('No cue rows found (| **V01** | `00:00 - 00:10` | Title | Ambience | Foley | Sound Effects |).');
if (cues.some((c) => c.legacy)) W('Cue sheet has 5 columns (Ambience | Foley): the runner sorts foley clauses into Foley or Sound Effects by keyword. Add a "Sound Effects" column for exact stems.');
cues.forEach((c, i) => {
  if (c.video !== i + 1) E(`Cue row ${i + 1} is V${c.video}; rows must run V01, V02, … in order.`);
  if (i > 0 && Math.abs(c.start - cues[i - 1].end) > 0.6) E(`V${c.video} starts at ${c.start} s but V${cues[i - 1].video} ends at ${cues[i - 1].end} s.`);
  if (!ScorePlan.cleanFx(c.ambience)) W(`V${c.video}: no ambience (the atmosphere stem needs a bed in every video).`);
  if (!ScorePlan.cleanFx(c.foley) && !ScorePlan.cleanFx(c.sfx)) W(`V${c.video}: no foley and no sound effects.`);
  const dropped = `${c.ambience}; ${c.foley}; ${c.sfx}`.split(/\s*[;,]\s*/).filter((p) => p && !/^(?:[—–-]+|none|n\/a|nil)$/i.test(p) && !ScorePlan.cleanFx(p));
  if (dropped.length) W(`V${c.video}: voice-like sound dropped by the runner: "${dropped.join('", "')}". Replace it with a non-vocal sound or remove it.`);
});
if (cues.length && Math.abs(cues[cues.length - 1].end - ref.duration) > 1) W(`Last cue ends at ${cues[cues.length - 1].end} s; the voice track is ${ref.duration.toFixed(2)} s.`);

if (a.storyboard) {
  const n = (read(a.storyboard).match(/^## Video \d+ - /gm) || []).length;
  if (n && cues.length !== n) E(`The storyboard has ${n} videos but the cue table has ${cues.length} rows.`);
}

// ---- report ----
console.log(`Guide: ${guide}`);
console.log(`Reference: ${ref.duration.toFixed(3)} s (${ref.frames} frames @ ${ref.rate} Hz)`);
if (plan) {
  console.log('\nMovements (Compose: Instrumental on, Advanced on):');
  for (const j of plan.jobs) console.log(`  M${j.n}  ${j.start.toFixed(2).padStart(7)}–${j.end.toFixed(2).padEnd(7)}  window ${j.slot.toFixed(2).padStart(6)} s  ${j.bpm ? j.bpm + ' BPM' : 'auto BPM'}`);
  console.log('\nStems (job: Length / prompt chars):');
  for (const layer of ScorePlan.STEMS) if (plans[layer]) console.log(`  ${plans[layer].layerLabel.padEnd(28)} → ${plans[layer].outName}.wav   ${plans[layer].jobs.map((j) => (j.empty ? `${j.id} silent` : `${j.id} ${j.length}/${j.sound.length}`)).join('  ')}`);
  if (a.show) {
    const j = Object.values(plans).flatMap((p) => p.jobs).find((x) => x.id === a.show);
    if (j) console.log(`\n----- ${j.id} (${j.layer}) Sound prompt -----\n${j.sound}\n-----`);
    else console.log(`\nNo job ${a.show}. Ids: m01… music, a01… ambience, f01… foley, s01… sound effects.`);
  }
}
console.log(`SFX cue rows: ${cues.length}`);
for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `\n${errors.length} error(s): fix the guide before loading it in the extension.` : '\nOK: ready for tools/flow-music-score-runner.');
process.exit(errors.length ? 1 : 0);
