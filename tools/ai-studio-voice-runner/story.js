// Story mode. A story is voiced as a list of speech blocks, written like this (`---` ends a block):
//
//   Speaker 1 - Charon:
//   Once upon a time, ... and sighed.
//   ---
//
//   Speaker 1 - Erinome:
//   "Look how rich Tashi is! Our bowls are nearly empty."
//   ---
//
// Narration blocks hold the Narrator's words (consecutive paragraphs one per line); every quoted line is
// its own block, quotation marks kept, in its speaker's voice. Blocks come from either
//   - a speech-blocks file (speech-prompts/*-speech-blocks.md, written by /ai-studio-tts), read as is, or
//   - a story file (stories/*.md), whose `## Story` is split into narration and quotes here.
// AI Studio's Gemini 3.8 Flash TTS takes at most two voices per run, so the blocks are packed into
// "parts" (consecutive blocks, at most two voices) and the parts' takes are joined into one story WAV.
// Pure JS so the panel and Node tests share it.
(function (root) {
  const NARRATOR = "Narrator";

  // Voices that never change: the Yeti family sounds the same in every story.
  const FIXED_VOICES = { "Papa Yeti": "Iapetus", "Mama Yeti": "Erinome", "Babu Yeti": "Puck" };
  const DEFAULT_VOICE = "Charon"; // the Narrator and any new speaker start here (Male, informative, lower pitch)

  // The 30 voices Google Flow offers (its Voices panel, 2026-11-14), each also an AI Studio TTS voice by the same
  // name. Only these are used, so a character's saved Flow Character speaks with the voice of its recorded lines.
  const FLOW_VOICES = [
    ["Achernar", "Female", "soft", "high"], ["Achird", "Male", "friendly", "mid"], ["Algenib", "Male", "gravelly", "low"],
    ["Algieba", "Male", "easy-going", "mid-low"], ["Alnilam", "Male", "firm", "mid-low"], ["Aoede", "Female", "breezy", "mid"],
    ["Autonoe", "Female", "bright", "mid"], ["Callirrhoe", "Female", "easy-going", "mid"], ["Charon", "Male", "informative", "lower"],
    ["Despina", "Female", "smooth", "mid"], ["Enceladus", "Male", "breathy", "lower"], ["Erinome", "Female", "clear", "mid"],
    ["Fenrir", "Male", "excitable", "younger"], ["Gacrux", "Female", "mature", "mid"], ["Iapetus", "Male", "clear", "mid-low"],
    ["Kore", "Female", "firm", "mid"], ["Laomedeia", "Female", "upbeat", "mid-high"], ["Leda", "Female", "youthful", "mid-high"],
    ["Orus", "Male", "firm", "mid-low"], ["Puck", "Male", "upbeat", "mid"], ["Pulcherrima", "Ungendered", "forward", "mid"],
    ["Rasalgethi", "Male", "informative", "mid"], ["Sadachbia", "Male", "lively", "low"], ["Sadaltager", "Male", "knowledgeable", "mid"],
    ["Schedar", "Male", "even", "mid-low"], ["Sulafat", "Female", "warm", "mid"], ["Umbriel", "Male", "smooth", "lower"],
    ["Vindemiatrix", "Female", "gentle", "mid"], ["Zephyr", "Female", "bright", "mid-high"], ["Zubenelgenubi", "Male", "casual", "mid-low"],
  ].map(([name, gender, desc, pitch]) => ({ name, gender, desc, pitch, flow: true }));
  const isFlowVoice = name => FLOW_VOICES.some(v => v.name.toLowerCase() === String(name || "").toLowerCase());

  const DEFAULT_STYLES = {
    [NARRATOR]: "Warm, gentle bedtime storyteller reading to children, clear and unhurried",
    "Papa Yeti": "Warm, kind, deep fatherly voice, gentle and sincere",
    "Mama Yeti": "Warm, loving, gentle motherly voice, bright and caring",
    "Babu Yeti": "Small young boy, bright, high, playful childlike voice",
  };
  const CAST_STYLE = "Expressive storybook character voice, clear and lively";

  // Words that start a cast name but say little about who it is ("Blue Magpie" is not "Blue").
  const WEAK = new Set(["Grand", "Blue", "Snow", "Woolly", "Yeti", "Leopard", "Old", "Little", "Big", "The"]);
  const SUBORDINATE = /^(While|As|When|After|Before|Although|Though|Since|Once|If|Until)\b/;
  const HEAD = /^\s*Speaker\s+(\d+)\s*-\s*([^:\n]+?)\s*:\s*$/i;
  const SEP = /^\s*---+\s*$/;

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const slugOf = fileName => fileName.replace(/\.(md|markdown|txt)$/i, "").replace(/-(story|speech-blocks)$/i, "");

  function section(lines, name) {
    const i = lines.findIndex(l => new RegExp(`^##\\s+${name}\\s*$`, "i").test(l.trim()));
    if (i < 0) return null;
    let j = i + 1;
    while (j < lines.length && !/^##\s/.test(lines[j])) j++;
    return lines.slice(i + 1, j);
  }

  function cleanMd(s) {
    return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/(^|\W)[*_](.+?)[*_](?=\W|$)/g, "$1$2")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  }

  const titleOf = (lines, fileName) => cleanMd((lines.find(l => /^#\s/.test(l)) || "# " + fileName).replace(/^#\s+/, ""));

  function aliasesFor(cast) {
    const list = [];
    for (const name of cast) {
      if (name === NARRATOR) continue;
      list.push({ re: new RegExp(`\\b${esc(name)}\\b`, "g"), name });
      const words = name.split(/\s+/);
      for (const w of new Set([words[0], words.at(-1)])) {
        if (words.length > 1 && !WEAK.has(w)) list.push({ re: new RegExp(`\\b${esc(w)}\\b`, "g"), name });
      }
    }
    return list;
  }

  // Earliest cast name in a piece of text, from index `from` on.
  function firstName(text, aliases, from = 0) {
    let best = null;
    for (const a of aliases) {
      a.re.lastIndex = 0;
      let m;
      while ((m = a.re.exec(text))) {
        if (m.index >= from) { if (!best || m.index < best.at) best = { at: m.index, name: a.name }; break; }
      }
    }
    return best?.name || null;
  }

  // The subject of the nearest sentence before a quote that names someone.
  function subjectBefore(text, aliases) {
    const sentences = text.match(/[^.!?]+[.!?]*["”']?/g) || [];
    for (let i = sentences.length - 1; i >= 0; i--) {
      const s = sentences[i].trim();
      if (!s) continue;
      const from = SUBORDINATE.test(s) && s.includes(",") ? s.indexOf(",") : 0;
      const n = firstName(s, aliases, from) || firstName(s, aliases);
      if (n) return n;
    }
    return null;
  }

  const SPEECH_VERB = "said|says|called|cried|gasped|whispered|shouted|asked|replied|sighed|laughed|added|answered|exclaimed|giggled|murmured|called out";
  function tagAfter(text, aliases) {
    const head = text.trim().slice(0, 80);
    const m = head.match(new RegExp(`^(?:${SPEECH_VERB})\\s+(.*)`, "i"));
    if (m) { const n = firstName(m[1].split(/[.,!?]/)[0], aliases); if (n) return n; }
    const m2 = head.match(new RegExp(`^(.{1,40}?)\\s+(?:${SPEECH_VERB})\\b`, "i"));
    if (m2) { const n = firstName(m2[1], aliases); if (n) return n; }
    return null;
  }

  // A delivery hint for a spoken block from the narration around it.
  const HINTS = [
    [/\bgasp/i, "gasping with amazement"],
    [/\bsigh/i, "with a sad little sigh"],
    [/\bwhisper|small voice|softly|quietly/i, "softly, in a small voice"],
    [/\bcall(ed)? |shout|waved down/i, "calling out happily"],
    [/\bafraid|worried|scared/i, "nervous and worried"],
    [/\bstern|narrowed|scowl/i, "stern and commanding"],
    [/\bbeam|smil/i, "warm and happy"],
  ];
  function hintFor(before, after) {
    const near = [(String(before).match(/[^.!?]*[.!?]?\s*$/) || [""])[0], String(after).trim().slice(0, 60)].join(" ");
    for (const [re, h] of HINTS) if (re.test(near)) return h;
    return "";
  }

  // stories/*.md -> { title, cast, lines: [{ id, para, speaker, text, quoted }] }
  function parseStory(md, fileName = "story.md") {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const body = section(lines, "Story");
    if (!body) throw new Error("This is not a story file: it needs a ## Story section.");
    const castLines = section(lines, "Cast") || [];
    const cast = castLines.map(l => (l.match(/^\s*[-*]\s+\*\*(.+?)\*\*/) || [])[1]).filter(Boolean);
    const aliases = aliasesFor(cast);

    const paras = body.join("\n").split(/\n\s*\n/).map(cleanMd).filter(Boolean);
    const out = [];
    let lastSpeaker = null;
    paras.forEach((p, pi) => {
      const re = /“([^”]+)”|"([^"]+)"/g;
      let pos = 0, m, sinceQuote = "", paraSpeaker = null;
      const pieces = [];
      while ((m = re.exec(p))) {
        pieces.push({ kind: "n", text: p.slice(pos, m.index) });
        pieces.push({ kind: "q", text: m[1] ?? m[2] });
        pos = re.lastIndex;
      }
      pieces.push({ kind: "n", text: p.slice(pos) });
      pieces.forEach((pc, k) => {
        if (pc.kind === "n") {
          sinceQuote += pc.text;
          const t = pc.text.trim();
          if (/[A-Za-z0-9]/.test(t)) out.push({ para: pi, speaker: NARRATOR, text: t });
          return;
        }
        const after = pieces[k + 1]?.text || "";
        const speaker = tagAfter(after, aliases) || subjectBefore(sinceQuote, aliases) || paraSpeaker || lastSpeaker || NARRATOR;
        out.push({ para: pi, speaker, text: pc.text.trim(), quoted: true });
        paraSpeaker = lastSpeaker = speaker;
        sinceQuote = "";
      });
    });
    out.forEach((l, i) => { l.id = `L${String(i + 1).padStart(3, "0")}`; });
    const slug = slugOf(fileName);
    return { source: "story", title: titleOf(lines, fileName), cast, lines: out, slug, folder: `speech-takes/${slug}` };
  }

  // Lines -> speech blocks. Consecutive lines of one speaker share a block: the same paragraph joined with
  // a space, a new paragraph on a new line. A quoted line keeps its quotation marks.
  function composeBlocks(lines) {
    const blocks = [];
    for (const l of lines) {
      const text = l.quoted ? `"${l.text}"` : l.text;
      const prev = blocks.at(-1);
      if (prev && prev.speaker === l.speaker) {
        prev.text += (prev.para === l.para ? " " : "\n") + text;
        prev.para = l.para; prev.ids.push(l.id);
      } else blocks.push({ speaker: l.speaker, text, para: l.para, ids: [l.id] });
    }
    return blocks.map((b, i) => ({ id: `B${String(i + 1).padStart(3, "0")}`, speaker: b.speaker, text: b.text, ids: b.ids }));
  }

  // speech-prompts/*-speech-blocks.md (or any text of `Speaker N - Voice:` ... `---` blocks)
  //   -> { title, speakers, blocks: [{ id, speaker, voice, text }], voices, styles }
  // The optional `## Voices` table (| Speaker | Voice | Style |) names who each voice is.
  function parseSpeechBlocks(md, fileName = "speech-blocks.md") {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const voices = {}, styles = {}, byVoice = {};
    const table = section(lines, "Voices") || [];
    for (const row of table.filter(l => /^\s*\|/.test(l))) {
      const c = row.trim().replace(/^\||\|$/g, "").split("|").map(s => s.trim().replace(/^`|`$/g, ""));
      if (!c[0] || /^-+$/.test(c[0]) || /^speaker$/i.test(c[0]) || !c[1]) continue;
      voices[c[0]] = c[1];
      if (c[2]) styles[c[0]] = c[2];
      byVoice[c[1].toLowerCase()] ??= c[0];
    }
    for (const [s, v] of Object.entries(FIXED_VOICES)) byVoice[v.toLowerCase()] ??= s;
    byVoice[DEFAULT_VOICE.toLowerCase()] ??= NARRATOR;
    byVoice.riko ??= NARRATOR; // files voiced before the Flow-only voices used Riko for the Narrator

    const body = section(lines, "Speech blocks") || lines;
    const raw = [];
    let cur = null;
    const close = () => {
      if (!cur) return;
      const text = cur.lines.join("\n").replace(/\n{2,}/g, "\n").trim();
      if (text) raw.push({ voice: cur.voice, text });
      cur = null;
    };
    body.forEach((l, i) => {
      const h = l.match(HEAD);
      if (h) { close(); cur = { voice: h[2].trim(), lines: [] }; return; }
      if (SEP.test(l)) { close(); return; }
      if (cur) cur.lines.push(l.replace(/\s+$/, ""));
      else if (l.trim() && !/^#/.test(l)) throw new Error(`Line ${i + 1} is outside a speech block: every block starts with "Speaker N - Voice:".`);
    });
    close();
    if (!raw.length) throw new Error('No speech blocks found: each block starts with "Speaker N - Voice:" and ends with "---".');
    const blocks = raw.map((b, i) => {
      const speaker = byVoice[b.voice.toLowerCase()] || b.voice;
      voices[speaker] ??= b.voice;
      return { id: `B${String(i + 1).padStart(3, "0")}`, speaker, voice: b.voice, text: b.text, ids: [`B${String(i + 1).padStart(3, "0")}`] };
    });
    const slug = slugOf(fileName);
    const title = titleOf(lines, fileName).replace(/\s*-\s*(AI Studio )?speech blocks$/i, "");
    return { source: "blocks", title, cast: [...new Set(blocks.map(b => b.speaker))], blocks, voices, styles, slug, folder: `speech-takes/${slug}` };
  }

  const isSpeechBlocks = md => md.split(/\r?\n/).some(l => HEAD.test(l));
  const isFixed = s => Object.prototype.hasOwnProperty.call(FIXED_VOICES, s);
  const voiceOf = (speaker, voices) => (isFixed(speaker) ? FIXED_VOICES[speaker] : voices[speaker] || DEFAULT_VOICE);
  const baseStyle = (speaker, styles) => styles[speaker] || DEFAULT_STYLES[speaker] || CAST_STYLE;

  // Each spoken block's style: its speaker's style plus a hint from the narration on either side.
  function stylesFor(blocks, styles) {
    return blocks.map((b, i) => {
      if (b.speaker === NARRATOR) return baseStyle(b.speaker, styles);
      const before = blocks[i - 1]?.speaker === NARRATOR ? blocks[i - 1].text : "";
      const after = blocks[i + 1]?.speaker === NARRATOR ? blocks[i + 1].text : "";
      return [baseStyle(b.speaker, styles), hintFor(before, after)].filter(Boolean).join(", ");
    });
  }

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }

  // Blocks -> parts. A part is one AI Studio run: consecutive blocks, at most two voices, about maxChars
  // of text (a longer single block gets a part of its own). Each part's blocks say which speaker slot
  // (1 or 2) reads them: Speaker 1 is the Narrator's voice when the part has narration.
  function planParts(blocks, { voices = {}, styles = {}, maxChars = 1500 } = {}) {
    const style = stylesFor(blocks, styles);
    const parts = [];
    let cur = null;
    blocks.forEach((b, i) => {
      const v = voiceOf(b.speaker, voices);
      const fits = cur && (cur.voices.has(v) || cur.voices.size < 2) && cur.chars + b.text.length <= maxChars;
      if (!fits) { if (cur) parts.push(cur); cur = { items: [], voices: new Set(), chars: 0 }; }
      cur.items.push({ ...b, voice: v, style: style[i] }); cur.voices.add(v); cur.chars += b.text.length;
    });
    if (cur) parts.push(cur);
    const narr = voiceOf(NARRATOR, voices);
    return parts.map((p, i) => {
      const vs = [...p.voices];
      const slot1 = vs.includes(narr) ? narr : vs[0];
      const slot2 = vs.find(v => v !== slot1) || null;
      const out = p.items.map(b => ({ slot: b.voice === slot1 ? 1 : 2, speaker: b.speaker, style: b.style, text: b.text, id: b.id }));
      const key = hash(JSON.stringify({ b: out.map(({ slot, style, text }) => [slot, style, text]), slot1, slot2 }));
      return { n: i + 1, id: `P${String(i + 1).padStart(2, "0")}`, key, slot1, slot2, chars: p.chars,
        speakers: [...new Set(p.items.map(b => b.speaker))], blocks: out };
    });
  }

  // Blocks in the speech-block format (every block "Speaker 1 - <voice>:", text, "---").
  function speechBlocksText(blocks, voices) {
    return blocks.map(b => `Speaker 1 - ${voiceOf(b.speaker, voices)}:\n${b.text}\n---\n`).join("\n");
  }

  function speechBlocksMarkdown({ title, file, speakers, blocks, voices, styles }) {
    const counts = {};
    for (const b of blocks) counts[b.speaker] = (counts[b.speaker] || 0) + 1;
    return [
      `# ${title} - Speech blocks`, "",
      `Every word of the \`## Story\` section${file ? ` of [${file}](../${file})` : ""}, split into ${blocks.length} AI Studio speech blocks: narration in the Narrator's voice, every quoted line in its own block in its speaker's voice. Load this file in the AI Studio Voice Runner extension (\`tools/ai-studio-voice-runner/\`) to voice the whole story.`, "",
      "## Voices", "",
      "| Speaker | Voice | Style | Blocks |", "| --- | --- | --- | --- |",
      ...speakers.map(s => `| ${s} | ${voiceOf(s, voices)} | ${baseStyle(s, styles)} | ${counts[s] || 0} |`), "",
      "## Speech blocks", "",
      speechBlocksText(blocks, voices),
    ].join("\n");
  }

  const api = { NARRATOR, FIXED_VOICES, DEFAULT_VOICE, FLOW_VOICES, isFlowVoice, DEFAULT_STYLES, CAST_STYLE, parseStory, composeBlocks, parseSpeechBlocks,
    isSpeechBlocks, planParts, stylesFor, voiceOf, baseStyle, isFixed, speechBlocksText, speechBlocksMarkdown };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Story = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
