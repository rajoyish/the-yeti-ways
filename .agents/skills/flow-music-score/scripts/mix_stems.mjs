#!/usr/bin/env node
// Joins the four finished stems (music, ambience, foley, sound effects) into
// one stereo mix, exactly as long as the reference, for Adobe Premiere Pro.
//
//   node .agents/skills/flow-music-score/scripts/mix_stems.mjs \
//     --dir ~/Downloads/flow-music-score/<film> --audio /path/to/story-full.wav \
//     [--no-voice] [--gains music=-4,ambience=-9,foley=0,sfx=1] [--hp 80]
//     [--dips "56.5-58.5:-6,71.7-78.3:-5"] [--target -20] [--tp -3] [--out file.wav]
//     [--sync "/path/to/picture-effects.wav" --sync-gain 0]
//
// Default (voiced film): a bed for ducking under the narration. It is set to
// about -20 LUFS with true peak <= -3 dBTP, so it sits under -14 to -16 LUFS
// dialogue before any ducking, and Premiere's Ducking against Dialogue lowers
// it further while anyone speaks.
// --no-voice: the film has no narration, so the mix is the finished
// soundtrack: -14 LUFS, true peak <= -1.5 dBTP.
//
// Balance: each stem arrives peak-normalised to -1 dBFS, so fixed gains set
// their relative levels (music leads, ambience low, foley and effects up).
// The ambience gets a high-pass (12 dB/oct) to keep rumble out of the drums.
// --dips lowers the music only, between start and end (film seconds), with
// 0.3 s ramps: use it on big sound moments when there is no voice to duck to.
// --sync adds a fifth layer that is already in sync with the picture (the
// edit's own effects, exported from Premiere with any voices removed): arrow
// shots, kicks, impacts that a Flow Music take cannot place to the frame. It
// must be exactly as long as the reference.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { args, probe, loudness, need } from './lib.mjs';

const a = args();
if (!a.dir && !a.music) {
  console.error('Usage: mix_stems.mjs --dir <stems folder> --audio <reference.wav> [--no-voice] [--gains music=-4,ambience=-9,foley=0,sfx=1] [--hp 80] [--dips "s-e:dB,..."] [--target LUFS] [--tp dBTP] [--out file.wav]');
  process.exit(2);
}
need('ffmpeg');
const home = (p) => (p && p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p);

// ---- stems ----
const SUFFIX = { music: '-music-score.wav', ambience: '-ambience.wav', foley: '-foley.wav', sfx: '-sfx.wav' };
const dir = home(a.dir || path.dirname(home(a.music)));
const files = {};
let slug = null;
for (const [k, suf] of Object.entries(SUFFIX)) {
  let f = home(a[k]);
  if (!f) {
    const hit = fs.readdirSync(dir).find((n) => n.endsWith(suf) && !n.includes('-mix'));
    if (hit) f = path.join(dir, hit);
  }
  if (!f || !fs.existsSync(f)) { console.error(`No ${k} stem (*${suf}) in ${dir}.`); process.exit(1); }
  files[k] = f;
  if (k === 'music') slug = path.basename(f).slice(0, -suf.length);
}

// ---- settings ----
const noVoice = Boolean(a['no-voice']);
const gains = { music: -4, ambience: -9, foley: 0, sfx: 1 };
if (typeof a.gains === 'string') for (const kv of a.gains.split(',')) { const [k, v] = kv.split('='); if (k in gains && Number.isFinite(Number(v))) gains[k] = Number(v); }
const hp = a.hp === 'off' ? 0 : Number(a.hp ?? 80);
const target = Number(a.target ?? (noVoice ? -14 : -20));
const tp = Number(a.tp ?? (noVoice ? -1.5 : -3));
const dips = [];
if (typeof a.dips === 'string') {
  for (const d of a.dips.split(',').map((x) => x.trim()).filter(Boolean)) {
    const m = d.match(/^([\d.]+)\s*-\s*([\d.]+)\s*:\s*(-?[\d.]+)$/);
    if (!m) { console.error(`Bad dip "${d}": write start-end:dB in film seconds, e.g. 56.5-58.5:-6.`); process.exit(2); }
    dips.push({ start: Number(m[1]), end: Number(m[2]), db: Number(m[3]) });
  }
}

const ref = probe(home(a.audio) || files.music);
const sync = a.sync ? home(a.sync) : null;
const syncGain = Number(a['sync-gain'] ?? 0);
if (sync) {
  if (!fs.existsSync(sync)) { console.error(`No sync layer at ${sync}.`); process.exit(1); }
  const p = probe(sync);
  if (Math.abs(p.duration - ref.duration) > 0.001) { console.error(`Sync layer is ${p.duration.toFixed(3)} s; the reference is ${ref.duration.toFixed(3)} s. Export it from the same sequence.`); process.exit(1); }
}
const frames = Math.round(ref.duration * 48000);
const out = home(a.out) || path.join(dir, `${slug}-mix.wav`);

// ---- filter graph ----
const R = 0.3; // dip ramp, seconds
const dipExpr = dips.map((d) => `(${d.db})*min(1,max(0,min((t-${(d.start - R).toFixed(3)})/${R},(${(d.end + R).toFixed(3)}-t)/${R})))`).join('+');
const musicVol = dips.length ? `volume='pow(10,(${gains.music}+${dipExpr})/20)':eval=frame` : `volume=${gains.music}dB`;
const graph = (gain) => [
  `[0:a]aresample=48000,${musicVol}[m]`,
  `[1:a]aresample=48000,${hp ? `highpass=f=${hp}:poles=2,` : ''}volume=${gains.ambience}dB[a]`,
  `[2:a]aresample=48000,volume=${gains.foley}dB[f]`,
  `[3:a]aresample=48000,volume=${gains.sfx}dB[s]`,
  ...(sync ? [`[4:a]aresample=48000,volume=${syncGain}dB[p]`] : []),
  `[m][a][f][s]${sync ? '[p]' : ''}amix=inputs=${sync ? 5 : 4}:normalize=0:duration=longest,volume=${gain.toFixed(2)}dB,aresample=192000,alimiter=limit=${Math.pow(10, (tp - 0.5) / 20).toFixed(4)}:attack=3:release=80:level=disabled,aresample=48000,atrim=end_sample=${frames},apad=whole_len=${frames}[out]`,
].join(';');
const inputs = ['music', 'ambience', 'foley', 'sfx'].flatMap((k) => ['-i', files[k]]).concat(sync ? ['-i', sync] : []);

function render(gain, file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-v', 'error', '-y', ...inputs, '-filter_complex', graph(gain), '-map', '[out]', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s24le', file], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  return loudness(file);
}

// Pass 1 at 0 dB to measure the sum, then set the gain to reach the target;
// a second correction covers what the limiter took off.
let gain = 0;
let L = render(gain, out);
for (let i = 0; i < 2 && L.integrated !== null && Math.abs(L.integrated - target) > 0.3; i++) {
  gain += target - L.integrated;
  L = render(gain, out);
}
const got = probe(out);

const report = {
  mode: noVoice ? 'no-voice (finished soundtrack)' : 'voiced (bed for ducking under the narration)',
  reference: { file: ref.file, frames: ref.frames, duration: ref.duration },
  stems: files,
  gains, syncLayer: sync ? { file: sync, gainDb: syncGain } : null, highpassHz: hp || null, musicDips: dips, makeupGainDb: Number(gain.toFixed(2)),
  target: { lufs: target, truePeakDb: tp },
  measured: L,
  output: { file: out, frames: got.frames, duration: got.duration, exact: got.frames === frames },
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(out.replace(/\.wav$/i, '.json'), JSON.stringify(report, null, 2));

console.log(`Mix:       ${out}`);
console.log(`Mode:      ${report.mode}`);
console.log(`Stems:     music ${gains.music} dB${dips.length ? ` with ${dips.length} dip(s)` : ''}, ambience ${gains.ambience} dB${hp ? ` (high-pass ${hp} Hz)` : ''}, foley ${gains.foley} dB, sfx ${gains.sfx} dB${sync ? `, sync layer ${syncGain} dB` : ''}; make-up ${gain.toFixed(2)} dB`);
console.log(`Length:    ${got.frames} frames @ 48000 Hz ${got.frames === frames ? '(exactly the reference)' : `(reference ${frames}: MISMATCH)`}`);
console.log(`Loudness:  ${L.integrated} LUFS integrated (target ${target}), LRA ${L.range} LU, true peak ${L.truePeak} dBFS (limit ${tp})`);
if (got.frames !== frames) process.exit(1);
