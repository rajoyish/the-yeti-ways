// Score plan: reads a Flow Music guide (music-prompts/*-flow-music.md) and
// turns its Method B movements plus its SFX & Foley cue table into one
// Compose job per movement. Each job's Sound prompt carries the movement's
// music AND the ambience and sound effects of the videos inside its window,
// so Flow Music renders music and effects combined, with no voices.
//
// Works in the side panel (window.ScorePlan) and in Node (module.exports).
(function (root) {
  'use strict';

  const SOUND_MAX = 3000;       // Compose "Sound description" maxLength
  const LENGTH_MAX = 180;       // Compose "Length" clamps at 3:00
  const LENGTH_MIN = 10;

  // Effects that read as a voice. Removed so the bed stays voice-free.
  const VOCAL_WORDS = /\b(voice|voices|sigh|sighs|breath|breathing|exhal\w*|inhal\w*|intake|sniff\w*|hum|humming|laugh\w*|giggl\w*|gasp\w*|speech|spoken|singing|sing|chant\w*|whisper\w*|murmur\w*|cry|crying)\b/i;

  const toSec = (t) => {
    const m = String(t).trim().match(/^(\d+):(\d+(?:\.\d+)?)$/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
  };
  const mmss = (s) => {
    const r = Math.max(0, Math.round(s));
    return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`;
  };

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // "Movement 1: Title" blocks with Film Window, Meter & Tempo, Sound Box Prompt.
  function parseMovements(md) {
    const out = [];
    const re = /^###\s+Movement\s+(\d+)\s*:\s*(.+)$/gm;
    const heads = [];
    let m;
    while ((m = re.exec(md))) heads.push({ n: Number(m[1]), title: m[2].trim(), at: m.index, end: re.lastIndex });
    heads.forEach((h, i) => {
      const body = md.slice(h.end, i + 1 < heads.length ? heads[i + 1].at : md.length);
      const win = body.match(/Film Window:\**\s*`?\s*([\d:.]+)\s*[–-]\s*([\d:.]+)\s*`?/);
      const tempo = body.match(/Meter & Tempo:\**\s*(.+)/);
      const code = body.match(/Sound Box Prompt:\**\s*\n\s*```(?:text)?\n([\s\S]*?)\n\s*```/);
      if (!win || !code) return;
      const start = toSec(win[1]);
      const end = toSec(win[2]);
      const bpm = tempo ? (tempo[1].match(/(\d{2,3})\s*BPM/i) || [])[1] : undefined;
      const prompt = code[1].split('\n').map((l) => l.trim()).join('\n').trim();
      out.push({ n: h.n, title: h.title, start, end, bpm: bpm ? Number(bpm) : undefined, tempo: tempo ? tempo[1].trim() : '', prompt });
    });
    return out.sort((a, b) => a.start - b.start);
  }

  // | **V01** | `00:00 - 00:10` | Title | Ambience | Foley |
  function parseCues(md) {
    const cues = [];
    for (const line of md.split('\n')) {
      const c = line.split('|').map((x) => x.trim());
      if (c.length < 7) continue;
      const v = c[1].match(/V(\d+)/);
      const t = c[2].match(/([\d:.]+)\s*-\s*([\d:.]+)/);
      if (!v || !t) continue;
      cues.push({ video: Number(v[1]), start: toSec(t[1]), end: toSec(t[2]), title: c[3], ambience: c[4], foley: c[5] });
    }
    return cues;
  }

  // Keeps only the clauses of an effect that are not vocal.
  function cleanFx(text) {
    return String(text || '')
      .replace(/[*`]/g, '')
      .split(/\s*[;,]\s*/)
      .filter((p) => p && !VOCAL_WORDS.test(p))
      .join(', ')
      .replace(/\bpaws?\/hands\b/gi, 'hands')
      .trim();
  }

  // Effects for one movement, in movement-relative time. Consecutive videos
  // with the same ambience are merged. level 0 = full, 1 = foley shortened,
  // 2 = ambience only.
  function fxLines(cues, start, end, level) {
    const inWin = cues.filter((c) => c.start >= start - 0.01 && c.start < end - 0.01);
    const lines = [];
    let prevAmb = '';
    for (const c of inWin) {
      const amb = cleanFx(c.ambience);
      let foley = cleanFx(c.foley);
      if (level >= 1) foley = foley.split(', ')[0];
      if (level >= 2) foley = '';
      const parts = [];
      if (amb && amb !== prevAmb) parts.push(amb);
      if (foley) parts.push(foley);
      prevAmb = amb || prevAmb;
      if (!parts.length) continue;
      lines.push(`${mmss(c.start - start)} ${parts.join('; ')}`);
    }
    return lines;
  }

  const HEAD = 'PURE INSTRUMENTAL SCORE WITH SOUND EFFECTS. No vocals, no singing, no humming, no choir, no chants, no spoken words, no voices of any kind.';
  const MIX = 'Mix: a soft background bed for a narrated children\'s film; music and sound effects blended together, effects subtle and natural, leaving room for a narrator\'s voice (keep 1-4 kHz gentle).';

  function buildSound(mv, cues, overlap, level) {
    const total = mv.end - mv.start + overlap;
    const fx = fxLines(cues, mv.start, mv.end, level);
    const ending = overlap > 0
      ? `Keep playing to ${mmss(total)} without a final ending; the last ${Math.round(overlap)} seconds carry the mood on so it can crossfade into the next movement.`
      : `Resolve gently and fade out completely at ${mmss(total)}.`;
    return [
      HEAD,
      mv.prompt.replace(/^\[Style:[^\]]*\]\s*/i, ''),
      fx.length ? `Sound effects and ambience woven into the mix at these times (no voices):\n${fx.join('\n')}` : '',
      ending,
      MIX,
    ].filter(Boolean).join('\n\n');
  }

  // Builds the Compose jobs. opts.duration (seconds) is the reference voice
  // track's exact length; the last movement absorbs any difference from the
  // guide's windows. opts.overlap = crossfade seconds between movements.
  function buildPlan(md, opts = {}) {
    const overlap = opts.overlap ?? 4;
    const movements = parseMovements(md);
    if (!movements.length) throw new Error('No "### Movement N:" sections with a Film Window and Sound Box Prompt were found.');
    const cues = parseCues(md);
    const titleMatch = md.match(/^#\s+(.+?)(?:\s+—|\s+-\s|$)/m);
    const film = titleMatch ? titleMatch[1].trim() : 'Flow Music Score';
    const duration = opts.duration || movements[movements.length - 1].end;
    // Rebase so the windows run 0..duration with no gaps.
    movements[0].start = 0;
    for (let i = 1; i < movements.length; i++) movements[i].start = movements[i - 1].end;
    movements[movements.length - 1].end = duration;

    const jobs = movements.map((mv, i) => {
      const last = i === movements.length - 1;
      const ov = last ? 0 : overlap;
      const slot = mv.end - mv.start;
      let level = 0;
      let sound = buildSound(mv, cues, ov, level);
      while (sound.length > SOUND_MAX && level < 2) sound = buildSound(mv, cues, ov, ++level);
      if (sound.length > SOUND_MAX) sound = sound.slice(0, SOUND_MAX - 1).replace(/\s+\S*$/, '');
      // Ask for a little extra at the end of the last one too, so the fit
      // never has to stretch; the tail is cut with a fade.
      const want = Math.min(LENGTH_MAX, Math.max(LENGTH_MIN, Math.ceil(slot + ov + (last ? 2 : 0))));
      return {
        id: `m${String(mv.n).padStart(2, '0')}`,
        n: mv.n,
        title: `${film} — M${mv.n} ${mv.title}`.slice(0, 100),
        name: mv.title,
        start: mv.start,
        end: mv.end,
        slot,
        overlap: ov,
        length: mmss(want),
        lengthSec: want,
        bpm: mv.bpm,
        sound,
        fxLevel: level,
        warnings: slot + ov > LENGTH_MAX ? [`Window is ${slot.toFixed(1)} s; Flow Music makes at most 3:00. Split this movement.`] : [],
      };
    });
    return { film, slug: slug(film), duration, overlap, jobs, cues: cues.length };
  }

  const api = { buildPlan, parseMovements, parseCues, cleanFx, toSec, mmss, SOUND_MAX, LENGTH_MAX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ScorePlan = api;
})(typeof window !== 'undefined' ? window : globalThis);
