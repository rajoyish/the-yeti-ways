// Score plan: reads a Flow Music guide (music-prompts/*-flow-music.md) and
// turns its movements and its cue sheet into one Compose job per movement
// for one LAYER of the film's soundtrack. Each layer is made separately and
// built to the exact length of the reference voice track:
//
//   music     Score & soundtrack: the movement's Sound Box Prompt, music only
//   ambience  Atmosphere: the cue sheet's Ambience column, a continuous bed
//   foley     Character-performed sounds: the cue sheet's Foley column
//   sfx       Spot / hard sound effects: the cue sheet's Sound Effects column
//   mix       Legacy: music with every effect woven into one take
//
// Cue sheet rows: | **V01** | `00:00 - 00:10` | Title | Ambience | Foley | Sound Effects |
// A legacy 5-column sheet (| Ambience | Foley |) is still read: its foley
// clauses are sorted into foley or sound effects by keyword.
//
// Works in the side panel (window.ScorePlan) and in Node (module.exports).
(function (root) {
  'use strict';

  const SOUND_MAX = 3000;       // Compose "Sound description" maxLength
  const LENGTH_MAX = 180;       // Compose "Length" clamps at 3:00
  const LENGTH_MIN = 10;

  // Effects that read as a voice. Removed so every layer stays voice-free.
  const VOCAL_WORDS = /\b(voice|voices|sigh|sighs|breath|breathing|exhal\w*|inhal\w*|intake|sniff\w*|hum|humming|laugh\w*|giggl\w*|gasp\w*|speech|spoken|singing|sing|chant\w*|whisper\w*|murmur\w*|cry|crying)\b/i;

  // Legacy sheets: a foley clause about a body, clothes, or a handled prop
  // is foley; anything else in that column is a spot sound effect.
  const FOLEY_WORDS = /\b(foot|feet|footsteps?|steps?|stride|patter|hop\w*|thud\w* of|walk\w*|run\w*|sprint\w*|scuttl\w*|rustl\w*|cloth|robes?|vest|silk|fur|feathers?|wings? (?:rustl|flutter)|hands?|palm|paws?|claws?|grip\w*|clasp\w*|knee|kneel\w*|bow|sit\w*|pour\w*|scoop\w*|slid\w*|lift\w*|set down|placed?|polish\w*|rub\w*|frictio\w*|unty\w*|untie\w*|knots?|twine|spade|dig\w*|clink\w*|coins?|bowls?|cups?|lid|latch|tap\w*|pressing|tuck\w*|drap\w*|chain|necklace|bundle|sack)\b/i;

  const LAYERS = {
    music: { key: 'm', tag: 'Music', out: 'music-score', label: 'Music (score & soundtrack)' },
    ambience: { key: 'a', tag: 'Ambience', out: 'ambience', label: 'Ambience (atmosphere)' },
    foley: { key: 'f', tag: 'Foley', out: 'foley', label: 'Foley' },
    sfx: { key: 's', tag: 'SFX', out: 'sfx', label: 'Sound effects' },
    mix: { key: 'm', tag: '', out: 'music-sfx-bed', label: 'Music + all effects (one mix)' },
  };
  const STEMS = ['music', 'ambience', 'foley', 'sfx'];

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

  // Splits a cue cell into sounds on ";" and ",", but keeps a comma that
  // joins adjectives ("Fastidious, rhythmic claw-taps", "quick, light
  // footsteps") inside one sound.
  const ADJ_END = /\b(quick|light|soft|sharp|crisp|heavy|gentle|small|loud|bright|dry|deep|brisk|rhythmic|muffled|delicate|faint|fastidious|hurried|smooth|warm|long|slow|tiny|big|clear|commanding|hollow|dazzling|glittering|sparkling|shimmering)$/i;
  function clauses(t) {
    const out = [];
    for (const part of String(t || '').replace(/[*`]/g, '').split(/\s*;\s*/)) {
      let buf = '';
      for (const piece of part.split(/\s*,\s*/).map((x) => x.trim()).filter(Boolean)) {
        buf = buf ? `${buf}, ${piece}` : piece;
        if (piece.split(/\s+/).length <= 2 && ADJ_END.test(piece)) continue;
        if (ADJ_END.test(piece)) continue;
        out.push(buf);
        buf = '';
      }
      if (buf) out.push(buf);
    }
    // "—", "-", "none", "n/a" mark an empty cell.
    return out.filter((x) => !/^(?:[—–-]+|none|n\/a|nil)$/i.test(x));
  }

  // | **V01** | `00:00 - 00:10` | Title | Ambience | Foley | Sound Effects |
  function parseCues(md) {
    const cues = [];
    for (const line of md.split('\n')) {
      const c = line.split('|').map((x) => x.trim());
      if (c.length < 7) continue;
      const v = c[1].match(/V(\d+)/);
      const t = c[2].match(/([\d:.]+)\s*-\s*([\d:.]+)/);
      if (!v || !t) continue;
      const row = { video: Number(v[1]), start: toSec(t[1]), end: toSec(t[2]), title: c[3], ambience: c[4], foley: c[5], sfx: '', legacy: false };
      if (c.length >= 8) row.sfx = c[6];
      else {
        // Legacy 5-column sheet: sort the foley column.
        const parts = clauses(c[5]);
        row.foley = parts.filter((p) => FOLEY_WORDS.test(p)).join(', ');
        row.sfx = parts.filter((p) => !FOLEY_WORDS.test(p)).join(', ');
        row.legacy = true;
      }
      cues.push(row);
    }
    return cues;
  }

  // Keeps only the clauses of an effect that are not vocal.
  function cleanFx(text) {
    return clauses(text)
      .filter((p) => !VOCAL_WORDS.test(p))
      .join(', ')
      .replace(/\bpaws?\/hands\b/gi, 'hands')
      .trim();
  }

  // Timed lines for one movement, in movement-relative time.
  // level 0 = every clause, 1 = first clause per video, 2 = layer-specific minimum.
  function cueLines(cues, start, end, layer, level) {
    const inWin = cues.filter((c) => c.start >= start - 0.01 && c.start < end - 0.01);
    const lines = [];
    let prevAmb = '';
    for (const c of inWin) {
      const amb = cleanFx(c.ambience);
      let foley = cleanFx(c.foley);
      let sfx = cleanFx(c.sfx);
      if (level >= 1) { foley = foley.split(', ')[0]; sfx = sfx.split(', ')[0]; }
      const parts = [];
      if (layer === 'ambience') {
        if (amb && amb !== prevAmb) parts.push(amb);
      } else if (layer === 'foley') {
        if (foley) parts.push(foley);
      } else if (layer === 'sfx') {
        if (sfx) parts.push(sfx);
      } else {
        // mix
        if (amb && amb !== prevAmb) parts.push(amb);
        if (level < 2) { if (foley) parts.push(foley); if (sfx) parts.push(sfx); }
      }
      prevAmb = amb || prevAmb;
      if (parts.length) lines.push(`${mmss(c.start - start)} ${parts.join('; ')}`);
    }
    return lines;
  }

  const NO_VOICE = 'No vocals, no singing, no humming, no choir, no chants, no spoken words, no voices of any kind.';
  const NO_MUSIC = 'NO MUSIC: no instruments, no melody, no chords, no rhythm, no drums, no pads, no drones, no score.';
  const ROOM = 'It sits under a narrated children\'s film, so keep it natural and leave room for a narrator\'s voice (keep 1-4 kHz gentle).';

  function ending(layer, overlap, total) {
    if (layer === 'music' || layer === 'mix') {
      return overlap > 0
        ? `Keep playing to ${mmss(total)} without a final ending; the last ${Math.round(overlap)} seconds carry the mood on so it can crossfade into the next movement.`
        : `Resolve gently and fade out completely at ${mmss(total)}.`;
    }
    return overlap > 0 ? `Keep going to ${mmss(total)}; do not fade out.` : `Settle and fade out at ${mmss(total)}.`;
  }

  function buildSound(layer, mv, cues, overlap, level, extra = 0) {
    const total = mv.end - mv.start + overlap + extra;
    const music = mv.prompt.replace(/^\[Style:[^\]]*\]\s*/i, '');
    const lines = cueLines(cues, mv.start, mv.end, layer, level);
    const timed = lines.join('\n');
    switch (layer) {
      case 'music':
        return [
          `PURE INSTRUMENTAL MUSIC ONLY: score and soundtrack. No sound effects, no ambience, no nature sounds, no foley. ${NO_VOICE}`,
          music,
          ending(layer, overlap, total),
          `Mix: a soft score bed. ${ROOM}`,
        ].join('\n\n');
      case 'ambience':
        return [
          `AMBIENCE AND ATMOSPHERE ONLY. ${NO_MUSIC} No footsteps, no foley, no spot sound effects. ${NO_VOICE}`,
          `Continuous background atmosphere for "${mv.title}", changing at these times:\n${timed || '0:00 quiet natural outdoor air'}`,
          'A steady, seamless, natural bed, like a clean field recording of each place. Each change blends smoothly over two or three seconds; it never drops to silence.',
          ending(layer, overlap, total),
          ROOM,
        ].join('\n\n');
      case 'foley':
        return [
          `FOLEY ONLY. ${NO_MUSIC} No background ambience: no wind, no birds, no crickets, no room tone. No spot sound effects. ${NO_VOICE}`,
          `Close, dry, studio-recorded foley performed in sync with the on-screen action, at these times:\n${timed}`,
          'Clean silence between the sounds; each one short, natural, and clear, at a realistic level.',
          ending(layer, overlap, total),
        ].join('\n\n');
      case 'sfx':
        return [
          `SPOT SOUND EFFECTS ONLY. ${NO_MUSIC} No background ambience, no footsteps or foley. ${NO_VOICE}`,
          `Distinct film sound effects at these times:\n${timed}`,
          'Clean silence between the effects; each one clear, natural, and well defined.',
          ending(layer, overlap, total),
        ].join('\n\n');
      default:
        return [
          `PURE INSTRUMENTAL SCORE WITH SOUND EFFECTS. ${NO_VOICE}`,
          music,
          lines.length ? `Sound effects and ambience woven into the mix at these times (no voices):\n${timed}` : '',
          ending('mix', overlap, total),
          `Mix: a soft background bed; music and sound effects blended together, effects subtle and natural. ${ROOM}`,
        ].filter(Boolean).join('\n\n');
    }
  }

  // Builds the Compose jobs for one layer. opts.duration (seconds) is the
  // reference voice track's exact length; the last movement absorbs any
  // difference from the guide's windows. opts.overlap = crossfade seconds + 1.
  function buildPlan(md, opts = {}) {
    const overlap = opts.overlap ?? 4;
    const layer = LAYERS[opts.layer] ? opts.layer : 'mix';
    const L = LAYERS[layer];
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
    // Effects layers come back further from the asked length than music,
    // so they ask for more headroom (trimmed off in the build).
    const headroom = layer === 'music' || layer === 'mix' ? 0 : 8;

    const jobs = movements.map((mv, i) => {
      const last = i === movements.length - 1;
      const ov = last ? 0 : overlap;
      const slot = mv.end - mv.start;
      const id = `${L.key}${String(mv.n).padStart(2, '0')}`;
      // opts.extra[id]: more seconds for a retake of a take that came back short.
      const room = headroom + (opts.extra?.[id] || 0);
      let level = 0;
      let sound = buildSound(layer, mv, cues, ov, level, room);
      while (sound.length > SOUND_MAX && level < 2) sound = buildSound(layer, mv, cues, ov, ++level, room);
      if (sound.length > SOUND_MAX) sound = sound.slice(0, SOUND_MAX - 1).replace(/\s+\S*$/, '');
      const want = Math.min(LENGTH_MAX, Math.max(LENGTH_MIN, Math.ceil(slot + ov + (last ? 2 : 0) + room)));
      return {
        id,
        n: mv.n,
        layer,
        title: `${film} — ${L.tag ? L.tag + ' ' : ''}M${mv.n} ${mv.title}`.slice(0, 100),
        name: mv.title,
        start: mv.start,
        end: mv.end,
        slot,
        overlap: ov,
        length: mmss(want),
        lengthSec: want,
        bpm: layer === 'music' || layer === 'mix' ? mv.bpm : undefined,
        sound,
        fxLevel: level,
        // No cues for this stem in this window: nothing is generated and the
        // build puts silence there.
        empty: layer !== 'music' && layer !== 'mix' && cueLines(cues, mv.start, mv.end, layer, 0).length === 0,
        warnings: slot + ov > LENGTH_MAX ? [`Window is ${slot.toFixed(1)} s; Flow Music makes at most 3:00. Split this movement.`] : [],
      };
    });
    return {
      film,
      slug: slug(film),
      layer,
      layerLabel: L.label,
      outName: L.out,
      duration,
      overlap,
      jobs,
      cues: cues.length,
      legacyCues: cues.some((c) => c.legacy),
    };
  }

  const api = { buildPlan, parseMovements, parseCues, cleanFx, toSec, mmss, LAYERS, STEMS, SOUND_MAX, LENGTH_MAX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ScorePlan = api;
})(typeof window !== 'undefined' ? window : globalThis);
