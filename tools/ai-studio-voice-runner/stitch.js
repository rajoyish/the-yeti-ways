// Stitches separate cue takes into one speech track: each take's first word lands on its cue's
// start time, on a silent bed exactly as long as the video (10 s for a Flow clip) or the film.
// Pure JS (no Web Audio) so the panel and Node tests share it.
(function (root) {
  const THR = 0.025;          // about -32 dBFS, the same loudness gate the panel measures with
  const sinc = x => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));
  const lanczos = (x, a) => (Math.abs(x) >= a ? 0 : sinc(x) * sinc(x / a));

  // "00:05.8" / "0:05.8" / "00:01" -> seconds
  function parseTime(s) {
    const p = String(s).trim().split(":").map(Number);
    if (p.some(Number.isNaN)) return NaN;
    return p.reduce((acc, v) => acc * 60 + v, 0);
  }

  // "00:05.8-00:08.9" -> { start, end }, or null for "in the edit"
  function parseRange(s) {
    const m = String(s || "").match(/^\s*([\d:.]+)\s*[-–]\s*([\d:.]+)\s*$/);
    if (!m) return null;
    const start = parseTime(m[1]), end = parseTime(m[2]);
    return Number.isFinite(start) && Number.isFinite(end) ? { start, end } : null;
  }

  // 16-bit PCM WAV -> { rate, data: Float32Array mono }
  function parseWav(buf) {
    const dv = new DataView(buf);
    const tag = o => String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
    if (dv.byteLength < 12 || tag(0) !== "RIFF" || tag(8) !== "WAVE") return null;
    let ch = 1, rate = 24000, bits = 16, off = -1, len = 0;
    for (let o = 12; o + 8 <= dv.byteLength;) {
      const id = tag(o), size = dv.getUint32(o + 4, true);
      if (id === "fmt ") { ch = dv.getUint16(o + 10, true); rate = dv.getUint32(o + 12, true); bits = dv.getUint16(o + 22, true); }
      if (id === "data") { off = o + 8; len = Math.min(size, dv.byteLength - off); break; }
      o += 8 + size + (size % 2);
    }
    if (off < 0 || bits !== 16) return null;
    const frames = Math.floor(len / (2 * ch));
    const data = new Float32Array(frames);
    for (let f = 0; f < frames; f++) {
      let s = 0;
      for (let c = 0; c < ch; c++) s += dv.getInt16(off + (f * ch + c) * 2, true);
      data[f] = s / ch / 32768;
    }
    return { rate, data };
  }

  // First and last sample of the speech (10 ms frames louder than THR).
  function speechSpan(x, rate) {
    const win = Math.max(1, Math.round(rate / 100));
    let first = -1, last = -1;
    for (let f = 0; f < x.length; f += win) {
      let peak = 0;
      for (let k = f; k < Math.min(x.length, f + win); k++) { const v = Math.abs(x[k]); if (v > peak) peak = v; }
      if (peak > THR) { if (first < 0) first = f; last = Math.min(x.length, f + win); }
    }
    return first < 0 ? null : { first, last };
  }

  // Lanczos (a = 8) resampler; 24 kHz takes -> 48 kHz video audio.
  function resample(x, from, to) {
    if (from === to) return Float32Array.from(x);
    const ratio = from / to, n = Math.floor(x.length / ratio), a = 8;
    const scale = Math.min(1, to / from), span = Math.ceil(a / scale);
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i * ratio, c = Math.floor(t);
      let s = 0, w = 0;
      for (let k = c - span + 1; k <= c + span; k++) {
        if (k < 0 || k >= x.length) continue;
        const wt = lanczos((t - k) * scale, a);
        s += x[k] * wt; w += wt;
      }
      out[i] = w ? s / w : 0;
    }
    return out;
  }

  function fadeIn(x, n) { n = Math.min(n, x.length); for (let i = 0; i < n; i++) x[i] *= i / n; }
  function fadeOut(x, end, n) { n = Math.min(n, end); for (let i = 0; i < n; i++) x[end - 1 - i] *= i / n; }

  function encodeWav(mono, rate, channels) {
    const frames = mono.length, bytes = frames * channels * 2;
    const buf = new ArrayBuffer(44 + bytes), dv = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    str(0, "RIFF"); dv.setUint32(4, 36 + bytes, true); str(8, "WAVE");
    str(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, channels, true);
    dv.setUint32(24, rate, true); dv.setUint32(28, rate * channels * 2, true); dv.setUint16(32, channels * 2, true); dv.setUint16(34, 16, true);
    str(36, "data"); dv.setUint32(40, bytes, true);
    let o = 44;
    for (let i = 0; i < frames; i++) {
      const v = Math.max(-1, Math.min(1, mono[i]));
      const s = v < 0 ? Math.round(v * 32768) : Math.round(v * 32767);
      for (let c = 0; c < channels; c++) { dv.setInt16(o, s, true); o += 2; }
    }
    return buf;
  }

  // items: [{ id, at (s, where the first word lands), end (s, window end, optional), wav: ArrayBuffer }]
  // Returns { wav, notes, placed }. notes are human-readable warnings (cut, overlap, late, clipped).
  function buildTrack({ length, items, rate = 48000, channels = 2, pre = 0.08, post = 0.3, label = "track" }) {
    const N = Math.round(length * rate);
    const mix = new Float32Array(N);
    const notes = [], placed = [];
    const fadeN = Math.round(0.01 * rate), cutFadeN = Math.round(0.03 * rate);
    for (const it of [...items].sort((a, b) => a.at - b.at)) {
      const w = parseWav(it.wav);
      if (!w) { notes.push(`${it.id}: not a 16-bit WAV, left out`); continue; }
      const sp = speechSpan(w.data, w.rate);
      if (!sp) { notes.push(`${it.id}: the take is silent, left out`); continue; }
      const s0 = Math.max(0, sp.first - Math.round(pre * w.rate));
      const s1 = Math.min(w.data.length, sp.last + Math.round(post * w.rate));
      const seg = resample(w.data.subarray(s0, s1), w.rate, rate);
      fadeIn(seg, fadeN); fadeOut(seg, seg.length, fadeN);
      let at = Math.round(it.at * rate) - Math.round(((sp.first - s0) / w.rate) * rate);
      let off = 0;
      if (at < 0) { off = -at; at = 0; }
      const n = Math.min(seg.length - off, N - at);
      if (n <= 0) { notes.push(`${it.id}: starts at ${it.at.toFixed(2)} s, past the end of the ${length} s ${label}; left out`); continue; }
      const speech = (sp.last - sp.first) / w.rate;
      const speechEnd = it.at + speech;
      if (speechEnd > length + 0.005) {
        notes.push(`${it.id}: speech ends at ${speechEnd.toFixed(2)} s, ${(speechEnd - length).toFixed(2)} s past the end of the ${length} s ${label}; cut there with a fade. Retake it shorter.`);
        fadeOut(seg, off + n, cutFadeN);
      } else if (it.end != null && speechEnd > it.end + 0.05) {
        notes.push(`${it.id}: speech ends at ${speechEnd.toFixed(2)} s, ${(speechEnd - it.end).toFixed(2)} s after its window (${it.end.toFixed(2)} s)`);
      }
      for (let i = 0; i < n; i++) mix[at + i] += seg[off + i];
      placed.push({ id: it.id, start: it.at, end: Math.min(speechEnd, length), speech });
    }
    for (let i = 0; i + 1 < placed.length; i++) {
      if (placed[i].end > placed[i + 1].start + 0.01) {
        notes.push(`${placed[i].id} overlaps ${placed[i + 1].id} by ${(placed[i].end - placed[i + 1].start).toFixed(2)} s`);
      }
    }
    // Soft knee above 0.9 instead of turning the whole track down, so every video keeps the same level.
    // Resampling near-full-scale takes overshoots a little; only overlapping lines go far past 0 dBFS.
    let peak = 0;
    for (let i = 0; i < N; i++) {
      const a = Math.abs(mix[i]);
      if (a > peak) peak = a;
      if (a > 0.9) mix[i] = Math.sign(mix[i]) * (0.9 + 0.1 * Math.tanh((a - 0.9) / 0.1));
    }
    if (peak > 1.12) notes.push(`peaks reached +${(20 * Math.log10(peak)).toFixed(1)} dBFS and were softly limited`);
    return { wav: encodeWav(mix, rate, channels), notes, placed, length: N / rate };
  }

  // Story parts -> one WAV: each part's silence at the ends trimmed (keeping `pre`/`post`), the parts
  // laid end to end with `gap` seconds between, at the first part's sample rate, mono.
  // items: [{ id, wav: ArrayBuffer }] in story order. Returns { wav, notes, placed, length }.
  function joinTakes({ items, gap = 0.7, pre = 0.05, post = 0.35 }) {
    const notes = [], placed = [], segs = [];
    let rate = 0;
    for (const it of items) {
      const w = parseWav(it.wav);
      if (!w) { notes.push(`${it.id}: not a 16-bit WAV, left out`); continue; }
      rate ||= w.rate;
      const sp = speechSpan(w.data, w.rate);
      if (!sp) { notes.push(`${it.id}: the take is silent, left out`); continue; }
      const s0 = Math.max(0, sp.first - Math.round(pre * w.rate));
      const s1 = Math.min(w.data.length, sp.last + Math.round(post * w.rate));
      const seg = resample(w.data.subarray(s0, s1), w.rate, rate);
      const fadeN = Math.round(0.01 * rate);
      fadeIn(seg, fadeN); fadeOut(seg, seg.length, fadeN);
      segs.push({ id: it.id, seg });
    }
    if (!segs.length) return { wav: null, notes, placed, length: 0 };
    const gapN = Math.round(gap * rate);
    const N = segs.reduce((n, s) => n + s.seg.length, 0) + gapN * (segs.length - 1);
    const mix = new Float32Array(N);
    let at = 0;
    for (const s of segs) {
      mix.set(s.seg, at);
      placed.push({ id: s.id, start: at / rate, end: (at + s.seg.length) / rate });
      at += s.seg.length + gapN;
    }
    return { wav: encodeWav(mix, rate, 1), notes, placed, length: N / rate };
  }

  const api = { parseTime, parseRange, parseWav, speechSpan, resample, encodeWav, buildTrack, joinTakes };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Stitch = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
