// Shared helpers for the flow-music-score skill. Node only, no packages;
// audio facts come from ffprobe / ffmpeg on PATH.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname: on Windows the pathname is "/C:/...", which resolves to "C:\C:\...".
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const RUNNER = path.join(ROOT, 'tools/flow-music-score-runner');
const require = createRequire(import.meta.url);
export const ScorePlan = require(path.join(RUNNER, 'plan.js'));

export const COMPOSE_MAX_SEC = 180;   // Compose Length clamps at 3:00
export const SOUND_MAX = 3000;        // Compose Sound description maxLength

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[k] = v;
    } else out._.push(a);
  }
  return out;
}

export function need(bin) {
  const r = spawnSync(bin, ['-version'], { encoding: 'utf8' });
  if (r.error) {
    console.error(`${bin} not found. Install ffmpeg (macOS: brew install ffmpeg; Windows: winget install Gyan.FFmpeg; Linux: apt install ffmpeg).`);
    process.exit(2);
  }
}

// Exact length of an audio file from its sample count.
export function probe(file) {
  need('ffprobe');
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0',
    '-show_entries', 'stream=sample_rate,channels,codec_name,bits_per_sample,bits_per_raw_sample,duration_ts:format=duration',
    '-of', 'json', file], { encoding: 'utf8' }));
  const s = j.streams[0];
  const rate = Number(s.sample_rate);
  const frames = Number(s.duration_ts);
  const duration = Number.isFinite(frames) && frames > 0 ? frames / rate : Number(j.format.duration);
  return { file, rate, channels: s.channels, codec: s.codec_name, bits: Number(s.bits_per_raw_sample || s.bits_per_sample) || null, frames, duration };
}

// Pauses in the voice track (ffmpeg silencedetect).
export function silences(file, noiseDb = -40, minSec = 0.6) {
  need('ffmpeg');
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `silencedetect=n=${noiseDb}dB:d=${minSec}`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const out = [];
  let start = null;
  for (const line of r.stderr.split('\n')) {
    const a = line.match(/silence_start: ([\d.]+)/);
    const b = line.match(/silence_end: ([\d.]+)/);
    if (a) start = Number(a[1]);
    if (b && start !== null) { out.push({ start, end: Number(b[1]) }); start = null; }
  }
  return out;
}

// EBU R128 loudness and true peak.
export function loudness(file) {
  need('ffmpeg');
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const tail = r.stderr.slice(r.stderr.lastIndexOf('Summary:'));
  const num = (re) => { const m = tail.match(re); return m ? Number(m[1]) : null; };
  return { integrated: num(/I:\s+(-?[\d.]+) LUFS/), range: num(/LRA:\s+(-?[\d.]+) LU/), truePeak: num(/Peak:\s+(-?[\d.]+) dBFS/) };
}

export const read = (p) => fs.readFileSync(path.resolve(ROOT, p), 'utf8');
export const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;
export const mmssCue = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`;

// Words that would ask the model for a voice. Allowed only when negated
// ("no vocals", "without singing", "never a choir").
const VOCAL = /\b(vocals?|vocali[sz]e|voices?|sing(?:ing|er|s)?|sung|humm?(?:ing)?|choir|chants?|chanting|lyrics?|whisper\w*|spoken|speech|la la)\b/gi;
export function vocalHits(text) {
  const hits = [];
  for (const m of text.matchAll(VOCAL)) {
    const before = text.slice(Math.max(0, m.index - 40), m.index).toLowerCase();
    if (/\b(no|not|never|without|nor|zero|free of|strictly no|any)\b[^.;\n]*$/.test(before)) continue;
    hits.push(m[0]);
  }
  return hits;
}
