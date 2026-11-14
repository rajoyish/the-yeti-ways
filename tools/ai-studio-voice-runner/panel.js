// Side panel: load a speech guide, keep one AI Studio voice per speaker, generate each cue in the
// AI Studio tab, measure the take, and save it as Downloads/<folder>/<cue file>.
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PACE = /\b(slow, with room to breathe|natural pace|unhurried|brisk|slow)\b/i;

let guide = null;          // { cues: [...], voices: [...] }
let takes = {};            // cueId -> { speech, total, max, ok, style, voice, at }
let audioUrls = {};        // cueId -> data URL, this panel session only
let voiceNames = {};       // speaker -> AI Studio voice name
let stopFlag = false;
let running = false;

function log(msg) {
  const t = new Date().toLocaleTimeString();
  $("log").textContent = `${t}  ${msg}\n` + $("log").textContent;
}

// ---------- Guide parsing ----------
const cells = l => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
const untick = s => s.trim().replace(/^`/, "").replace(/`$/, "");

function tableAfter(lines, i) {
  const rows = [];
  let j = i + 1;
  while (j < lines.length && !lines[j].startsWith("|") && !/^#{1,3} /.test(lines[j])) j++;
  for (j += 2; j < lines.length && lines[j].startsWith("|"); j++) rows.push(cells(lines[j]));
  return rows;
}

// Gemini 3.8 Flash TTS reads the text as a verbatim transcript: delivery belongs in the style box,
// point-in-time sounds go inline in angle brackets (<laugh>, <sigh>, <breath>, <short pause>), and
// square-bracket tags or "Name:" labels can be spoken aloud.
function lint(text) {
  const out = [];
  if (/\[[^\]]+\]/.test(text)) out.push("square-bracket tag may be read aloud; use angle brackets, e.g. <short pause>");
  if (/^\s*[A-Z][\w .'-]{0,30}:\s/.test(text)) out.push("speaker label in the text may be read aloud");
  if (/\([^)]*\)/.test(text)) out.push("stage direction in brackets may be read aloud; move it to the style");
  return out;
}

function parseGuide(md, fileName) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const find = re => lines.findIndex(l => re.test(l));
  const vi = find(/^## Voices\s*$/), ci = find(/^## Cue sheet\s*$/);
  if (vi < 0 || ci < 0) throw new Error("This is not a speech guide: it needs a ## Voices table and a ## Cue sheet table.");
  const voices = tableAfter(lines, vi).map(r => ({ speaker: r[0], desc: r[1], pitch: r[2], chosen: (r[3] || "").trim() }));
  const sheet = new Map(tableAfter(lines, ci).map(r => [r[0], { id: r[0], video: r[1], clip: r[2], film: r[3], speaker: r[4], plain: r[5], file: untick(r[6] || "") }]));
  const cues = [];
  lines.forEach((l, i) => {
    const m = l.match(/^## Session (\d+) - (.+?)\s*$/);
    if (!m) return;
    for (const r of tableAfter(lines, i)) {
      const c = sheet.get(r[1]);
      if (!c) throw new Error(`Session ${m[1]} names cue ${r[1]}, which is not in the cue sheet.`);
      const text = untick(r[5]);
      cues.push({ ...c, session: Number(m[1]), window: parseFloat(r[2]), max: parseFloat(r[3]), style: untick(r[4]), text,
        range: Stitch.parseRange(c.clip), lint: lint(text) });
    }
  });
  if (!cues.length) throw new Error("No ## Session tables found in the guide.");
  const title = (lines.find(l => l.startsWith("# ")) || "").slice(2).trim();
  const folder = "speech-takes/" + fileName.replace(/\.md$/i, "").replace(/-tts$/i, "");
  return { title, voices, cues, folder };
}

// ---------- WAV measuring ----------
// Speech length = first to last 10 ms frame louder than about -32 dBFS (silence at the ends is trimmed in the edit).
async function measure(dataUrl) {
  const buf = await (await fetch(dataUrl)).arrayBuffer();
  const dv = new DataView(buf);
  const tag = o => String.fromCharCode(dv.getUint8(o), dv.getUint8(o + 1), dv.getUint8(o + 2), dv.getUint8(o + 3));
  if (tag(0) !== "RIFF" || tag(8) !== "WAVE") return null;
  let ch = 1, rate = 24000, bits = 16, dataOff = -1, dataLen = 0;
  for (let o = 12; o + 8 <= dv.byteLength;) {
    const id = tag(o), size = dv.getUint32(o + 4, true);
    if (id === "fmt ") { ch = dv.getUint16(o + 10, true); rate = dv.getUint32(o + 12, true); bits = dv.getUint16(o + 22, true); }
    if (id === "data") { dataOff = o + 8; dataLen = Math.min(size, dv.byteLength - dataOff); break; }
    o += 8 + size + (size % 2);
  }
  if (dataOff < 0 || bits !== 16) return null;
  const frames = Math.floor(dataLen / (2 * ch));
  const total = frames / rate;
  const win = Math.max(1, Math.round(rate / 100));
  const thr = 0.025 * 32768;
  let first = -1, last = -1;
  for (let f = 0; f < frames; f += win) {
    let peak = 0;
    for (let k = f; k < Math.min(frames, f + win); k++) {
      const v = Math.abs(dv.getInt16(dataOff + k * 2 * ch, true));
      if (v > peak) peak = v;
    }
    if (peak > thr) { if (first < 0) first = f; last = Math.min(frames, f + win); }
  }
  const speech = first < 0 ? 0 : (last - first) / rate;
  return { total, speech, lead: first < 0 ? 0 : first / rate };
}

// ---------- AI Studio tab ----------
async function studioTab() {
  const tabs = await chrome.tabs.query({ url: "https://aistudio.google.com/*" });
  if (!tabs.length) return null;
  // Prefer the generate-speech tab in the panel's own window, then any generate-speech tab.
  const win = await chrome.windows.getCurrent().catch(() => null);
  const speech = tabs.filter(t => (t.url || "").includes("/generate-speech"));
  const pool = speech.length ? speech : tabs;
  const here = pool.filter(t => win && t.windowId === win.id);
  return here.find(t => t.active) || here[0] || pool.find(t => t.active) || pool[0];
}

async function send(tabId, msg) {
  try {
    return await chrome.tabs.sendMessage(tabId, msg);
  } catch {
    // The tab was open before the extension was installed or reloaded: inject the content script once.
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}

async function refreshStatus() {
  const pill = $("tab-status");
  const tab = await studioTab();
  if (!tab) { pill.textContent = "Open aistudio.google.com/generate-speech"; pill.className = "pill bad"; return null; }
  try {
    const s = await send(tab.id, { type: "status" });
    if (!s.onSpeechPage || !s.blocks) { pill.textContent = "Open The Master Storyteller"; pill.className = "pill bad"; return null; }
    const tts38 = /3\.8[ -]flash[ -]tts/i.test(s.model);
    pill.textContent = tts38 ? "Gemini 3.8 Flash TTS ready" : `Model: ${s.model || "unknown"}`;
    pill.className = "pill " + (tts38 ? "ok" : "bad");
    return { tab, ...s };
  } catch (e) {
    pill.textContent = "Reload the AI Studio tab"; pill.className = "pill bad";
    return null;
  }
}

// ---------- Voice catalog (every voice in AI Studio's picker) ----------
// The voices offered are Google Flow's 30 (Story.FLOW_VOICES), so every speaker's Flow Character can speak with the
// voice of its recorded lines. AI Studio's other voices (read from its picker) are shown only with "Show all".
let catalog = [];          // AI Studio's full list, read from its voice picker: [{ name, desc, pitch, gender }]
let lastVoiceInput = null; // the speaker box a click in the voice library fills

const showAll = () => !!$("all-voices")?.checked;
const sameName = (a, b) => a.toLowerCase() === String(b || "").toLowerCase();
const listed = () => showAll()
  ? [...Story.FLOW_VOICES, ...catalog.filter(v => !Story.isFlowVoice(v.name))].sort((a, b) => a.name.localeCompare(b.name))
  : Story.FLOW_VOICES;
const voiceInfo = name => Story.FLOW_VOICES.find(v => sameName(v.name, name)) || catalog.find(v => sameName(v.name, name));
const describe = v => v ? [v.gender, v.desc, v.pitch && `${v.pitch} pitch`, v.flow ? "" : "not in Google Flow"].filter(Boolean).join(" · ") : "";

function renderCatalog() {
  const list = listed();
  $("voice-catalog").innerHTML = list.map(v => `<option value="${escapeHtml(v.name)}" label="${escapeHtml(describe(v))}"></option>`).join("");
  $("catalog-info").textContent = showAll()
    ? `${list.length} voices (${Story.FLOW_VOICES.length} in Google Flow${catalog.length ? "" : "; read AI Studio's list for the rest"})`
    : `${list.length} Google Flow voices`;
  const q = $("voice-search").value.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const hits = list.filter(v => words.every(w => `${v.name} ${describe(v)}`.toLowerCase().includes(w)));
  $("voice-list").innerHTML = hits.map(v => `<button class="vitem" data-name="${escapeHtml(v.name)}"><b>${escapeHtml(v.name)}</b> <span class="muted">${escapeHtml(describe(v))}</span></button>`).join("")
    || `<p class="muted">No voice matches.</p>`;
  $("voice-list").querySelectorAll(".vitem").forEach(b => b.addEventListener("click", () => {
    const inp = lastVoiceInput;
    if (!inp || inp.disabled || !inp.isConnected) { log(`Click a speaker's voice box first, then ${b.dataset.name}.`); return; }
    inp.value = b.dataset.name;
    inp.dispatchEvent(new Event("change"));
  }));
}

async function refreshCatalog() {
  const st = await refreshStatus();
  if (!st) { log("Open AI Studio generate-speech with a template (The Master Storyteller) to read its voices."); return; }
  $("refresh-voices").disabled = true;
  try {
    const res = await send(st.tab.id, { type: "listVoices" });
    if (!res?.ok) throw new Error(res?.error || "No answer from the AI Studio tab.");
    catalog = res.voices;
    await chrome.storage.local.set({ voiceCatalog: catalog });
    renderCatalog();
    log(`Read ${catalog.length} voices from AI Studio.`);
    if (story) renderStoryVoices();
    else if (guide) renderVoices();
  } catch (e) {
    log(`Could not read the voices: ${e.message}`);
  } finally { $("refresh-voices").disabled = false; }
}

// One searchable voice box. Fixed (Yeti) voices are shown but cannot be changed.
function voiceBox(speaker, value, onSet) {
  const wrap = document.createElement("div");
  wrap.className = "vbox";
  const inp = document.createElement("input");
  inp.type = "text"; inp.spellcheck = false; inp.placeholder = "search voices";
  inp.setAttribute("list", "voice-catalog");
  inp.value = value || "";
  const info = document.createElement("span");
  info.className = "desc";
  const show = () => { const v = voiceInfo(inp.value); info.textContent = Story.isFixed(speaker) ? `fixed Yeti voice · ${describe(v)}` : describe(v); };
  if (Story.isFixed(speaker)) { inp.disabled = true; inp.title = "The Yeti family always keeps this voice."; }
  inp.addEventListener("focus", () => { lastVoiceInput = inp; });
  inp.addEventListener("change", async () => {
    const name = inp.value.trim();
    const v = voiceInfo(name);
    if (!v || (!Story.isFlowVoice(name) && !showAll())) {
      inp.classList.add("invalid");
      log(`"${name}" is not one of the ${Story.FLOW_VOICES.length} Google Flow voices. Pick one from the list.`);
      return;
    }
    if (!Story.isFlowVoice(name)) log(`⚠ ${v.name} is not in Google Flow: ${speaker}'s Flow Character cannot speak with this voice.`);
    inp.classList.remove("invalid");
    if (v) inp.value = v.name;
    show();
    await onSet(inp.value);
  });
  show();
  wrap.append(inp, info);
  return wrap;
}

const saveVoices = () => chrome.storage.local.set({ voices: voiceNames });
const fixedOr = (speaker, v) => (Story.isFixed(speaker) ? Story.FIXED_VOICES[speaker] : v);

// ---------- Rendering ----------
function renderVoices() {
  const box = $("voices");
  box.innerHTML = "";
  for (const v of guide.voices) {
    if (!voiceNames[v.speaker] && v.chosen) voiceNames[v.speaker] = v.chosen;
    const row = document.createElement("div");
    row.className = "voice";
    row.innerHTML = `<span class="who"></span><span class="desc"></span>`;
    row.querySelector(".who").textContent = `${v.speaker} · ${v.pitch || ""}`;
    row.querySelector(".desc").textContent = v.desc;
    row.insertBefore(voiceBox(v.speaker, fixedOr(v.speaker, voiceNames[v.speaker]), async name => {
      voiceNames[v.speaker] = name; await saveVoices();
    }), row.querySelector(".desc"));
    box.appendChild(row);
  }
}

function takeCell(c) {
  const t = takes[c.id];
  if (!t) return `<span class="muted">${c.window.toFixed(1)}/${c.max.toFixed(1)} s</span>`;
  if (t.error) return `<span class="bad" title="${escapeHtml(t.error)}">failed</span>`;
  const cls = t.ok ? "ok" : "warn";
  return `<span class="${cls}">${t.speech.toFixed(2)} s</span><br><span class="muted">max ${c.max.toFixed(1)}</span>`;
}

function escapeHtml(s) { return String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])); }

function renderCues() {
  const body = $("cues");
  const checked = new Set([...body.querySelectorAll("input:checked")].map(i => i.dataset.id));
  body.innerHTML = "";
  for (const c of guide.cues) {
    const tr = document.createElement("tr");
    tr.id = `row-${c.id}`;
    tr.innerHTML = `
      <td><input type="checkbox" data-id="${c.id}"></td>
      <td class="cue">${c.id}<br><span class="spk">${escapeHtml(c.speaker)}</span></td>
      <td><span class="txt">${escapeHtml(c.text)}</span><span class="sty">${escapeHtml(c.style)}</span>${c.lint.map(w => `<span class="lint">⚠ ${escapeHtml(w)}</span>`).join("")}</td>
      <td class="take">${takeCell(c)}</td>
      <td class="btns"><button data-act="gen">${takes[c.id] ? "Retake" : "Generate"}</button>${audioUrls[c.id] ? '<button data-act="play">Play</button>' : ""}</td>`;
    tr.querySelector("input").checked = checked.has(c.id);
    tr.querySelector('[data-act="gen"]').addEventListener("click", () => runCues([c]));
    tr.querySelector('[data-act="play"]')?.addEventListener("click", () => new Audio(audioUrls[c.id]).play());
    body.appendChild(tr);
  }
}

const selected = () => [...$("cues").querySelectorAll("input:checked")].map(i => guide.cues.find(c => c.id === i.dataset.id));
function select(pred) { $("cues").querySelectorAll("input").forEach(i => { i.checked = pred(guide.cues.find(c => c.id === i.dataset.id)); }); }

// ---------- Generating ----------
function folder() { return $("folder").value.trim().replace(/^\/+|\/+$/g, "").replace(/\\/g, "/") || (story || guide).folder; }

async function saveTakes() { await chrome.storage.local.set({ [`takes:${folder()}`]: takes }); }

// The take audio itself is kept too (unlimitedStorage), so tracks can be rebuilt after the panel closes.
const audioKey = id => `audio:${folder()}:${id}`;
async function loadAudio() {
  const got = await chrome.storage.local.get(guide.cues.map(c => audioKey(c.id)));
  audioUrls = {};
  for (const c of guide.cues) if (got[audioKey(c.id)]) audioUrls[c.id] = got[audioKey(c.id)];
}
async function keepAudio(id, dataUrl) {
  audioUrls[id] = dataUrl;
  await chrome.storage.local.set({ [audioKey(id)]: dataUrl });
}

// ---------- Video tracks ----------
const videoLen = () => Math.max(1, Number($("video-len").value) || 10);
const isNumbered = v => /^\d+$/.test(String(v).trim());
const trackName = v => isNumbered(v) ? `video-${String(v).trim().padStart(2, "0")}-speech.wav`
  : `${String(v).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-speech.wav`;

async function bytes(dataUrl) { return (await fetch(dataUrl)).arrayBuffer(); }

async function downloadWav(buf, name) {
  const url = URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  try {
    await chrome.downloads.download({ url, filename: `${folder()}/tracks/${name}`, conflictAction: "overwrite", saveAs: false });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

// One WAV per video, exactly the clip's length, each line's first word on its cue's clip time.
async function buildVideoTracks(only) {
  if (!guide) return;
  const len = videoLen();
  const videos = [...new Set(guide.cues.map(c => c.video))].filter(v => !only || only.has(v));
  for (const v of videos) {
    const cues = guide.cues.filter(c => c.video === v);
    const ready = cues.filter(c => audioUrls[c.id] && c.range);
    const missing = cues.filter(c => !audioUrls[c.id]).map(c => c.id);
    const untimed = cues.filter(c => audioUrls[c.id] && !c.range).map(c => c.id);
    if (!ready.length) { log(`Video ${v}: no takes yet (${missing.join(", ")}).`); continue; }
    const items = [];
    for (const c of ready) items.push({ id: c.id, at: c.range.start, end: c.range.end, wav: await bytes(audioUrls[c.id]) });
    const r = Stitch.buildTrack({ length: len, items, label: `video ${v}` });
    const name = trackName(v);
    await downloadWav(r.wav, name);
    const gaps = [missing.length && `missing ${missing.join(", ")}`, untimed.length && `no clip time for ${untimed.join(", ")}`].filter(Boolean);
    log(`Video ${v}: saved tracks/${name} (${len} s, ${r.placed.map(p => `${p.id}@${p.start.toFixed(1)}`).join(" ")})${gaps.length ? " — " + gaps.join("; ") : ""}`);
    for (const n of r.notes) log(`  ⚠ ${n}`);
  }
}

// The whole film on one WAV: video N's lines sit at (N - 1) × video length + clip time. Pick-ups are cut
// in by hand in the edit, so they keep their own video tracks only.
async function buildFilmTrack() {
  if (!guide) return;
  const len = videoLen();
  const cues = guide.cues.filter(c => isNumbered(c.video));
  if (!cues.length) { log("No numbered videos in the cue sheet."); return; }
  const count = Math.max(...cues.map(c => Number(c.video)));
  const items = [];
  for (const c of cues) {
    if (!audioUrls[c.id] || !c.range) continue;
    const base = (Number(c.video) - 1) * len;
    items.push({ id: c.id, at: base + c.range.start, end: base + c.range.end, wav: await bytes(audioUrls[c.id]) });
  }
  if (!items.length) { log("No takes to stitch yet."); return; }
  const r = Stitch.buildTrack({ length: count * len, items, label: "film" });
  await downloadWav(r.wav, "film-speech.wav");
  const missing = cues.filter(c => !audioUrls[c.id]).map(c => c.id);
  log(`Saved tracks/film-speech.wav (${count} videos × ${len} s = ${count * len} s, ${items.length} lines)${missing.length ? ` — missing ${missing.join(", ")}` : ""}`);
  for (const n of r.notes) log(`  ⚠ ${n}`);
}

// Takes already on disk (an earlier run, or downloaded by hand from AI Studio) matched by cue file name.
async function importTakes(files) {
  const byFile = new Map(guide.cues.map(c => [c.file.toLowerCase(), c]));
  let n = 0;
  for (const f of files) {
    const c = byFile.get(f.name.toLowerCase());
    if (!c) { log(`${f.name}: not a cue file in this guide, skipped.`); continue; }
    const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
    const m = await measure(dataUrl);
    if (!m) { log(`${f.name}: not a 16-bit WAV, skipped.`); continue; }
    await keepAudio(c.id, dataUrl.replace(/^data:[^;,]*/, "data:audio/wav"));
    takes[c.id] = { speech: m.speech, total: m.total, max: c.max, ok: m.speech <= c.max + 0.005, style: c.style, voice: fixedOr(c.speaker, voiceNames[c.speaker]) || "", imported: true, at: new Date().toISOString() };
    n++;
  }
  await saveTakes();
  renderCues();
  log(`Loaded ${n} take${n === 1 ? "" : "s"} from disk.`);
}

async function generateOne(tab, c, style) {
  const voice = fixedOr(c.speaker, voiceNames[c.speaker]);
  const res = await send(tab.id, { type: "generate", voice, style, text: c.text });
  if (!res?.ok) throw new Error(res?.error || "No answer from the AI Studio tab.");
  const m = await measure(res.dataUrl);
  const speech = m ? m.speech : (res.duration || 0);
  return { dataUrl: res.dataUrl, speech, total: m ? m.total : res.duration, voice: res.voice };
}

async function runCues(list) {
  if (running || storyRunning || !list.length) return;
  const st = await refreshStatus();
  if (!st) { log("AI Studio is not ready: open generate-speech, click The Master Storyteller, and keep that tab open."); return; }
  const missing = [...new Set(list.map(c => c.speaker))].filter(s => !fixedOr(s, voiceNames[s]));
  if (missing.length) { log(`Choose an AI Studio voice for: ${missing.join(", ")}.`); return; }

  running = true; stopFlag = false;
  $("run").disabled = true; $("stop").disabled = false;
  const delay = Math.max(0, Number($("delay").value) || 0) * 1000;
  const touched = new Set();
  try {
    for (const [i, c] of list.entries()) {
      if (stopFlag) { log("Stopped."); break; }
      document.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"));
      $(`row-${c.id}`)?.classList.add("active");
      log(`${c.id} ${c.speaker} (${fixedOr(c.speaker, voiceNames[c.speaker])}): generating…`);
      try {
        let style = c.style;
        let take = await generateOne(st.tab, c, style);
        if (take.speech > c.max + 0.005 && $("auto-retake").checked && !stopFlag) {
          log(`${c.id}: ${take.speech.toFixed(2)} s is over its ${c.max.toFixed(1)} s max; retaking brisk.`);
          // Tested on the live model: "brisk" barely moves the pace; this wording cuts takes by 15-25 percent.
          const manner = style.replace(/,?\s*\b(slow, with room to breathe|natural pace|unhurried|brisk|slow|short and punchy|no pauses)\b/gi, "").replace(/^,\s*|\s*,\s*$/g, "").trim();
          style = `${manner}, quick and lively delivery, no pauses between phrases`;
          if (delay) await sleep(delay);
          const again = await generateOne(st.tab, c, style);
          if (again.speech < take.speech) take = again; else style = c.style;
        }
        const ok = take.speech <= c.max + 0.005;
        await chrome.downloads.download({ url: take.dataUrl, filename: `${folder()}/${c.file}`, conflictAction: "overwrite", saveAs: false });
        await keepAudio(c.id, take.dataUrl);
        touched.add(c.video);
        takes[c.id] = { speech: take.speech, total: take.total, max: c.max, ok, style, voice: take.voice, at: new Date().toISOString() };
        log(`${c.id}: saved ${c.file}, speech ${take.speech.toFixed(2)} s of ${c.max.toFixed(1)} s max ${ok ? "✓" : "— too long, listen and retake"}`);
      } catch (e) {
        takes[c.id] = { error: e.message, at: new Date().toISOString() };
        log(`${c.id}: FAILED — ${e.message}`);
        if (/not found|did not open|Master Storyteller|Run button/i.test(e.message)) { log("Stopping: fix this in AI Studio, then continue."); stopFlag = true; }
      }
      await saveTakes();
      renderCues();
      if (delay && i < list.length - 1 && !stopFlag) await sleep(delay);
    }
  } finally {
    running = false;
    $("run").disabled = false; $("stop").disabled = true;
    document.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"));
  }
  if (touched.size && $("auto-stitch").checked) {
    try { await buildVideoTracks(touched); } catch (e) { log(`Stitching failed: ${e.message}`); }
  }
}

async function saveReport() {
  const rows = guide.cues.map(c => {
    const t = takes[c.id];
    const take = !t ? "not made" : t.error ? `failed: ${t.error}` : `${t.speech.toFixed(2)} s ${t.ok ? "fits" : "too long"}`;
    return `| ${c.id} | ${c.video} | ${c.film} | ${c.speaker} | ${t?.voice || voiceNames[c.speaker] || ""} | ${c.max.toFixed(1)} s | ${take} | \`${c.file}\` |`;
  });
  const md = [`# ${guide.title} - takes`, "", `Generated with Gemini 3.8 Flash TTS in Google AI Studio. Speech length is measured from the first to the last loud 10 ms frame.`, "",
    "| Cue | Video | Film time | Speaker | Voice | Max | Take | File |", "| --- | --- | --- | --- | --- | --- | --- | --- |", ...rows, ""].join("\n");
  const url = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
  await chrome.downloads.download({ url, filename: `${folder()}/takes-report.md`, conflictAction: "overwrite", saveAs: false });
  log(`Saved ${folder()}/takes-report.md`);
}

// ---------- Story mode ----------
// The story is a list of speech blocks ("Speaker 1 - Charon:" ... "---"): narration in the Narrator's voice,
// each quoted line in its own block in its speaker's voice. They come from a speech-blocks file
// (speech-prompts/*-speech-blocks.md, written by /ai-studio-tts) as is, or from a stories/*.md file's
// ## Story, split here. The blocks are voiced as a few AI Studio runs ("parts", at most two voices each),
// then the parts are joined into one story WAV.
let story = null;          // Story.parseStory (source "story") or Story.parseSpeechBlocks (source "blocks")
let storyOverrides = {};   // line id (story) or block id (blocks) -> speaker, per story
let storyStyles = {};      // speaker -> base delivery style, kept across stories
let storyTakes = {};       // part key -> { id, speech, total, at, error }
let partAudio = {};        // part key -> data URL
let parts = [];
let storyRunning = false;

const overridesKey = () => `overrides:${story.slug}:${story.source}`;
const withOverride = x => (storyOverrides[x.id] ? { ...x, speaker: storyOverrides[x.id] } : x);
const storyBlocks = () => (story.source === "story" ? Story.composeBlocks(story.lines.map(withOverride)) : story.blocks.map(withOverride));
const storySpeakers = () => [...new Set([Story.NARRATOR, ...story.cast, ...storyBlocks().map(b => b.speaker)])];
const storyVoice = s => Story.voiceOf(s, voiceNames);
const storyStyleMap = () => ({ ...(story.styles || {}), ...storyStyles });
const partKey = p => `paudio:${folder()}:${p.key}`;
// Storyteller pace on 2026-11-14 (papa-yeti-two-coins-of-wisdom, 20 parts): takes that read every word ran
// 1.7 to 2.25 words per second; two that skipped a sentence or more ran 2.44 and 3.7.
const PACE_MIN = 1.5, PACE_MID = 2.15, PACE_MAX = 2.35;
const countWords = blocks => blocks.map(b => b.text).join(" ").split(/\s+/).filter(Boolean).length;
const toDataUrl = buf => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(new Blob([buf], { type: "audio/wav" })); });

// One AI Studio run of some of a part's blocks, measured.
async function takeBlocks(tabId, blocks, p) {
  const res = await send(tabId, { type: "generateStory", blocks: blocks.map(({ slot, style, text }) => ({ slot, style, text })), voices: { 1: p.slot1, 2: p.slot2 } });
  if (!res?.ok) throw new Error(res?.error || "No answer from the AI Studio tab.");
  const m = await measure(res.dataUrl);
  const speech = m ? m.speech : res.duration || 0;
  return { res, m, speech, wps: speech ? countWords(blocks) / speech : 0 };
}

function replan() {
  // One block per run: a part can never take a second block.
  const maxChars = $("per-block").checked ? 1 : Math.max(200, Number($("max-chars").value) || 1500);
  parts = Story.planParts(storyBlocks(), { voices: voiceNames, styles: storyStyleMap(), maxChars });
}

async function loadStoryTakes() {
  storyTakes = (await chrome.storage.local.get(`ptakes:${folder()}`))[`ptakes:${folder()}`] || {};
  const got = await chrome.storage.local.get(parts.map(partKey));
  partAudio = {};
  for (const p of parts) if (got[partKey(p)]) partAudio[p.key] = got[partKey(p)];
}

function renderStoryVoices() {
  const box = $("story-voices");
  box.innerHTML = "";
  const blocks = storyBlocks();
  const counts = {};
  for (const b of blocks) counts[b.speaker] = (counts[b.speaker] || 0) + 1;
  const byVoice = {};
  for (const s of storySpeakers()) (byVoice[storyVoice(s)] ||= []).push(s);
  for (const s of storySpeakers()) {
    const row = document.createElement("div");
    row.className = "voice";
    const who = document.createElement("span");
    who.className = "who";
    who.textContent = `${s} · ${counts[s] || 0} block${counts[s] === 1 ? "" : "s"}`;
    const style = document.createElement("input");
    style.type = "text"; style.className = "style"; style.spellcheck = false;
    style.value = Story.baseStyle(s, storyStyleMap());
    style.title = "Delivery style typed into each of this speaker's blocks";
    style.addEventListener("change", async () => {
      const v = style.value.trim();
      if (story.styles) delete story.styles[s];
      if (v && v !== (Story.DEFAULT_STYLES[s] || Story.CAST_STYLE)) storyStyles[s] = v; else delete storyStyles[s];
      await chrome.storage.local.set({ storyStyles });
      replan(); renderParts();
    });
    const box2 = voiceBox(s, storyVoice(s), async name => {
      voiceNames[s] = name; await saveVoices();
      replan(); renderStoryVoices(); renderBlocks(); renderParts();
    });
    row.append(who, box2, style);
    const others = byVoice[storyVoice(s)].filter(x => x !== s);
    if (others.length) {
      const w = document.createElement("span");
      w.className = "lint";
      w.textContent = `⚠ same voice as ${others.join(", ")}`;
      row.append(w);
    }
    if (!Story.isFlowVoice(storyVoice(s))) {
      const w = document.createElement("span");
      w.className = "lint";
      w.textContent = `⚠ ${storyVoice(s)} is not in Google Flow: pick a Flow voice so this speaker's Flow Character can speak with it`;
      row.append(w);
    }
    box.appendChild(row);
  }
}

// Every speech block as it goes into AI Studio: "Speaker 1 - <voice>", its speaker, and its text.
function renderBlocks() {
  const body = $("story-lines");
  const speakers = storySpeakers();
  const blocks = storyBlocks();
  $("lines-summary").textContent = `Speech blocks (${blocks.length}: ${blocks.filter(b => b.speaker !== Story.NARRATOR).length} spoken by characters)`;
  body.innerHTML = "";
  for (const b of blocks) {
    const tr = document.createElement("tr");
    if (b.speaker !== Story.NARRATOR) tr.className = "quoted";
    tr.innerHTML = `<td class="cue">${b.id.slice(1)}</td><td><select></select><span class="sty"></span></td><td><span class="txt"></span></td>`;
    const sel = tr.querySelector("select");
    sel.innerHTML = speakers.map(s => `<option${s === b.speaker ? " selected" : ""}>${escapeHtml(s)}</option>`).join("");
    const keys = story.source === "story" ? b.ids : [b.id];
    if (keys.some(k => storyOverrides[k])) sel.classList.add("changed");
    sel.addEventListener("change", async () => {
      for (const k of keys) {
        const orig = (story.source === "story" ? story.lines : story.blocks).find(x => x.id === k).speaker;
        if (sel.value === orig) delete storyOverrides[k]; else storyOverrides[k] = sel.value;
      }
      await chrome.storage.local.set({ [overridesKey()]: storyOverrides });
      replan(); renderStoryVoices(); renderBlocks(); renderParts();
    });
    tr.querySelector(".sty").textContent = `Speaker 1 - ${storyVoice(b.speaker)}`;
    tr.querySelector(".txt").textContent = b.text;
    body.appendChild(tr);
  }
}

function partTake(p) {
  const t = storyTakes[p.key];
  if (t?.error) return `<span class="bad" title="${escapeHtml(t.error)}">failed</span>`;
  if (partAudio[p.key] && t) return `<span class="${t.pace ? "warn" : "ok"}" title="${t.wps ? `${t.wps.toFixed(1)} words/s` : ""}">${t.speech.toFixed(1)} s${t.pace ? " ⚠" : ""}</span>`;
  return `<span class="muted">${p.chars} ch</span>`;
}

function renderParts() {
  const body = $("story-parts");
  const checked = new Set([...body.querySelectorAll("input:checked")].map(i => i.dataset.key));
  const shown = new Set([...body.querySelectorAll("input")].map(i => i.dataset.key));
  body.innerHTML = "";
  for (const p of parts) {
    const tr = document.createElement("tr");
    tr.id = `part-${p.key}`;
    const voices = `S1 ${p.slot1}${p.slot2 ? ` · S2 ${p.slot2}` : ""}`;
    tr.innerHTML = `
      <td><input type="checkbox" data-key="${p.key}"></td>
      <td class="cue">${p.id}</td>
      <td>${escapeHtml(p.speakers.join(", "))}<span class="sty">${escapeHtml(voices)} · ${p.blocks.length} blocks</span><span class="sty" title="${escapeHtml(p.blocks.map(b => b.text).join(" "))}">${escapeHtml(p.blocks[0].text.slice(0, 70))}…</span></td>
      <td class="take">${partTake(p)}</td>
      <td class="btns"><button data-act="gen">${partAudio[p.key] ? "Retake" : "Generate"}</button>${partAudio[p.key] ? '<button data-act="play">Play</button>' : ""}</td>`;
    // Keep the tick of a row already shown; a new row is ticked when its part has no take yet.
    tr.querySelector("input").checked = shown.has(p.key) ? checked.has(p.key) : !partAudio[p.key];
    tr.querySelector('[data-act="gen"]').addEventListener("click", () => runParts([p]));
    tr.querySelector('[data-act="play"]')?.addEventListener("click", () => new Audio(partAudio[p.key]).play());
    body.appendChild(tr);
  }
  const done = parts.filter(p => partAudio[p.key]).length;
  $("guide-info").textContent = `${story.title} · ${storyBlocks().length} speech blocks · ${storySpeakers().length} speakers · ${parts.length} parts (${done} done)`;
}

async function saveStoryTakes() { await chrome.storage.local.set({ [`ptakes:${folder()}`]: storyTakes }); }

async function download(url, name) {
  await chrome.downloads.download({ url, filename: `${folder()}/${name}`, conflictAction: "overwrite", saveAs: false });
}

async function runParts(list) {
  if (storyRunning || running || !list.length) return;
  const st = await refreshStatus();
  if (!st) { log("AI Studio is not ready: open generate-speech, click The Master Storyteller, and keep that tab open."); return; }
  storyRunning = true; stopFlag = false;
  $("story-run").disabled = true; $("story-stop").disabled = false;
  const delay = Math.max(0, Number($("story-delay").value) || 0) * 1000;
  try {
    for (const [i, p] of list.entries()) {
      if (stopFlag) { log("Stopped."); break; }
      document.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"));
      $(`part-${p.key}`)?.classList.add("active");
      log(`${p.id} (${p.speakers.join(", ")}; S1 ${p.slot1}${p.slot2 ? `, S2 ${p.slot2}` : ""}; ${p.blocks.length} blocks): generating…`);
      try {
        // A take read much faster or slower than a storyteller's pace has usually dropped or repeated words
        // (seen on 2026-11-14: 91 words in 24.6 s, about a third of the text skipped), so it is retaken once
        // and the take nearer the normal pace is kept.
        const words = countWords(p.blocks);
        const odd = t => words >= 12 && (t.wps > PACE_MAX || t.wps < PACE_MIN);
        let t = await takeBlocks(st.tab.id, p.blocks, p);
        if (odd(t) && !stopFlag) {
          log(`${p.id}: ${t.wps.toFixed(1)} words/s (${words} words in ${t.speech.toFixed(1)} s) looks like skipped or repeated words; retaking.`);
          if (delay) await sleep(delay);
          const again = await takeBlocks(st.tab.id, p.blocks, p);
          if (Math.abs(again.wps - PACE_MID) < Math.abs(t.wps - PACE_MID)) t = again;
        }
        // Seen on 2026-11-14: one four-block part lost a third of its words on every take, while the same
        // blocks run in two halves read every word. So a part still off pace is voiced in two halves and joined.
        if (odd(t) && p.blocks.length >= 2 && !stopFlag) {
          const mid = Math.ceil(p.blocks.length / 2);
          log(`${p.id}: still ${t.wps.toFixed(1)} words/s; voicing it in two halves (blocks 1-${mid} and ${mid + 1}-${p.blocks.length}).`);
          const halves = [];
          for (const half of [p.blocks.slice(0, mid), p.blocks.slice(mid)]) {
            if (delay) await sleep(delay);
            halves.push(await takeBlocks(st.tab.id, half, p));
          }
          const items = [];
          for (const [i, h] of halves.entries()) items.push({ id: `${p.id}${"ab"[i]}`, wav: await bytes(h.res.dataUrl) });
          const joined = Stitch.joinTakes({ items, gap: 0.4, pre: 0.02, post: 0.2 });
          const dataUrl = await toDataUrl(joined.wav);
          const m = await measure(dataUrl);
          const speech = m ? m.speech : joined.length;
          t = { res: { dataUrl, duration: joined.length }, m, speech, wps: speech ? words / speech : 0 };
          log(`${p.id}: halves read ${halves.map(h => h.wps.toFixed(1)).join(" and ")} words/s; joined.`);
        }
        const { res, m } = t;
        await download(res.dataUrl, `parts/${p.id.toLowerCase()}.wav`);
        partAudio[p.key] = res.dataUrl;
        await chrome.storage.local.set({ [partKey(p)]: res.dataUrl });
        const pace = words >= 12 && (t.wps > PACE_MAX || t.wps < PACE_MIN);
        storyTakes[p.key] = { id: p.id, speech: m ? m.speech : res.duration || 0, total: m ? m.total : res.duration, wps: t.wps, pace, at: new Date().toISOString() };
        log(`${p.id}: saved parts/${p.id.toLowerCase()}.wav, ${storyTakes[p.key].speech.toFixed(1)} s of speech (${t.wps.toFixed(1)} words/s)${pace ? " — still an odd pace: listen for skipped words and retake" : ". Listen for the exact words."}`);
      } catch (e) {
        storyTakes[p.key] = { id: p.id, error: e.message, at: new Date().toISOString() };
        log(`${p.id}: FAILED — ${e.message}`);
        if (/not found|did not open|Master Storyteller|Run button|quota|arrange|Add speech block/i.test(e.message)) { log("Stopping: fix this in AI Studio, then continue."); stopFlag = true; }
      }
      await saveStoryTakes();
      renderParts();
      if (delay && i < list.length - 1 && !stopFlag) await sleep(delay);
    }
  } finally {
    storyRunning = false;
    $("story-run").disabled = false; $("story-stop").disabled = true;
    document.querySelectorAll("tr.active").forEach(r => r.classList.remove("active"));
  }
  if ($("auto-join").checked && parts.every(p => partAudio[p.key])) await joinStory();
}

async function joinStory() {
  if (!story) return;
  const missing = parts.filter(p => !partAudio[p.key]).map(p => p.id);
  if (missing.length) log(`⚠ Joining without ${missing.join(", ")}: generate them for the whole story.`);
  const items = [];
  for (const p of parts) if (partAudio[p.key]) items.push({ id: p.id, wav: await bytes(partAudio[p.key]) });
  if (!items.length) { log("No parts to join yet."); return; }
  const r = Stitch.joinTakes({ items, gap: Math.max(0, Number($("gap").value) || 0) });
  for (const n of r.notes) log(`  ⚠ ${n}`);
  if (!r.wav) return;
  const url = URL.createObjectURL(new Blob([r.wav], { type: "audio/wav" }));
  try { await download(url, "story-full.wav"); } finally { setTimeout(() => URL.revokeObjectURL(url), 60000); }
  const mm = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  log(`Saved story-full.wav (${mm(r.length)}, ${items.length} parts: ${r.placed.map(p => `${p.id}@${mm(p.start)}`).join(" ")})`);
  // Which blocks each part take holds, for tools/ai-studio-voice-runner/film-audio.mjs (the film's timeline).
  const manifest = { title: story.title, slug: story.slug, perBlock: $("per-block").checked,
    parts: parts.filter(p => partAudio[p.key]).map(p => ({ id: p.id, file: `parts/${p.id.toLowerCase()}.wav`, blocks: p.blocks.map(b => b.id), start: +(r.placed.find(x => x.id === p.id)?.start || 0).toFixed(3) })) };
  await download("data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 1)), "story-manifest.json");
}

// Saves the blocks as a speech-blocks file, which loads back exactly as it is (edit it, then drop it here).
async function saveSpeechBlocks() {
  if (!story) return;
  const speakers = storySpeakers();
  const md = Story.speechBlocksMarkdown({ title: story.title, speakers, blocks: storyBlocks(), voices: voiceNames, styles: storyStyleMap() });
  const name = `${story.slug}-speech-blocks.md`;
  await download("data:text/markdown;charset=utf-8," + encodeURIComponent(md), name);
  log(`Saved ${folder()}/${name}`);
  const seen = {};
  for (const s of speakers) (seen[storyVoice(s)] ||= []).push(s);
  const shared = Object.entries(seen).filter(([, ss]) => ss.length > 1);
  if (shared.length) log(`⚠ ${shared.map(([v, ss]) => `${ss.join(" and ")} share ${v}`).join("; ")}: give each speaker its own voice, or their blocks load back as one speaker.`);
}

async function loadStory(text, name) {
  const blocksFile = Story.isSpeechBlocks(text);
  story = blocksFile ? Story.parseSpeechBlocks(text, name) : Story.parseStory(text, name);
  guide = null;
  $("folder").value = story.folder;
  storyOverrides = (await chrome.storage.local.get(overridesKey()))[overridesKey()] || {};
  if (!voiceNames[Story.NARRATOR]) voiceNames[Story.NARRATOR] = Story.DEFAULT_VOICE;
  if (blocksFile) {
    // The file's voices are the ones chosen for this story; the Yeti family keeps its fixed voices.
    for (const [s, v] of Object.entries(story.voices)) {
      if (Story.isFixed(s)) { if (v.toLowerCase() !== Story.FIXED_VOICES[s].toLowerCase()) log(`⚠ ${s} is always ${Story.FIXED_VOICES[s]}; the file's ${v} is ignored.`); }
      else voiceNames[s] = v;
    }
  }
  await saveVoices();
  replan();
  await loadStoryTakes();
  showMode("story");
  renderStoryVoices(); renderBlocks();
  $("story-parts").innerHTML = "";
  renderParts();
  const blocks = storyBlocks();
  log(`Loaded ${name}: ${blocks.length} speech blocks, ${parts.length} parts.${blocksFile ? "" : " Check the Speech blocks list for who says each quote."}`);
  if (!blocksFile) {
    const unknown = story.lines.filter(l => l.quoted && l.speaker === Story.NARRATOR).map(l => l.id);
    if (unknown.length) log(`⚠ No speaker found for ${unknown.join(", ")}; they are read by the Narrator until you pick one.`);
  }
  const notFlow = [...new Set(blocks.map(b => storyVoice(b.speaker)))].filter(v => !Story.isFlowVoice(v));
  if (notFlow.length) log(`⚠ Not Google Flow voices: ${notFlow.join(", ")}. A recording made with them stays as it is; for a new one, pick Flow voices.`);
}

function showMode(mode) {
  for (const id of ["story-voices-section", "story-lines-section", "story-parts-section"]) $(id).hidden = mode !== "story";
  for (const id of ["voices-section", "cues-section", "tracks-section"]) $(id).hidden = mode !== "guide";
}

async function loadGuide(text, name) {
  guide = parseGuide(text, name);
  story = null;
  $("folder").value = guide.folder;
  takes = (await chrome.storage.local.get(`takes:${guide.folder}`))[`takes:${guide.folder}`] || {};
  await loadAudio();
  const videos = new Set(guide.cues.map(c => c.video)).size;
  $("guide-info").textContent = `${guide.title} · ${guide.cues.length} cues · ${videos} videos · ${guide.voices.length} speakers`;
  renderVoices(); renderCues();
  select(c => !takes[c.id] || takes[c.id].error);
  showMode("guide");
  log(`Loaded ${name}.`);
  const flagged = guide.cues.filter(c => c.lint.length);
  if (flagged.length) log(`⚠ Check the text of ${flagged.map(c => c.id).join(", ")}: it may be read aloud.`);
  const untimed = guide.cues.filter(c => !c.range).map(c => c.id);
  if (untimed.length) log(`⚠ No clip time for ${untimed.join(", ")}; they are left out of the video tracks.`);
}

async function loadFile(f) {
  if (!f) return;
  if (running || storyRunning) { log("Wait for the current run to finish before loading another file."); return; }
  if (!/\.(md|markdown|txt)$/i.test(f.name)) { log(`${f.name}: choose a Markdown story (.md).`); return; }
  try {
    const text = await f.text();
    if (/^##\s+Story\s*$/im.test(text) || Story.isSpeechBlocks(text)) await loadStory(text, f.name);
    else await loadGuide(text, f.name);
  } catch (err) {
    log(`Could not load ${f.name}: ${err.message}`);
  }
}

// ---------- Wiring ----------
$("guide-file").addEventListener("change", async e => { await loadFile(e.target.files[0]); e.target.value = ""; });
const drop = $("drop");
["dragenter", "dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("over"); }));
["dragleave", "drop"].forEach(t => drop.addEventListener(t, () => drop.classList.remove("over")));
drop.addEventListener("drop", e => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); });
// A file dropped anywhere else in the panel would make Chrome open it; send it to the loader instead.
window.addEventListener("dragover", e => e.preventDefault());
window.addEventListener("drop", e => { e.preventDefault(); if (e.target !== drop && !drop.contains(e.target)) loadFile(e.dataTransfer.files[0]); });

$("refresh-voices").onclick = refreshCatalog;
$("voice-search").addEventListener("input", renderCatalog);
$("all-voices").addEventListener("change", () => { renderCatalog(); if (story) renderStoryVoices(); else if (guide) renderVoices(); });
for (const id of ["max-chars", "per-block"]) $(id).addEventListener("change", async () => { if (!story) return; replan(); await loadStoryTakes(); $("story-parts").innerHTML = ""; renderParts(); });
$("story-run").onclick = () => runParts(parts.filter(p => $("story-parts").querySelector(`input[data-key="${p.key}"]`)?.checked));
$("story-stop").onclick = () => { stopFlag = true; log("Stopping after the current part…"); };
$("story-join").onclick = () => joinStory().catch(e => log(`Joining failed: ${e.message}`));
$("story-script").onclick = () => saveSpeechBlocks().catch(e => log(`Could not save the speech blocks: ${e.message}`));

$("folder").addEventListener("change", async () => {
  if (story) { await loadStoryTakes(); renderParts(); return; }
  if (!guide) return;
  takes = (await chrome.storage.local.get(`takes:${folder()}`))[`takes:${folder()}`] || {};
  await loadAudio();
  renderCues();
});
$("take-files").addEventListener("change", async e => {
  if (!guide || !e.target.files.length) return;
  try { await importTakes([...e.target.files]); } catch (err) { log(`Could not load takes: ${err.message}`); }
  e.target.value = "";
});
$("build-videos").onclick = () => buildVideoTracks().catch(e => log(`Stitching failed: ${e.message}`));
$("build-film").onclick = () => buildFilmTrack().catch(e => log(`Stitching failed: ${e.message}`));
$("sel-all").onclick = () => select(() => true);
$("sel-none").onclick = () => select(() => false);
$("sel-todo").onclick = () => select(c => !takes[c.id] || takes[c.id].error);
$("sel-long").onclick = () => select(c => takes[c.id] && !takes[c.id].error && !takes[c.id].ok);
$("run").onclick = () => runCues(selected());
$("stop").onclick = () => { stopFlag = true; log("Stopping after the current take…"); };
$("report").onclick = () => guide && saveReport();

(async () => {
  const got = await chrome.storage.local.get(["voices", "voiceCatalog", "storyStyles"]);
  voiceNames = got.voices || {};
  catalog = got.voiceCatalog || [];
  storyStyles = got.storyStyles || {};
  // Saved voices that Google Flow does not have (Riko, the old Narrator default, and the like) move to the
  // Flow defaults: the Narrator to Charon, anyone else back to the default, to be chosen again.
  const moved = [];
  for (const [speaker, v] of Object.entries(voiceNames)) {
    if (Story.isFixed(speaker) || Story.isFlowVoice(v)) continue;
    if (speaker === Story.NARRATOR) voiceNames[speaker] = Story.DEFAULT_VOICE; else delete voiceNames[speaker];
    moved.push(`${speaker} (${v})`);
  }
  if (moved.length) {
    await saveVoices();
    log(`Voices not in Google Flow were reset: ${moved.join(", ")}. The Narrator is now ${Story.DEFAULT_VOICE}; pick the others from the Flow voices.`);
  }
  renderCatalog();
  await refreshStatus();
  setInterval(() => { if (!running && !storyRunning) refreshStatus(); }, 5000);
})();
