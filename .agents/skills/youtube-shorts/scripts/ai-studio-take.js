// AI Studio single-take fallback for the youtube-shorts skill.
// The AI Studio Voice Runner extension does this from its side panel. A browser-automation agent cannot open
// chrome-extension:// pages, so it runs the extension's own steps (tools/ai-studio-voice-runner/content.js:
// singleBlock, setVoice, setStyle, setText, fillerWordsOff) in the generate-speech page instead.
//
// 1. Open https://aistudio.google.com/generate-speech and click "The Master Storyteller".
// 2. Replace the three __PLACEHOLDERS__ below (text = `node short.mjs blocks` "single-take text"), run this
//    file's PREPARE part in the page; it returns the block's voice, style and whether the text stuck.
// 3. Click Run with a real mouse click (Chrome's autoplay rule needs one; a script click leaves a 0.04 s stub).
// 4. Run the WAIT part; it returns when the full take is in the footer (the take plays through first).
// 5. Run the SAVE part; Chrome saves <slug>-story-full.wav to Downloads. Copy it to <run>/vo/story-full.wav.

// ---------- PREPARE ----------
const VOICE = "__VOICE__";
const STYLE = "__STYLE__";
const TEXT = "__TEXT__";
{
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vis = e => !!e && e.getBoundingClientRect().width > 0;
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const waitFor = async (fn, ms = 5000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = fn(); if (v) return v; await sleep(100); } return null; };
  const setValue = (el, v) => { const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); };
  const blocks = () => $$("ms-speech-block");
  const voiceOf = b => (b.querySelector(".voice-chip-label")?.innerText || "").trim().replace(/^Speaker\s*\d+\s*-\s*/i, "").trim();
  const closePanels = async () => { for (const b of $$('button[aria-label="Close panel"]').filter(vis)) { b.click(); await sleep(400); } };
  const closeOverlays = async () => { for (let i = 0; i < 3; i++) { const bd = $$(".cdk-overlay-backdrop").find(vis); if (!bd) break; bd.click(); await sleep(250); } };
  await closeOverlays(); await closePanels();
  while (blocks().length > 1) { const n = blocks().length; blocks()[n - 1].querySelector('button[aria-label="Delete speech block"]').click(); await waitFor(() => blocks().length < n, 3000); }
  const block = blocks()[0];
  if (voiceOf(block).toLowerCase() !== VOICE.toLowerCase()) {
    block.querySelector(".voice-chip").click();
    const search = await waitFor(() => $$('input[aria-label="Search voices"]').find(vis), 5000);
    setValue(search, VOICE);
    const btn = await waitFor(() => $$("ms-voice-library button.voice-card-content").find(b => vis(b) && (b.getAttribute("aria-label") || "").replace(/\s*\(Current\)\s*$/i, "").toLowerCase() === VOICE.toLowerCase()), 6000);
    if (btn) { btn.click(); await sleep(600); }
    await closePanels();
  }
  const chip = block.querySelector('button[aria-label="Style"]');
  chip.click();
  const ta = await waitFor(() => $$('textarea[aria-label="Describe the voice style"]').find(vis), 4000);
  ta.focus(); setValue(ta, STYLE); await sleep(200);
  for (const t of ["keydown", "keypress", "keyup"]) ta.dispatchEvent(new KeyboardEvent(t, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true, cancelable: true }));
  await sleep(400); await closeOverlays();
  const tx = block.querySelector('textarea[aria-label="Speech block text"]');
  setValue(tx, TEXT); await sleep(150);
  const sw = $$('button[role="switch"][aria-label="Filler words"]').find(vis);
  if (sw && sw.getAttribute("aria-checked") === "true") { sw.click(); await sleep(500); }
  ({ blocks: blocks().length, voice: voiceOf(block), style: (chip.querySelector(".chip-label")?.innerText || "").trim(), textOk: tx.value === TEXT });
}

// ---------- WAIT (after the real click on Run) ----------
{
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vis = e => !!e && e.getBoundingClientRect().width > 0;
  const runBtn = () => [...document.querySelectorAll("ms-run-button button")].find(vis);
  const running = () => /\bstop\b/i.test(runBtn()?.innerText || "");
  const src = () => { const a = document.querySelector("ms-audio-footer audio"); return a ? (a.currentSrc || a.src || "") : ""; };
  let last = src(), same = Date.now(); const t0 = Date.now();
  while (Date.now() - t0 < 85000) { // call again if a 60 s Short is still streaming
    await sleep(500);
    const s = src(); if (s !== last) { last = s; same = Date.now(); }
    if (!running() && s.startsWith("data:audio") && s.length > 20000 && Date.now() - same > 2000) break;
  }
  ({ running: running(), bytes: src().length, seconds: document.querySelector("ms-audio-footer audio")?.duration, error: [...document.querySelectorAll("mat-snack-bar-container,[role=alert]")].map(e => e.innerText).join(" | ") });
}

// ---------- SAVE ----------
{
  const a = document.querySelector("ms-audio-footer audio");
  const blob = await fetch(a.currentSrc || a.src).then(r => r.blob());
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "__SLUG__-story-full.wav";
  document.body.appendChild(link); link.click(); link.remove();
  blob.size;
}
