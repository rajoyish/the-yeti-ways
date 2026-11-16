#!/usr/bin/env node
// Checks the music + effects bed built by the Flow Music Score Runner
// against the reference voice track, with ffprobe / ffmpeg, and can render a
// listening mix (voice at 0 dB over the bed at --bed-db).
//
//   node .agents/skills/flow-music-score/scripts/verify_bed.mjs \
//     --bed ~/Downloads/<film>-music-sfx-bed.wav --audio "/path/to/story-full.wav" \
//     [--preview preview-mix.wav] [--bed-db -18] [--kind music|ambience|foley|sfx]
//
// Exit 0 = same length as the reference (within one output sample) and a
// Premiere-ready PCM WAV; 1 otherwise.
import { spawnSync } from 'node:child_process';
import { args, probe, loudness, silences, mmss, need } from './lib.mjs';

const a = args();
if (!a.bed || !a.audio) { console.error('Usage: verify_bed.mjs --bed <bed.wav> --audio <story-full.wav> [--preview out.wav] [--bed-db -18]'); process.exit(2); }
const bed = probe(a.bed);
const ref = probe(a.audio);
const errors = [];
const warns = [];

const diff = bed.duration - ref.duration;
const tol = 1 / bed.rate + 1e-9;
console.log(`Bed:       ${bed.duration.toFixed(6)} s  ${bed.frames} frames @ ${bed.rate} Hz, ${bed.channels} ch, ${bed.codec}${bed.bits ? `, ${bed.bits}-bit` : ''}`);
console.log(`Reference: ${ref.duration.toFixed(6)} s  ${ref.frames} frames @ ${ref.rate} Hz, ${ref.channels} ch`);
if (Math.abs(diff) > tol) errors.push(`Length differs by ${(diff * 1000).toFixed(2)} ms (${Math.round(diff * bed.rate)} samples). Rebuild in the extension with this reference loaded.`);
else console.log(`Length:    identical (difference ${(diff * 1e6).toFixed(1)} µs)`);
if (!/^pcm_/.test(bed.codec)) errors.push(`Codec is ${bed.codec}; Premiere expects PCM WAV.`);
if (![48000, 44100, 96000].includes(bed.rate)) warns.push(`Sample rate ${bed.rate} Hz; 48 kHz is the video standard.`);
if (bed.channels !== 2) warns.push(`${bed.channels} channel(s); the bed is normally stereo.`);

const L = loudness(a.bed);
console.log(`Loudness:  ${L.integrated} LUFS integrated, LRA ${L.range} LU, true peak ${L.truePeak} dBFS`);
if (L.truePeak !== null && L.truePeak > -0.1) warns.push(`True peak ${L.truePeak} dBFS: may clip after resampling. Rebuild with Peak −1 dBFS or lower.`);

// Silence is expected between sounds in foley and sound-effect stems; it is
// only a problem in the music and ambience beds. --kind overrides the guess
// from the file name (…-music-score, -ambience, -foley, -sfx, -music-sfx-bed).
const kind = a.kind || (/-foley\b/.test(a.bed) ? 'foley' : /-sfx\.wav$|-sfx-only/.test(a.bed) ? 'sfx' : /-ambience\b/.test(a.bed) ? 'ambience' : 'music');
console.log(`Stem:      ${kind}`);
if (kind === 'music' || kind === 'ambience') {
  const gaps = silences(a.bed, -50, 2);
  const inner = gaps.filter((g) => g.start > 0.5 && g.end < bed.duration - 3);
  if (inner.length) warns.push(`Near-silent stretches in the ${kind} stem: ${inner.map((g) => `${mmss(g.start)} (${(g.end - g.start).toFixed(1)} s)`).join(', ')}. Listen there; retake that movement if it drops out.`);
}

if (a.preview) {
  need('ffmpeg');
  const db = Number(a['bed-db'] ?? -18);
  const r = spawnSync('ffmpeg', ['-hide_banner', '-v', 'error', '-y', '-i', a.audio, '-i', a.bed, '-filter_complex',
    `[0:a]aresample=48000,aformat=channel_layouts=stereo[v];[1:a]aresample=48000,volume=${db}dB[m];[v][m]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[out]`,
    '-map', '[out]', '-c:a', 'pcm_s16le', a.preview], { encoding: 'utf8' });
  if (r.status !== 0) errors.push(`Preview mix failed: ${r.stderr.trim().slice(0, 300)}`);
  else console.log(`Preview:   ${a.preview} (voice 0 dB + bed ${db} dB) — listen for vocals in the bed and effects masking speech.`);
}

for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `\n${errors.length} error(s).` : '\nOK: drop it at 00:00:00:00 under the voice track in Premiere.');
process.exit(errors.length ? 1 : 0);
