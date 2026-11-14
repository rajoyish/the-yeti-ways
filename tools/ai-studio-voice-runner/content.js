// Runs inside https://aistudio.google.com (Playground > generate-speech).
// Two jobs:
//   generate       one block per take (speech-guide cues): voice, style, text, Run, footer audio.
//   generateStory  a whole story part in one Run: many speech blocks, each with its own speaker
//                  slot (Speaker 1 / Speaker 2) and style, the two slots' voices set once.
//   listVoices     every voice in the voice picker, with description, pitch, and gender.
// Selectors were read from the live page on 2026-11-14; if AI Studio changes, update them here.
(() => {
  if (window.__aiStudioVoiceRunner2) return;
  window.__aiStudioVoiceRunner2 = true;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vis = e => !!e && e.getBoundingClientRect().width > 0;
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  async function waitFor(fn, ms = 5000, step = 100) {
    const t = Date.now();
    while (Date.now() - t < ms) {
      const v = fn();
      if (v) return v;
      await sleep(step);
    }
    return null;
  }

  // Angular listens for input events; set the value through the native setter so it notices.
  function setValue(el, v) {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const blocks = () => $$("ms-speech-block");
  const runButton = () => $$("ms-run-button button").find(vis) || null;
  const isRunning = () => /\bstop\b/i.test(runButton()?.innerText || "");
  const footerAudio = () => document.querySelector("ms-audio-footer audio");
  const audioSrc = () => { const a = footerAudio(); return a ? (a.currentSrc || a.src || "") : ""; };
  const isTake = s => s.startsWith("data:audio");
  // A take streams to the speakers first; the footer's full WAV appears only when that playback ends.
  const isPlaying = () => {
    const b = document.querySelector("ms-audio-footer .play-pause-button");
    return !!b && /pause/i.test(`${b.getAttribute("aria-label") || ""} ${b.innerText}`);
  };
  const chipLabel = block => (block.querySelector(".voice-chip-label")?.innerText || "").trim();
  const slotOf = block => Number((chipLabel(block).match(/Speaker\s*(\d)/i) || [])[1] || 1);
  const textArea = block => block.querySelector('textarea[aria-label="Speech block text"]');

  function pageError() {
    const t = $$("mat-snack-bar-container, .mat-mdc-snack-bar-container, [role=alert], .error-message, ms-error-message")
      .filter(vis).map(e => e.innerText.replace(/\s+/g, " ").trim()).filter(Boolean).join(" | ");
    return t ? `AI Studio says: ${t}` : "";
  }

  async function closeOverlays() {
    for (let i = 0; i < 3; i++) {
      const bd = $$(".cdk-overlay-backdrop").find(vis);
      if (!bd) break;
      bd.click();
      await sleep(250);
    }
  }

  async function closePanels() {
    for (const b of $$('button[aria-label="Close panel"]').filter(vis)) { b.click(); await sleep(400); }
  }

  // ---------- Speech blocks ----------
  async function addBlock() {
    const n = blocks().length;
    const add = $$("button").find(b => vis(b) && /add speech block/i.test(b.innerText));
    if (!add) throw new Error("No Add speech block button. Open The Master Storyteller (or Create new dialog) in generate-speech first.");
    add.click();
    if (!(await waitFor(() => blocks().length > n, 3000))) throw new Error("Add speech block did not add a block.");
  }

  async function deleteBlock(i) {
    const n = blocks().length;
    const del = blocks()[i]?.querySelector('button[aria-label="Delete speech block"]');
    if (!del) throw new Error("A speech block has no delete button.");
    del.click();
    if (!(await waitFor(() => blocks().length < n, 3000))) throw new Error("Could not delete a speech block.");
  }

  // Run merges every block into one transcript with one style, so each cue take uses exactly one block.
  async function singleBlock() {
    if (!blocks().length) await addBlock();
    while (blocks().length > 1) await deleteBlock(blocks().length - 1);
    return blocks()[0];
  }

  // Leave exactly slots.length blocks whose speakers read slots (e.g. [1, 2, 1, 1]). AI Studio gives a new
  // block the other speaker from the last block, and deleting a block keeps every other block's speaker,
  // so a block on the wrong speaker is replaced by deleting it (after adding one at the end if needed).
  async function arrangeBlocks(slots) {
    if (!blocks().length) await addBlock();
    let guard = slots.length * 6 + 40;
    for (let i = 0; i < slots.length; i++) {
      for (;;) {
        if (--guard < 0) throw new Error("Could not arrange the speech blocks into the Speaker 1 / Speaker 2 order. Start a new Create new dialog session and try again.");
        if (i >= blocks().length) { await addBlock(); continue; }
        if (slotOf(blocks()[i]) === slots[i]) break;
        if (i === blocks().length - 1) await addBlock();
        await deleteBlock(i);
      }
    }
    while (blocks().length > slots.length) await deleteBlock(blocks().length - 1);
    const got = blocks().map(slotOf).join("");
    if (got !== slots.join("")) throw new Error(`The speech blocks read ${got}, not ${slots.join("")}.`);
  }

  function voiceOf(block) {
    return chipLabel(block).replace(/^Speaker\s*\d+\s*-\s*/i, "").trim();
  }

  async function openPicker(block) {
    await closePanels();
    block.querySelector(".voice-chip").click();
    const search = await waitFor(() => $$('input[aria-label="Search voices"]').find(vis), 5000);
    if (!search) throw new Error("The voice picker did not open.");
    return search;
  }

  // Sets the voice of the block's speaker (Speaker 1 or 2): every block of that speaker changes with it.
  async function setVoice(block, name) {
    if (voiceOf(block).toLowerCase() === name.toLowerCase()) return;
    const search = await openPicker(block);
    setValue(search, name);
    const btn = await waitFor(() => $$("ms-voice-library button.voice-card-content").find(b => vis(b) && (b.getAttribute("aria-label") || "").replace(/\s*\(Current\)\s*$/i, "").toLowerCase() === name.toLowerCase()), 6000);
    if (!btn) { setValue(search, ""); await closePanels(); throw new Error(`Voice "${name}" was not found in AI Studio's voice list.`); }
    btn.click();
    await sleep(600);
    await closePanels();
    if (!(await waitFor(() => voiceOf(block).toLowerCase() === name.toLowerCase(), 3000))) {
      throw new Error(`The voice did not change to "${name}" (the chip shows "${voiceOf(block)}").`);
    }
  }

  async function setStyle(block, style) {
    const chip = block.querySelector('button[aria-label="Style"]');
    if (!chip) throw new Error("No Style chip on the speech block.");
    const now = () => (chip.querySelector(".chip-label")?.innerText || "").trim();
    if (now().toLowerCase() === style.toLowerCase()) return;
    chip.click();
    const ta = await waitFor(() => $$('textarea[aria-label="Describe the voice style"]').find(vis), 4000);
    if (!ta) throw new Error("The style menu did not open.");
    ta.focus();
    setValue(ta, style);
    await sleep(200);
    // The custom style is committed on Enter; an input event alone does not update the chip.
    for (const t of ["keydown", "keypress", "keyup"]) {
      ta.dispatchEvent(new KeyboardEvent(t, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
    }
    await sleep(350);
    await closeOverlays();
    if (now().toLowerCase() !== style.toLowerCase()) throw new Error(`The style did not stick (the chip shows "${now()}").`);
  }

  async function setText(block, text) {
    const ta = textArea(block);
    if (!ta) throw new Error("A speech block has no text box.");
    setValue(ta, text);
    await sleep(120);
    if (ta.value !== text) throw new Error("The text did not stick in a speech block.");
  }

  // Run settings > Filler words (on in some templates) lets the model add "mm-hmm"-style words; the
  // story must be read word for word, so it is switched off before every run.
  async function fillerWordsOff() {
    const sw = $$('button[role="switch"][aria-label="Filler words"]').find(vis);
    if (sw && sw.getAttribute("aria-checked") === "true") {
      sw.click();
      if (!(await waitFor(() => sw.getAttribute("aria-checked") === "false", 2000))) throw new Error("Could not switch off Filler words in Run settings.");
    }
  }

  // ---------- Run ----------
  // The take streams in: a ~2.6 KB stub (0.04 s) appears first, the audio plays as it streams, and the
  // full WAV replaces the stub only when that playback ends (a 78 s part: about 80 s after Run goes idle).
  // Done = idle, a new data URL past the stub size, and that URL unchanged for STABLE_MS.
  async function runAndWait(timeoutMs) {
    await fillerWordsOff();
    const before = audioSrc();
    const run = runButton();
    if (!run) throw new Error("Run button not found.");
    run.click();
    const started = await waitFor(() => isRunning() || (audioSrc() !== before && isTake(audioSrc())), 8000);
    if (!started) throw new Error(`Run did not start. ${pageError()}`.trim());
    const STABLE_MS = 2000, MIN_LEN = 20000;
    const t0 = Date.now();
    let stoppedAt = 0, lastSrc = before, sameSince = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      await sleep(250);
      const s = audioSrc();
      if (s !== lastSrc) { lastSrc = s; sameSince = Date.now(); }
      const fresh = s !== before && isTake(s) && s.length > MIN_LEN;
      if (!isRunning() && fresh && Date.now() - sameSince >= STABLE_MS) {
        return { ok: true, dataUrl: s, duration: footerAudio()?.duration || null };
      }
      if (!isRunning() && !fresh && !isPlaying()) {
        stoppedAt ||= Date.now();
        if (Date.now() - stoppedAt > 8000) throw new Error(`Run finished without a new take. ${pageError()}`.trim());
      } else stoppedAt = 0;
    }
    throw new Error(`No take after ${Math.round(timeoutMs / 1000)} s. ${pageError()}`.trim());
  }

  async function generate({ voice, style, text, timeoutMs = 120000 }) {
    if (isRunning()) throw new Error("AI Studio is already running a generation.");
    await closeOverlays();
    await closePanels();
    const block = await singleBlock();
    if (voice) await setVoice(block, voice);
    await setStyle(block, style);
    await setText(block, text);
    const res = await runAndWait(timeoutMs);
    return { ...res, voice: voiceOf(block) };
  }

  // want: [{ slot: 1|2, style, text }], voices: { 1: "Riko", 2: "Iapetus" }
  async function generateStory({ blocks: want, voices, timeoutMs = 600000 }) {
    if (isRunning()) throw new Error("AI Studio is already running a generation.");
    if (!want?.length) throw new Error("No speech blocks to fill.");
    await closeOverlays();
    await closePanels();
    await arrangeBlocks(want.map(b => b.slot));
    for (const slot of [1, 2]) {
      const i = want.findIndex(b => b.slot === slot);
      if (i >= 0 && voices[slot]) await setVoice(blocks()[i], voices[slot]);
    }
    for (const [i, b] of want.entries()) {
      const el = blocks()[i];
      if (b.style) await setStyle(el, b.style);
      await setText(el, b.text);
    }
    // Check the page once more before spending a request.
    const bad = want.findIndex((b, i) => slotOf(blocks()[i]) !== b.slot || textArea(blocks()[i]).value !== b.text
      || voiceOf(blocks()[i]).toLowerCase() !== String(voices[b.slot] || voiceOf(blocks()[i])).toLowerCase());
    if (bad >= 0) throw new Error(`Speech block ${bad + 1} did not keep its speaker, voice, or text.`);
    const res = await runAndWait(timeoutMs);
    return { ...res, voices: { 1: voices[1], 2: voices[2] } };
  }

  // ---------- Voice list ----------
  async function pickGender(label) {
    const btn = $$("button").find(b => vis(b) && !b.getAttribute("role") && b.closest("ms-voice-library, mat-dialog-container")
      && /^(Gender|All genders|Masculine|Feminine|Neutral)\b/.test(b.innerText.trim()));
    if (!btn) return false;
    btn.click();
    const item = await waitFor(() => $$('[role="menuitem"]').find(b => vis(b) && b.innerText.trim() === label), 2000);
    if (!item) { await closeOverlays(); return false; }
    item.click();
    await sleep(600);
    return true;
  }

  async function listVoices() {
    if (isRunning()) throw new Error("AI Studio is busy generating; list the voices after it finishes.");
    await closeOverlays();
    if (!blocks().length) await addBlock();
    const search = await openPicker(blocks()[0]);
    const read = () => $$("ms-voice-library button.voice-card-content").map(b => ({
      name: (b.querySelector(".voice-name")?.innerText || "").replace(/\s*\(Current\)\s*$/i, "").trim(),
      sub: (b.querySelector(".voice-subtitle")?.innerText || "").replace(/\s+/g, " ").trim(),
    })).filter(v => v.name);
    const all = new Map();
    const take = list => list.forEach(v => { if (!all.has(v.name)) all.set(v.name, v); });
    // Every voice's subtitle ends "· <x> pitch", so this one query lists them all; letters are the fallback.
    setValue(search, "pitch"); await sleep(900); take(read());
    if (all.size < 20) for (const q of "aeioumnrst") { setValue(search, q); await sleep(600); take(read()); }
    const gender = {};
    for (const g of ["Masculine", "Feminine", "Neutral"]) {
      if (!(await pickGender(g))) break;
      setValue(search, "pitch"); await sleep(800);
      for (const v of read()) gender[v.name] = g;
    }
    await pickGender("All genders");
    setValue(search, "");
    await sleep(200);
    await closePanels();
    return [...all.values()].map(v => {
      const [desc, pitch] = v.sub.split(/\s*·\s*/);
      return { name: v.name, desc: (desc || "").replace(/\.$/, ""), pitch: (pitch || "").replace(/\s*pitch$/i, ""), gender: gender[v.name] || "" };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  function status() {
    const model = (document.querySelector("ms-model-selector")?.innerText || document.querySelector("ms-run-settings")?.innerText || "")
      .split("\n").map(s => s.trim()).find(s => /tts/i.test(s)) || "";
    return {
      onSpeechPage: location.pathname.startsWith("/generate-speech"),
      blocks: blocks().length,
      model,
      voice: blocks()[0] ? voiceOf(blocks()[0]) : "",
      running: isRunning(),
    };
  }

  let busy = false;
  chrome.runtime.onMessage.addListener((msg, _sender, send) => {
    (async () => {
      try {
        if (msg.type === "ping") return send({ ok: true });
        if (msg.type === "status") return send({ ok: true, ...status() });
        if (["generate", "generateStory", "listVoices"].includes(msg.type)) {
          if (busy) throw new Error("The AI Studio tab is already busy with another request.");
          busy = true;
          try {
            if (msg.type === "generate") send(await generate(msg));
            else if (msg.type === "generateStory") send(await generateStory(msg));
            else send({ ok: true, voices: await listVoices() });
          } finally { busy = false; }
          return;
        }
        send({ ok: false, error: `Unknown message ${msg.type}` });
      } catch (e) {
        send({ ok: false, error: e.message });
      }
    })();
    return true;
  });
})();
