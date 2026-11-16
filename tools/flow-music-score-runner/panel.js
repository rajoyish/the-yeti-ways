// Flow Music Score Runner: side panel.
// Loads a music guide and the reference voice WAV, generates every movement
// in Flow Music through content.js, keeps each take in IndexedDB, and builds
// one WAV exactly as long as the voice track.
'use strict';

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const state = {
  guideText: '',
  guideName: '',
  ref: null,            // {name, duration, sampleRate, channels, frames}
  plan: null,
  overrides: {},        // jobId → {sound, length}
  takes: {},            // jobId → {songId, size, duration, name, at}
  selected: new Set(),
  open: new Set(),
  running: false,
  stop: false,
};

// ---------- log ----------
function log(msg, cls) {
  const t = new Date().toLocaleTimeString();
  const line = document.createElement('div');
  line.textContent = `${t}  ${msg}`;
  if (cls) line.className = cls;
  $('log').prepend(line);
}

// ---------- settings & storage ----------
const SETTINGS = ['model', 'crossfade', 'sampleRate', 'bits', 'peakDb', 'saveTakes'];
function settings() {
  return {
    model: $('model').value,
    crossfade: Number($('crossfade').value) || 3,
    sampleRate: Number($('sampleRate').value),
    bits: Number($('bits').value),
    peakDb: Number($('peakDb').value),
    saveTakes: $('saveTakes').checked,
  };
}
async function saveState() {
  const s = settings();
  await chrome.storage.local.set({
    settings: s,
    guideText: state.guideText,
    guideName: state.guideName,
    ref: state.ref,
    [`overrides:${slug()}`]: state.overrides,
    [`takes:${slug()}`]: state.takes,
  });
}
async function loadState() {
  const d = await chrome.storage.local.get(null);
  if (d.settings) for (const k of SETTINGS) {
    if (!(k in d.settings)) continue;
    if ($(k).type === 'checkbox') $(k).checked = d.settings[k]; else $(k).value = d.settings[k];
  }
  state.guideText = d.guideText || '';
  state.guideName = d.guideName || '';
  state.ref = d.ref || null;
  rebuildPlan(false);
  state.overrides = d[`overrides:${slug()}`] || {};
  state.takes = d[`takes:${slug()}`] || {};
  rebuildPlan(false);
}
const slug = () => state.plan?.slug || 'none';

// ---------- IndexedDB for take bytes ----------
let dbp;
function db() {
  dbp = dbp || new Promise((res, rej) => {
    const r = indexedDB.open('fmr', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('takes');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function idb(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const tx = d.transaction('takes', mode);
    const req = fn(tx.objectStore('takes'));
    tx.oncomplete = () => res(req?.result);
    tx.onerror = () => rej(tx.error);
  });
}
const putTake = (id, buf) => idb('readwrite', (s) => s.put(buf, `${slug()}/${id}`));
const getTake = (id) => idb('readonly', (s) => s.get(`${slug()}/${id}`));

// ---------- plan ----------
function rebuildPlan(render = true) {
  if (!state.guideText) { state.plan = null; renderJobs(); return; }
  try {
    state.plan = ScorePlan.buildPlan(state.guideText, { duration: state.ref?.duration, overlap: settings().crossfade + 1 });
    for (const j of state.plan.jobs) {
      const o = state.overrides[j.id];
      if (o?.sound) j.sound = o.sound;
      j.model = settings().model;
    }
    $('guideName').textContent = `${state.guideName} — ${state.plan.jobs.length} movements, ${state.plan.cues} SFX cues`;
    $('guideDrop').classList.add('loaded');
    for (const w of state.plan.jobs.flatMap((j) => j.warnings)) log(w, 'st-warn');
  } catch (e) {
    state.plan = null;
    log(e.message, 'st-bad');
  }
  if (state.ref) {
    $('refName').textContent = `${state.ref.name} — ${state.ref.duration.toFixed(3)} s (${state.ref.frames} frames @ ${state.ref.sampleRate} Hz)`;
    $('refDrop').classList.add('loaded');
  }
  if (render) renderJobs();
}

const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

function renderJobs() {
  const tb = $('jobs').querySelector('tbody');
  tb.innerHTML = '';
  if (!state.plan) { $('planHint').textContent = 'Load a music guide to see its movements.'; return; }
  const total = state.plan.duration;
  $('planHint').textContent = `${state.plan.film}: ${fmt(total)} (${total.toFixed(3)} s)${state.ref ? '' : ' — load the reference WAV to lock the length'}. Music and effects are made together in each movement, instrumental only.`;
  for (const j of state.plan.jobs) {
    const t = state.takes[j.id];
    const tr = document.createElement('tr');
    const fit = t ? fitNote(j, t) : null;
    tr.innerHTML = `
      <td><input type="checkbox" ${state.selected.has(j.id) ? 'checked' : ''}></td>
      <td><b>M${j.n}</b> ${escapeHtml(j.name)}<div class="hint mono">ask ${j.length}${j.bpm ? ` · ${j.bpm} BPM` : ''} · ${j.sound.length} chars</div></td>
      <td class="mono">${fmt(j.start)}–${fmt(j.end)}<br>${j.slot.toFixed(2)} s</td>
      <td class="mono status">${t ? `<span class="${fit.cls}">${t.duration.toFixed(2)} s</span><br><a href="https://www.flowmusic.app/song/${t.songId}" target="_blank">${t.songId ? t.songId.slice(0, 8) : 'file'}</a>` : '<span class="hint">—</span>'}</td>
      <td><button class="small more">${state.open.has(j.id) ? 'Hide' : 'Edit'}</button>${t ? ' <button class="small play">▶</button>' : ''}</td>`;
    tr.querySelector('input').onchange = (e) => { e.target.checked ? state.selected.add(j.id) : state.selected.delete(j.id); };
    tr.querySelector('.more').onclick = () => { state.open.has(j.id) ? state.open.delete(j.id) : state.open.add(j.id); renderJobs(); };
    const pb = tr.querySelector('.play');
    if (pb) pb.onclick = () => playTake(j.id);
    tr.dataset.id = j.id;
    tb.appendChild(tr);
    if (state.open.has(j.id)) tb.appendChild(detailRow(j, t, fit));
  }
}

function fitNote(j, t) {
  const jobs = state.plan.jobs;
  const first = j === jobs[0];
  const last = j === jobs[jobs.length - 1];
  const xf = settings().crossfade;
  const need = j.slot + (first ? 0 : xf / 2) + (last ? 0 : xf / 2);
  if (t.duration >= need) return { cls: 'st-ok', text: 'covers its window' };
  if (t.duration >= need * 0.94) return { cls: 'st-warn', text: `${(need - t.duration).toFixed(2)} s short: slowed slightly to fit` };
  return { cls: 'st-bad', text: `${(need - t.duration).toFixed(2)} s short: retake it` };
}

function detailRow(j, t, fit) {
  const tr = document.createElement('tr');
  tr.className = 'detail';
  tr.innerHTML = `<td colspan="5">
    <div class="hint">Sound prompt sent to Compose (max ${ScorePlan.SOUND_MAX} chars). Title: <span class="mono">${escapeHtml(j.title)}</span></div>
    <textarea maxlength="${ScorePlan.SOUND_MAX}"></textarea>
    <div class="row"><button class="small save">Save prompt</button><button class="small reset">Reset to guide</button>
      <span class="hint count"></span></div>
    <div class="hint">${t ? `Take: ${t.name || ''} · ${fit.text}` : 'No take yet.'}</div>
    <div class="row"><input type="text" class="song" placeholder="Use an existing Flow Music song: paste its link or ID"><button class="small use">Fetch</button></div>
    <div class="row"><label class="small"><input type="file" accept=".wav,audio/wav" class="file"> or load a WAV from disk</label></div>
  </td>`;
  const ta = tr.querySelector('textarea');
  ta.value = j.sound;
  const count = () => { tr.querySelector('.count').textContent = `${ta.value.length} chars`; };
  ta.oninput = count; count();
  tr.querySelector('.save').onclick = async () => { state.overrides[j.id] = { sound: ta.value }; await saveState(); rebuildPlan(); log(`${j.id}: prompt saved.`); };
  tr.querySelector('.reset').onclick = async () => { delete state.overrides[j.id]; await saveState(); rebuildPlan(); };
  tr.querySelector('.use').onclick = async () => {
    const v = tr.querySelector('.song').value.trim();
    const id = (v.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/) || [])[0];
    if (!id) return log('That is not a Flow Music song link or ID.', 'st-bad');
    await guard(() => fetchAndKeep(j, id));
  };
  tr.querySelector('.file').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    await keepTake(j, buf, { songId: '', name: f.name, save: false });
  };
  return tr;
}

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Flow Music tab ----------
async function flowTab() {
  const tabs = await chrome.tabs.query({ url: 'https://www.flowmusic.app/*' });
  if (!tabs.length) return null;
  const [active] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tabs.find((t) => t.id === active?.id) || tabs.find((t) => /\/session\//.test(t.url)) || tabs[0];
}
async function send(msg) {
  const tab = await flowTab();
  if (!tab) throw new Error('Open https://www.flowmusic.app in a tab first.');
  try {
    return await chrome.tabs.sendMessage(tab.id, msg);
  } catch (e) {
    throw new Error('The Flow Music tab is not ready. Reload it (the extension was probably installed or updated after the tab opened).');
  }
}
async function refreshPill() {
  const p = $('pill');
  try {
    const s = await send({ type: 'status' });
    if (!s?.ok) throw new Error(s?.error || 'no answer');
    if (!s.loggedIn) { p.textContent = 'Sign in to Flow Music'; p.className = 'pill bad'; return s; }
    p.textContent = s.session ? (s.busy ? 'Flow Music: creating…' : 'Flow Music session ready') : 'Open a session in Flow Music';
    p.className = `pill ${s.session ? 'ok' : 'bad'}`;
    return s;
  } catch (e) {
    p.textContent = e.message.startsWith('Open') ? 'Flow Music tab not open' : 'Reload the Flow Music tab';
    p.className = 'pill bad';
    return null;
  }
}

// Streams one song's WAV from the content script.
async function fetchWav(songId) {
  const tab = await flowTab();
  if (!tab) throw new Error('Flow Music tab not open.');
  const port = chrome.tabs.connect(tab.id, { name: 'fmr-wav' });
  return new Promise((resolve, reject) => {
    let out = null, name = '', got = 0;
    port.onMessage.addListener((m) => {
      if (m.type === 'meta') { out = new Uint8Array(m.size); name = m.name; }
      else if (m.type === 'chunk') {
        const bin = atob(m.b64);
        for (let i = 0; i < bin.length; i++) out[m.offset + i] = bin.charCodeAt(i);
        got += bin.length;
      } else if (m.type === 'done') { port.disconnect(); got === out.length ? resolve({ name, buf: out.buffer }) : reject(new Error(`WAV incomplete (${got}/${out.length} bytes).`)); }
      else if (m.type === 'error') { port.disconnect(); reject(new Error(m.error)); }
    });
    port.onDisconnect.addListener(() => { if (!out || got < out.length) reject(new Error('The Flow Music tab closed the connection.')); });
    port.postMessage({ type: 'fetch', songId });
  });
}

async function decode(buf, rate) {
  const ctx = new OfflineAudioContext(2, 1, rate || 48000);
  return ctx.decodeAudioData(buf.slice(0));
}

async function keepTake(j, buf, { songId, name, save }) {
  const info = Score.wavInfo(buf);
  const duration = info ? info.duration : (await decode(buf)).duration;
  await putTake(j.id, buf);
  state.takes[j.id] = { songId, size: buf.byteLength, duration, name, at: Date.now() };
  await saveState();
  if (save && settings().saveTakes) {
    const fn = `flow-music-score/${slug()}/takes/${j.id}-${songId.slice(0, 8)}.wav`;
    await download(new Blob([buf], { type: 'audio/wav' }), fn);
  }
  const fit = fitNote(j, state.takes[j.id]);
  log(`${j.id}: take ${duration.toFixed(2)} s for a ${j.slot.toFixed(2)} s window — ${fit.text}.`, fit.cls);
  renderJobs();
}

async function fetchAndKeep(j, songId) {
  log(`${j.id}: downloading WAV of ${songId.slice(0, 8)}…`, 'st-run');
  const { name, buf } = await fetchWav(songId);
  await keepTake(j, buf, { songId, name, save: true });
}

async function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const id = await chrome.downloads.download({ url, filename, conflictAction: 'overwrite', saveAs: false });
    await new Promise((res) => {
      const on = (d) => { if (d.id === id && d.state && d.state.current !== 'in_progress') { chrome.downloads.onChanged.removeListener(on); res(); } };
      chrome.downloads.onChanged.addListener(on);
      setTimeout(res, 120000);
    });
    return id;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

// ---------- actions ----------
async function guard(fn) {
  if (state.running) return log('Busy: wait or press Stop.', 'st-warn');
  state.running = true; state.stop = false;
  setBusy(true);
  try { await fn(); } catch (e) { log(e.message || String(e), 'st-bad'); } finally { state.running = false; setBusy(false); refreshPill(); }
}
function setBusy(b) { for (const id of ['genSel', 'build']) $(id).disabled = b; }

async function generateSelected() {
  if (!state.plan) throw new Error('Load a music guide first.');
  if (!state.ref) log('No reference WAV loaded: using the guide\'s length. Load story-full.wav for an exact match.', 'st-warn');
  const jobs = state.plan.jobs.filter((j) => state.selected.has(j.id));
  if (!jobs.length) throw new Error('Tick the movements to generate.');
  const s = await refreshPill();
  if (!s) throw new Error('Flow Music tab not reachable.');
  if (!s.session) log('No session is open: the first song may be lost while Flow Music creates the session. Open an existing session for the most reliable run.', 'st-warn');
  for (const j of jobs) {
    if (state.stop) break;
    let done = false;
    for (let attempt = 1; attempt <= 2 && !done && !state.stop; attempt++) {
      log(`${j.id}: generating ${j.length} in Flow Music${attempt > 1 ? ' (retry)' : ''}…`, 'st-run');
      markRow(j.id, 'generating…');
      const r = await send({ type: 'generate', job: { ...j, model: settings().model } });
      if (!r?.ok) { log(`${j.id}: ${r?.error || 'no answer'}`, 'st-bad'); if (/not start|lost/i.test(r?.error || '')) continue; break; }
      log(`${j.id}: song ${r.songId.slice(0, 8)} ready in ${r.secs.toFixed(0)} s.`);
      markRow(j.id, 'downloading…');
      await sleep(1500);
      await fetchAndKeep(j, r.songId);
      state.selected.delete(j.id);
      done = true;
    }
  }
  renderJobs();
}
function markRow(id, text) {
  const td = document.querySelector(`tr[data-id="${id}"] .status`);
  if (td) td.innerHTML = `<span class="st-run">${text}</span>`;
}

async function build() {
  if (!state.plan) throw new Error('Load a music guide first.');
  if (!state.ref) throw new Error('Load the reference voice WAV (story-full.wav) first: the score is cut to its exact length.');
  const st = settings();
  const jobs = state.plan.jobs;
  const missing = jobs.filter((j) => !state.takes[j.id]);
  if (missing.length) throw new Error(`No take yet for ${missing.map((j) => j.id).join(', ')}.`);
  log('Building: decoding takes…', 'st-run');
  const buffers = [];
  for (const j of jobs) {
    const buf = await getTake(j.id);
    if (!buf) throw new Error(`${j.id}: take bytes are missing from storage. Fetch it again.`);
    buffers.push(await decode(buf, st.sampleRate));
  }
  const layout = Score.planLayout(jobs, buffers.map((b) => b.duration), { duration: state.ref.duration, crossfade: st.crossfade });
  for (const w of layout.warnings) log(w, w.includes('Regenerate') ? 'st-bad' : 'st-warn');
  log('Rendering…', 'st-run');
  const out = await Score.render(layout, buffers, { sampleRate: st.sampleRate, peakDb: st.peakDb });
  const wav = Score.encodeWav(out.channels, out.sampleRate, st.bits);
  const check = Score.wavInfo(wav);
  const exact = Math.round(state.ref.duration * st.sampleRate);
  const ok = check.frames === exact;
  const name = `flow-music-score/${slug()}/${slug()}-music-sfx-bed.wav`;
  await download(new Blob([wav], { type: 'audio/wav' }), name);
  const report = {
    film: state.plan.film,
    reference: state.ref,
    output: { file: name, sampleRate: out.sampleRate, bits: st.bits, channels: 2, frames: check.frames, duration: check.duration, peakGainDb: 20 * Math.log10(out.gain) },
    crossfade: st.crossfade,
    segments: layout.segs.map((s, i) => ({ ...s, songId: state.takes[jobs[i].id].songId, takeDuration: buffers[i].duration })),
    warnings: layout.warnings,
    builtAt: new Date().toISOString(),
  };
  await download(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }), `flow-music-score/${slug()}/${slug()}-music-sfx-bed.json`);
  $('preview').src = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
  $('preview').hidden = false;
  const msg = `${name}: ${check.duration.toFixed(3)} s, ${check.frames} frames @ ${out.sampleRate} Hz ${st.bits}-bit stereo — ${ok ? 'exactly' : 'NOT'} the reference length (${state.ref.duration.toFixed(3)} s).`;
  $('buildInfo').textContent = msg;
  log(msg, ok ? 'st-ok' : 'st-bad');
}

async function playTake(id) {
  const buf = await getTake(id);
  if (!buf) return log(`${id}: no bytes stored.`, 'st-bad');
  $('preview').src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  $('preview').hidden = false;
  $('preview').play();
}

// ---------- inputs ----------
function dropZone(zone, input, onFile) {
  input.onchange = () => input.files[0] && onFile(input.files[0]);
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) onFile(f); });
}

async function loadGuide(file) {
  state.guideText = await file.text();
  state.guideName = file.name;
  rebuildPlan(false);
  const d = await chrome.storage.local.get([`overrides:${slug()}`, `takes:${slug()}`]);
  state.overrides = d[`overrides:${slug()}`] || {};
  state.takes = d[`takes:${slug()}`] || {};
  state.selected = new Set(state.plan ? state.plan.jobs.filter((j) => !state.takes[j.id]).map((j) => j.id) : []);
  rebuildPlan();
  await saveState();
  if (state.plan) log(`Loaded ${file.name}: ${state.plan.jobs.length} movements.`);
}

async function loadRef(file) {
  const head = await file.slice(0, 1 << 20).arrayBuffer();
  let info = Score.wavInfo(head);
  if (!info) {
    const b = await decode(await file.arrayBuffer(), 48000);
    info = { channels: b.numberOfChannels, sampleRate: 48000, frames: b.length, duration: b.duration };
  }
  state.ref = { name: file.name, duration: info.duration, sampleRate: info.sampleRate, channels: info.channels, frames: info.frames };
  rebuildPlan();
  await saveState();
  log(`Reference ${file.name}: ${info.duration.toFixed(3)} s.`);
}

// ---------- wire up ----------
dropZone($('guideDrop'), $('guideFile'), (f) => loadGuide(f).catch((e) => log(e.message, 'st-bad')));
dropZone($('refDrop'), $('refFile'), (f) => loadRef(f).catch((e) => log(e.message, 'st-bad')));
for (const k of SETTINGS) $(k).addEventListener('change', async () => { await saveState(); rebuildPlan(); });
$('all').onchange = (e) => { state.selected = new Set(e.target.checked && state.plan ? state.plan.jobs.map((j) => j.id) : []); renderJobs(); };
$('genSel').onclick = () => guard(generateSelected);
$('stop').onclick = async () => { state.stop = true; try { await send({ type: 'stop' }); } catch {} log('Stopping after the current step.', 'st-warn'); };
$('build').onclick = () => guard(build);

loadState().then(() => { renderJobs(); refreshPill(); });
setInterval(() => { if (!state.running) refreshPill(); }, 5000);
