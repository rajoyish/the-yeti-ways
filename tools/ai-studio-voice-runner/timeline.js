// Audio timeline for a voiced story: where every speech block and sentence sits in the AI Studio takes, and
// the film's master audio laid out so that 10-second Flow clips can be cut against it.
//
// No speech recognition is involved. Each take (one AI Studio run of several speech blocks) is matched to its
// text by its pauses: a take reads at an even pace, and a change of speaker or a sentence end leaves a pause,
// so each boundary between two pieces of text is placed on the pause that best fits the words on either side
// (dynamic programming over the candidate pauses). A one-block take needs no matching at all.
//
// Pure JS (uses Stitch from stitch.js for WAV reading and writing), so Node tools and the extension share it.
(function (root) {
  const Stitch = root.Stitch || (typeof require !== "undefined" ? require("./stitch.js") : null);
  const THR = 0.02;       // a 10 ms frame louder than this (about -34 dBFS) is speech
  const MIN_GAP = 0.12;   // a quieter run at least this long is a pause

  // ---------- Text units ----------
  // A unit is a sentence of narration or one quoted line; boundaries between blocks are "strong".
  function splitSentences(text) {
    return text.split(/\n+/).flatMap(line => line.split(/(?<=[.!?]["”]?)\s+(?=["“]?[A-Z0-9])/)).map(s => s.trim()).filter(Boolean);
  }
  const wordCount = s => (s.match(/[A-Za-z0-9'’-]+/g) || []).length;

  function unitsOf(blocks) {
    const units = [];
    blocks.forEach((b, bi) => {
      const parts = b.speaker === "Narrator" ? splitSentences(b.text) : b.text.split(/\n+/).map(s => s.trim()).filter(Boolean);
      parts.forEach((text, k) => units.push({ block: bi, first: k === 0, text, words: Math.max(1, wordCount(text)) }));
    });
    return units;
  }

  // ---------- Audio analysis ----------
  function envelope(data, rate) {
    const win = Math.max(1, Math.round(rate / 100)), n = Math.ceil(data.length / win), env = new Float32Array(n);
    for (let f = 0; f < n; f++) {
      let pk = 0;
      for (let k = f * win, e = Math.min(data.length, k + win); k < e; k++) { const v = Math.abs(data[k]); if (v > pk) pk = v; }
      env[f] = pk;
    }
    return env;
  }

  // Speech span and the pauses inside it, in seconds.
  function pauses(env, minGap = MIN_GAP) {
    let first = -1, last = -1;
    for (let i = 0; i < env.length; i++) if (env[i] > THR) { if (first < 0) first = i; last = i; }
    if (first < 0) return { first: 0, last: 0, gaps: [] };
    const gaps = [];
    let s = -1;
    for (let i = first; i <= last + 1; i++) {
      const loud = i <= last && env[i] > THR;
      if (!loud && s < 0) s = i;
      if (loud && s >= 0) { if ((i - s) / 100 >= minGap) gaps.push({ start: s / 100, end: i / 100, len: (i - s) / 100 }); s = -1; }
    }
    return { first: first / 100, last: (last + 1) / 100, gaps };
  }

  // ---------- Matching a take to its units ----------
  // Returns units with start/end (seconds in the take) and a confidence note per strong boundary.
  function alignTake(take, units, range) {
    const env = envelope(take.data, take.rate);
    let { first, last, gaps } = pauses(env);
    if (range) {
      // Only part of the take: the units fall between two fixed times (a timing fix splits the take).
      const inR = gaps.filter(g => g.start >= range.from && g.end <= range.to);
      const loud = t => env[Math.min(env.length - 1, Math.max(0, Math.round(t * 100)))] > THR;
      first = range.from; last = range.to;
      // Snap the range ends onto speech.
      while (first < last && !loud(first)) first += 0.01;
      while (last > first && !loud(last - 0.01)) last -= 0.01;
      gaps = inR.filter(g => g.start > first && g.end < last);
    }
    const m = units.length;
    if (m === 1) return { units: [{ ...units[0], start: first, end: last }], first, last, notes: [] };
    const total = units.reduce((a, u) => a + u.words, 0);
    const pausesTotal = gaps.reduce((a, g) => a + g.len, 0);
    const rate = total / Math.max(0.5, last - first - pausesTotal * 0.6);   // words per second of voiced time
    const dur = units.map(u => u.words / rate);                            // expected length of each unit

    // Candidate positions for boundary j (between unit j-1 and unit j), j = 1..m-1.
    const cum = []; let acc = 0;
    for (let j = 0; j < m; j++) { cum.push(acc); acc += units[j].words; }
    const est = j => first + (last - first) * cum[j] / total;
    const cands = [null];
    for (let j = 1; j < m; j++) {
      const e = est(j), win = Math.max(3, (last - first) * 0.18);
      const c = gaps.filter(g => Math.abs((g.start + g.end) / 2 - e) <= win).map(g => ({ ...g, virtual: false }));
      if (!units[j].first || !c.length) c.push({ start: e, end: e, len: 0, virtual: true });
      cands.push(c);
    }
    const sigma = d => 0.45 + 0.22 * d;
    const unitCost = (i, a, b) => { const d = b - a; if (d < 0.15) return 1e9; return ((d - dur[i]) / sigma(dur[i])) ** 2; };
    const gapGain = (j, c) => (c.virtual ? (units[j].first ? 6 : 1.5) : 0) - Math.min(c.len, 1.2) * (units[j].first ? 6 : 2.5);

    // DP over boundaries.
    let prev = cands[1].map(c => ({ cost: unitCost(0, first, c.start) + gapGain(1, c), back: -1 }));
    const table = [null, prev];
    for (let j = 2; j < m; j++) {
      const cur = cands[j].map(c => {
        let best = { cost: Infinity, back: -1 };
        cands[j - 1].forEach((p, pi) => {
          if (p.end > c.start - 0.15) return;
          const v = prev[pi].cost + unitCost(j - 1, p.end, c.start) + gapGain(j, c);
          if (v < best.cost) best = { cost: v, back: pi };
        });
        return best;
      });
      table.push(cur); prev = cur;
    }
    let bi = -1, bc = Infinity;
    prev.forEach((p, i) => { const v = p.cost + unitCost(m - 1, cands[m - 1][i].end, last); if (v < bc) { bc = v; bi = i; } });
    if (bi < 0) throw new Error("Could not match the take to its text.");
    const chosen = new Array(m);
    for (let j = m - 1; j >= 1; j--) { chosen[j] = cands[j][bi]; bi = table[j][bi].back; }
    const out = units.map((u, i) => ({ ...u, start: i === 0 ? first : chosen[i].end, end: i === m - 1 ? last : chosen[i + 1].start }));
    const notes = [];
    for (let j = 1; j < m; j++) if (units[j].first && (chosen[j].virtual || chosen[j].len < 0.25)) notes.push(`block boundary before "${units[j].text.slice(0, 40)}" sits on a short or no pause; check it by ear`);
    return { units: out, first, last, notes };
  }

  // ---------- The film's master audio ----------
  // blocks: [{ id, speaker, voice, text }] in story order. takes: [{ id, wav: ArrayBuffer, blocks: [block indexes] }].
  // A spoken (non-Narrator) block must sit inside one clip with room on both sides, because it is lip-synced on
  // screen; when it would cross a cut, the pause before it is lengthened (at most maxPush seconds) to start it
  // just after the cut. Narration may run across cuts. Nothing is cut, sped up, or slowed down.
  function buildFilm({ blocks, takes, clip = 10, lead = 0.6, tail = 2.0, takeGap = 0.7, maxPush = 2.5, edge = 0.4, pre = 0.04, post = 0.18 }) {
    const notes = [], segs = [];
    let rate = 0;
    for (const t of takes) {
      const w = Stitch.parseWav(t.wav);
      if (!w) throw new Error(`${t.id}: not a 16-bit WAV`);
      rate ||= w.rate;
      if (w.rate !== rate) throw new Error(`${t.id}: sample rate ${w.rate}, expected ${rate}`);
      const tb = t.blocks.map(i => blocks[i]);
      const al = alignTake(w, unitsOf(tb));
      al.notes.forEach(n => notes.push(`${t.id}: ${n}`));
      t.blocks.forEach((bi, k) => {
        const us = al.units.filter(u => u.block === k);
        const s = us[0].start, e = us.at(-1).end;
        const nextUnit = al.units.find(u => u.block === k + 1);
        segs.push({ block: bi, take: t.id, data: w.data, s, e, units: us, gapAfter: nextUnit ? Math.max(0.15, nextUnit.start - e) : takeGap });
      });
    }
    segs.sort((a, b) => a.block - b.block);
    if (segs.length !== blocks.length) throw new Error(`The takes cover ${segs.length} of ${blocks.length} speech blocks.`);

    // Lay the blocks out.
    let t = lead;
    const placed = [];
    segs.forEach((g, i) => {
      const b = blocks[g.block], d = g.e - g.s, spoken = b.speaker !== "Narrator";
      let start = t, pushed = 0, straddle = false;
      if (spoken) {
        const k = Math.floor(start / clip);
        const lo = k * clip + edge, hi = (k + 1) * clip - edge;
        if (start < lo) { pushed = lo - start; start = lo; }
        else if (start + d > hi) {
          const next = (k + 1) * clip + edge;
          if (d <= clip - 2 * edge && next - start <= maxPush) { pushed = next - start; start = next; }
          else straddle = true;
        }
        if (straddle) notes.push(`${b.id} (${b.speaker}) crosses the cut at ${fmt(Math.ceil(start / clip) * clip)}; play its end over a reaction shot, off-screen`);
        else if (pushed > 0.05) notes.push(`${b.id} (${b.speaker}): pause before it lengthened by ${pushed.toFixed(2)} s so the line sits inside one clip`);
      }
      const off = start - g.s;
      placed.push({ ...g, start, end: start + d, off, pushed, straddle });
      t = start + d + g.gapAfter;
    });
    const duration = placed.at(-1).end + tail;
    const N = Math.round(duration * rate), mix = new Float32Array(N);
    const fadeN = Math.round(0.008 * rate);
    for (const p of placed) {
      const a = Math.max(0, Math.round((p.s - pre) * rate)), z = Math.min(p.data.length, Math.round((p.e + post) * rate));
      const at = Math.round((p.start - pre) * rate);
      for (let i = a; i < z; i++) {
        const k = at + (i - a);
        if (k < 0 || k >= N) continue;
        let v = p.data[i];
        if (i - a < fadeN) v *= (i - a) / fadeN;
        if (z - i < fadeN) v *= (z - i) / fadeN;
        mix[k] += v;
      }
    }
    const timeline = {
      duration: +(N / rate).toFixed(3), rate, clipLength: clip, clips: Math.ceil(N / rate / clip),
      blocks: placed.map(p => {
        const b = blocks[p.block];
        return {
          id: b.id, speaker: b.speaker, voice: b.voice || "", kind: b.speaker === "Narrator" ? "narration" : "dialogue",
          start: r2(p.start), end: r2(p.end), take: p.take, pushed: r2(p.pushed), straddle: p.straddle,
          units: p.units.map(u => ({ text: u.text, start: r2(u.start + p.off), end: r2(u.end + p.off) })),
        };
      }),
    };
    timeline.pauses = pauses(envelope(mix, rate), 0.3).gaps.map(g => ({ start: r2(g.start), end: r2(g.end) }));
    return { mix, rate, timeline, notes };
  }

  // The timeline of an existing story WAV (story-full.wav), kept exactly as it is: the whole file is matched to
  // every block at once. A spoken block that crosses a clip cut is marked straddle; its clip plan puts the
  // speaker on screen only where most of the line falls, and the rest plays over a reaction shot.
  // fixes: { <block id>: <start in seconds> } heard by ear; the text on each side is matched again around it.
  function timelineOf({ wav, blocks, clip = 10, fixes = {} }) {
    const w = Stitch.parseWav(wav);
    if (!w) throw new Error("The story audio is not a 16-bit WAV.");
    const units = unitsOf(blocks);
    const duration = w.data.length / w.rate;
    const env = envelope(w.data, w.rate);
    const span = pauses(env);
    const cuts = Object.entries(fixes).map(([id, t]) => ({ bi: blocks.findIndex(b => b.id === id), t: Number(t) }))
      .filter(c => c.bi > 0 && Number.isFinite(c.t)).sort((a, b) => a.t - b.t);
    const aligned = [], notes = [];
    let from = span.first, ui = 0;
    for (const c of [...cuts, { bi: blocks.length, t: span.last + 0.01 }]) {
      const chunk = [];
      while (ui < units.length && units[ui].block < c.bi) chunk.push(units[ui++]);
      if (!chunk.length) continue;
      // The chunk ends at the last speech before the fixed start.
      const al = alignTake(w, chunk, { from, to: c.t - 0.05 });
      aligned.push(...al.units); notes.push(...al.notes);
      from = c.t;
    }
    if (cuts.length) notes.push(`timing fixes applied: ${cuts.map(c => `${blocks[c.bi].id} at ${fmt(c.t)}`).join(", ")}`);
    const al = { units: aligned };
    const out = blocks.map((b, bi) => {
      const us = al.units.filter(u => u.block === bi);
      const start = us[0].start, end = us.at(-1).end, spoken = b.speaker !== "Narrator";
      // Crossing a cut by less than 0.3 s on one side is a fading last (or first) syllable, not a split line:
      // the line stays whole in the clip that holds it, its time clamped to that clip.
      const cut = Math.ceil(start / clip) * clip;
      const straddle = spoken && cut < end && Math.min(cut - start, end - cut) > 0.3;
      if (straddle) notes.push(`${b.id} (${b.speaker}, ${fmt(start)}-${fmt(end)}) crosses the cut at ${fmt(Math.ceil(start / clip) * clip)}: the speaker is on screen where most of the line falls, the rest plays over a reaction shot`);
      return {
        id: b.id, speaker: b.speaker, voice: b.voice || "", kind: spoken ? "dialogue" : "narration",
        start: r2(start), end: r2(end), pushed: 0, straddle,
        units: us.map(u => ({ text: u.text, start: r2(u.start), end: r2(u.end) })),
      };
    });
    const timeline = { duration: +duration.toFixed(3), rate: w.rate, clipLength: clip, clips: Math.ceil(duration / clip), blocks: out };
    timeline.pauses = pauses(envelope(w.data, w.rate), 0.3).gaps.map(g => ({ start: r2(g.start), end: r2(g.end) }));
    return { timeline, notes };
  }

  const FIXED_AUDIO = "Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.";
  const r2 = x => Math.round(x * 100) / 100;
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
  const clock = s => `00:${s.toFixed(1).padStart(4, "0")}`.replace(/\.0$/, "");

  // ---------- Clip plan ----------
  // Splits a unit at a time by its characters (word boundary), for narration that runs across a cut.
  function splitAt(u, t) {
    const words = u.text.split(/\s+/), frac = (t - u.start) / Math.max(0.01, u.end - u.start), total = u.text.length;
    let acc = 0, k = 0;
    for (; k < words.length; k++) { if ((acc + words[k].length / 2) / total >= frac) break; acc += words[k].length + 1; }
    return [words.slice(0, k).join(" "), words.slice(k).join(" ")];
  }

  // Every clip's speech on its own 00:00-00:10 clock, and the pauses a shot can cut on.
  function clipPlan(timeline) {
    const L = timeline.clipLength, clips = [];
    for (let k = 0; k < timeline.clips; k++) {
      const a = k * L, z = a + L, entries = [];
      for (const b0 of timeline.blocks) {
        let b = b0;
        if (b.kind === "dialogue" && !b.straddle) {
          // A spoken line that is not split belongs wholly to the clip holding most of it.
          const home = Math.floor(((b.start + b.end) / 2) / L);
          if (home !== k) continue;
          b = { ...b, units: b.units.map(u => ({ ...u, start: Math.max(u.start, a), end: Math.min(u.end, z) })) };
        }
        if (b.end <= a || b.start >= z) continue;
        let cur = null;
        for (const u of b.units) {
          if (u.end <= a || u.start >= z) continue;
          let text = u.text, s = u.start, e = u.end, cont = "";
          if (s < a) { const [, rest] = splitAt(u, a); text = rest; s = a; cont = "continues"; }
          if (e > z) { const [head] = splitAt({ ...u, text, start: s }, z); text = head; e = z; cont = cont ? "continues, runs on" : "runs on"; }
          if (b.kind === "dialogue") text = text.replace(/["“”]/g, "").trim();
          if (!text) continue;
          {
            // One entry per sentence: each is a beat the picture enacts at its own time.
            // A line crossing the cut is lip-synced only in the clip that holds most of it.
            const share = (Math.min(b.end, z) - Math.max(b.start, a)) / Math.max(0.01, b.end - b.start);
            const mode = b.kind === "narration" ? "off-screen" : !b.straddle || share >= 0.5 ? "on screen" : "off-screen";
            cur = { block: b.id, speaker: b.speaker, kind: b.kind, mode, start: s - a, end: e - a, text, cont, straddle: b.straddle };
            entries.push(cur);
          }
        }
      }
      const cuts = timeline.pauses.filter(p => p.start > a + 0.8 && p.end < z - 0.8).map(p => r2((p.start + p.end) / 2 - a));
      clips.push({ n: k + 1, start: a, end: Math.min(z, timeline.duration), entries, cuts, last: k === timeline.clips - 1 });
    }
    return clips;
  }

  function speechLine(c) {
    return c.entries.map(e => {
      const how = e.kind === "narration" ? "off-screen" : e.mode === "on screen" ? "on screen" : "off-screen, over a reaction shot";
      const cont = e.cont ? `, ${e.cont.replace("continues", "continuing from the last clip").replace("runs on", "running on into the next clip")}` : "";
      return `${clock(e.start)}-${clock(e.end)}, ${e.speaker}, ${how}${cont}: "${e.text}"`;
    }).join(" ");
  }

  function planMarkdown({ title, slug, timeline, plan, notes, audioDir }) {
    const out = [
      `# ${title} - Film timeline`, "",
      `The audio clock for the film, built from the AI Studio audio by \`tools/ai-studio-voice-runner/film-audio.mjs\`. The master audio \`${timeline.master}\` (in \`${audioDir}\`) is ${fmt(timeline.duration)} long, so the film is ${timeline.clips} clips of ${timeline.clipLength} seconds, the last trimmed to ${(timeline.duration - (timeline.clips - 1) * timeline.clipLength).toFixed(1)} s in the edit. Every word below is at its exact time in that audio; \`clips/clip-NN.wav\` is each clip's slice. \`/story-to-storyboard\` writes one Agent prompt per clip from this plan.`, "",
    ];
    if (notes.length) out.push("## Notes", "", ...notes.map(n => `- ${n}`), "");
    const spoken = timeline.blocks.filter(b => b.kind === "dialogue");
    if (spoken.length) {
      out.push("## Line check", "",
        "Lip sync depends on these times. Listen to each file (in the audio folder): it must hold exactly this line, first word to last, in this speaker's voice. If one is wrong, write the line's true start in seconds of the master into `speech-prompts/<slug>-timing-fixes.json` (`{ \"B029\": 370.69 }`), run `film-audio.mjs` again, and listen again.", "",
        "| Block | Speaker | Film time | Clip | Line | File |", "| --- | --- | --- | --- | --- | --- |",
        ...spoken.map(b => `| ${b.id} | ${b.speaker} | ${fmt(b.start)}-${fmt(b.end)} | ${Math.floor(b.start / timeline.clipLength) + 1}${b.straddle ? ` and ${Math.floor(b.start / timeline.clipLength) + 2}` : ""} | ${b.units.map(u => u.text).join(" ")} | \`${b.check || ""}\` |`), "");
    }
    // The film's Script table, row for row as the storyboard's ## Script (check_speech.mjs --timeline compares them).
    const film = (n, s) => fmt((n - 1) * timeline.clipLength + Number(clock(s).slice(3)));
    out.push("## Script", "", "Copy into the storyboard's `## Script` section as it is.", "",
      "| Video | Clip time | Film time | Speaker | Line |", "| --- | --- | --- | --- | --- |",
      ...plan.flatMap(c => c.entries.map(e => `| ${c.n} | ${clock(e.start)}-${clock(e.end)} | ${film(c.n, e.start)}-${film(c.n, e.end)} | ${e.speaker} | "${e.text}" |`)), "");
    out.push("## Clips", "", "Each `Speech:` line is copy-ready for that video's Agent prompt, fixed sentence included.", "");
    for (const c of plan) {
      out.push(`### Clip ${c.n} - ${fmt(c.start)} to ${fmt(c.end)}`, "");
      out.push(c.entries.length ? `Speech: ${speechLine(c)} ${FIXED_AUDIO}` : "Speech: none.", "");
      out.push(`Cut points (pauses): ${c.cuts.length ? c.cuts.map(x => clock(x)).join(", ") : "none"}${c.last ? `. Speech ends at ${clock(Math.max(0, ...c.entries.map(e => e.end)))}; the clip is trimmed at ${clock(c.end - c.start)}.` : "."}`, "");
    }
    return out.join("\n");
  }

  const api = { splitSentences, unitsOf, envelope, pauses, alignTake, buildFilm, timelineOf, clipPlan, speechLine, planMarkdown, fmt, clock };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Timeline = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
