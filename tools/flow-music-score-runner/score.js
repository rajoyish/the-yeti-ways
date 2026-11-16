// Score assembly: lays the generated movement takes end to end on the film's
// clock, crossfades them, and renders one WAV exactly as long as the
// reference voice track (sample-exact at the output rate).
//
// Pure functions (planLayout, encodeWav) run in Node for tests; render()
// needs OfflineAudioContext (the side panel).
(function (root) {
  'use strict';

  // Decides where each take plays. Each take i starts at job.start (minus
  // half the crossfade for all but the first) and is trimmed so it ends at
  // the next window's start plus half the crossfade. A take shorter than its
  // slot is sped up (resampled) by at most maxStretch; beyond that it is
  // left short and its tail fades, with a warning.
  function planLayout(jobs, takeDurations, opts = {}) {
    const xfade = opts.crossfade ?? 3;
    const maxStretch = opts.maxStretch ?? 0.06;
    const total = opts.duration;
    const segs = [];
    const warnings = [];
    jobs.forEach((j, i) => {
      const dur = takeDurations[i];
      const first = i === 0;
      const last = i === jobs.length - 1;
      const at = first ? 0 : j.start - xfade / 2;
      const until = last ? total : j.end + xfade / 2;
      const need = until - at;
      let rate = 1;
      let play = need;
      if (dur < need) {
        rate = Math.max(1 - maxStretch, dur / need);
        play = Math.min(need, dur / rate);
        if (dur / need < 1 - maxStretch) {
          warnings.push(`${j.id}: take is ${dur.toFixed(2)} s but its window needs ${need.toFixed(2)} s; it ends ${(need - play).toFixed(2)} s early. Regenerate it longer.`);
        } else if (rate < 1) {
          warnings.push(`${j.id}: take is ${(need - dur).toFixed(2)} s short; slowed by ${((1 - rate) * 100).toFixed(1)}% to fill its window.`);
        }
      }
      segs.push({
        id: j.id,
        at,
        play,                       // seconds of output this take covers
        rate,                       // playbackRate (<1 = slower/longer)
        fadeIn: first ? 0.02 : xfade,
        fadeOut: last ? Math.min(opts.endFade ?? 2.5, play) : xfade,
      });
    });
    return { segs, warnings, total, crossfade: xfade };
  }

  // Interleaved PCM WAV (16 or 24 bit) from Float32 channels.
  function encodeWav(channels, sampleRate, bits = 24) {
    const nCh = channels.length;
    const len = channels[0].length;
    const bps = bits / 8;
    const dataBytes = len * nCh * bps;
    const buf = new ArrayBuffer(44 + dataBytes);
    const v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + dataBytes, true); str(8, 'WAVE');
    str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nCh, true);
    v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * nCh * bps, true);
    v.setUint16(32, nCh * bps, true); v.setUint16(34, bits, true);
    str(36, 'data'); v.setUint32(40, dataBytes, true);
    let o = 44;
    const max = bits === 24 ? 8388607 : 32767;
    for (let i = 0; i < len; i++) {
      for (let c = 0; c < nCh; c++) {
        let s = channels[c][i];
        s = s > 1 ? 1 : s < -1 ? -1 : s;
        const q = Math.round(s * max);
        if (bits === 24) { v.setUint8(o, q & 255); v.setUint8(o + 1, (q >> 8) & 255); v.setUint8(o + 2, (q >> 16) & 255); }
        else v.setInt16(o, q, true);
        o += bps;
      }
    }
    return buf;
  }

  // Duration of a WAV from its header, without decoding (handles extra chunks).
  function wavInfo(arrayBuffer) {
    const v = new DataView(arrayBuffer);
    const tag = (o) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
    if (tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;
    let o = 12, fmt = null;
    while (o + 8 <= v.byteLength) {
      const id = tag(o), size = v.getUint32(o + 4, true);
      if (id === 'fmt ') fmt = { channels: v.getUint16(o + 10, true), sampleRate: v.getUint32(o + 12, true), bits: v.getUint16(o + 22, true) };
      if (id === 'data' && fmt) {
        const frames = Math.floor(size / (fmt.channels * fmt.bits / 8));
        return { ...fmt, frames, duration: frames / fmt.sampleRate };
      }
      o += 8 + size + (size & 1);
    }
    return null;
  }

  // Renders the score. buffers: AudioBuffer per job (decoded takes).
  // Returns { channels, sampleRate, frames, peak, gain }.
  async function render(layout, buffers, opts = {}) {
    const sr = opts.sampleRate || 48000;
    const frames = Math.round(layout.total * sr);
    const ctx = new OfflineAudioContext(2, frames, sr);
    layout.segs.forEach((s, i) => {
      const src = ctx.createBufferSource();
      src.buffer = buffers[i];
      src.playbackRate.value = s.rate;
      const g = ctx.createGain();
      const end = s.at + s.play;
      // Equal-power-ish curves via setValueCurveAtTime.
      const curve = (up) => Float32Array.from({ length: 64 }, (_, k) => Math.sin((up ? k : 63 - k) / 63 * Math.PI / 2));
      g.gain.setValueAtTime(s.fadeIn > 0.05 ? 0 : 1, 0);
      if (s.fadeIn > 0.05) g.gain.setValueCurveAtTime(curve(true), s.at, s.fadeIn);
      if (s.fadeOut > 0.05) g.gain.setValueCurveAtTime(curve(false), Math.max(s.at + s.fadeIn, end - s.fadeOut), Math.min(s.fadeOut, s.play - s.fadeIn));
      src.connect(g).connect(ctx.destination);
      src.start(s.at, 0, s.play * s.rate);
    });
    const out = await ctx.startRendering();
    const channels = [out.getChannelData(0), out.getChannelData(1)];
    // Peak-normalise to the target (default -1 dBFS) so Premiere gets a
    // healthy level; the editor sets the bed level on the track.
    let peak = 0;
    for (const ch of channels) for (let i = 0; i < ch.length; i++) { const a = Math.abs(ch[i]); if (a > peak) peak = a; }
    const target = Math.pow(10, (opts.peakDb ?? -1) / 20);
    const gain = peak > 0 ? target / peak : 1;
    if (opts.normalize !== false && peak > 0) for (const ch of channels) for (let i = 0; i < ch.length; i++) ch[i] *= gain;
    return { channels, sampleRate: sr, frames, peak, gain: opts.normalize !== false ? gain : 1 };
  }

  const api = { planLayout, encodeWav, wavInfo, render };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Score = api;
})(typeof window !== 'undefined' ? window : globalThis);
