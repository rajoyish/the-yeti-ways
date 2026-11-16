// Flow Music Score Runner: content script for https://www.flowmusic.app/*
//
// Drives the Compose panel (Lyrics: Instrumental on; Sound: Advanced on with
// BPM, Length, Model; Details: title), clicks Generate, waits for the new
// song card in the session, and fetches the song as WAV through the site's
// own More → Download → WAV (caught by hook.js before it reaches the disk).
//
// Messages (chrome.runtime.onMessage, from the side panel):
//   {type:'status'}                     → page and Compose state
//   {type:'generate', job}              → {ok, songId, title, secs}
//   {type:'stop'}                       → aborts a running wait
// Port 'fmr-wav' ({type:'fetch', songId}) streams the WAV back in base64
// chunks: {type:'meta'}, {type:'chunk'}…, {type:'done'} or {type:'error'}.
(function () {
  'use strict';
  if (window.__fmrContent) return;
  window.__fmrContent = true;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let stopFlag = false;

  const log = (...a) => console.log('[FMR]', ...a);

  function setValue(el, v) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    el.focus();
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  }

  // Radix-style menus open on pointerdown, not click.
  function press(el) {
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) {
      el.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, pointerType: 'mouse', button: 0 }));
    }
    el.click();
  }

  async function waitFor(fn, ms = 8000, step = 200) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const v = fn();
      if (v) return v;
      await sleep(step);
    }
    return null;
  }

  const byLabel = (t) => $$('label').find((l) => l.textContent.trim() === t)?.parentElement.querySelector('input');
  const soundBox = () => $('textarea[aria-label="Sound description"]');
  const titleBox = () => $$('textarea').find((t) => t.maxLength === 100);
  const generateBtn = () => $$('button').find((b) => b.textContent.trim() === 'Generate');
  const modelBtn = () => $$('button').find((b) => /^Lyria\b/.test(b.textContent.trim()) && b.closest('div'));
  const sessionId = () => (location.pathname.match(/\/session\/([0-9a-f-]{36})/) || [])[1] || null;

  function songCards() {
    const scope = $('main') || document;
    const seen = new Map();
    for (const a of $$('a[href^="/song/"]', scope)) {
      const id = a.getAttribute('href').split('/')[2];
      const title = a.textContent.trim();
      if (id && title && !seen.has(id)) seen.set(id, title);
    }
    return [...seen].map(([id, title]) => ({ id, title }));
  }

  // The "Choose" buttons of a "Which do you prefer?" box, in order (A, B).
  function pickVariantButtons() {
    const head = $$('main *').find((e) => e.childElementCount === 0 && e.textContent.trim() === 'Which do you prefer?');
    if (!head) return [];
    let box = head;
    for (let i = 0; i < 6 && box && !$$('button', box).some((b) => b.textContent.trim() === 'Choose'); i++) box = box.parentElement;
    return box ? $$('button', box).filter((b) => b.textContent.trim() === 'Choose') : [];
  }

  function status() {
    return {
      ok: true,
      url: location.href,
      session: sessionId(),
      loggedIn: !!$$('button,a').find((b) => /Settings menu/.test(b.getAttribute('aria-label') || '')),
      composeOpen: !!soundBox(),
      model: modelBtn()?.textContent.trim() || null,
      songs: songCards(),
      busy: /Creating "|Generating [^\n]*\d+%/.test(($('main') || document.body).innerText),
    };
  }

  async function openCompose() {
    if (soundBox()) return true;
    const t = $('button[aria-label="Toggle compose panel"]');
    if (!t) throw new Error('Compose button not found. Open a Flow Music session (flowmusic.app/session/…).');
    t.click();
    if (!(await waitFor(soundBox, 5000))) throw new Error('The Compose panel did not open.');
    return true;
  }

  async function switchOn(label) {
    const s = $(`[aria-label="${label}"]`);
    if (!s) throw new Error(`"${label}" switch not found.`);
    if (s.getAttribute('aria-checked') !== 'true') {
      s.click();
      await waitFor(() => s.getAttribute('aria-checked') === 'true', 2000);
    }
    if (s.getAttribute('aria-checked') !== 'true') throw new Error(`Could not turn on "${label}".`);
  }

  async function chooseModel(name) {
    if (!name) return;
    const b = modelBtn();
    if (!b) throw new Error('Model menu not found (Advanced sound mode must be on).');
    if (b.textContent.trim() === name) return;
    press(b);
    const opt = await waitFor(() => $$('[role=menuitem],[role=option],[role=menuitemradio],button')
      .find((e) => e !== b && e.textContent.trim().startsWith(name)), 3000);
    if (!opt) throw new Error(`Model "${name}" is not offered.`);
    press(opt);
    await waitFor(() => modelBtn()?.textContent.trim() === name, 2000);
    if (modelBtn()?.textContent.trim() !== name) throw new Error(`Could not select model "${name}".`);
  }

  // Fills Compose for one job and checks every field took.
  async function fill(job) {
    await openCompose();
    await switchOn('Toggle instrumental mode');
    await switchOn('Toggle advanced sound mode');
    if (!titleBox()) {
      $('button[aria-label="Expand Details section"]')?.click();
      await waitFor(titleBox, 3000);
    }
    // The Dynamics inputs re-mount right after Advanced is switched on, and
    // Length is a masked m:ss field that commits on blur, so every field is
    // re-queried, set, and read back until it holds.
    if (!(await waitFor(() => byLabel('BPM') && byLabel('Length'), 4000))) throw new Error('BPM / Length fields not found.');
    await sleep(400);
    const lyrics = $('textarea[aria-label="Lyrics"]');
    if (lyrics && lyrics.value && !lyrics.disabled) setValue(lyrics, '');
    const fields = [
      [soundBox, job.sound, 'Sound prompt'],
      [titleBox, job.title, 'Title'],
      [() => byLabel('BPM'), job.bpm ? String(job.bpm) : '', 'BPM'],
      [() => byLabel('Seed'), job.seed ? String(job.seed) : '', 'Seed'],
      [() => byLabel('Length'), job.length, 'Length'],
    ];
    await chooseModel(job.model);
    for (let pass = 0; pass < 4; pass++) {
      const bad = fields.filter(([get, want]) => get() && get().value !== want);
      if (!bad.length) break;
      for (const [get, want] of bad) setValue(get(), want);
      await sleep(350);
    }
    for (const [get, want, name] of fields) {
      const el = get();
      if (!el) { if (name === 'Title' || name === 'Seed') continue; throw new Error(`${name} field not found.`); }
      if (el.value !== want) throw new Error(`${name} shows "${el.value.slice(0, 40)}", wanted "${String(want).slice(0, 40)}".`);
    }
    return { sound: soundBox().value.length, length: byLabel('Length').value, bpm: byLabel('BPM').value, title: titleBox()?.value };
  }

  // Generates one job and waits for its song card.
  async function generate(job) {
    stopFlag = false;
    const before = new Set(songCards().map((s) => s.id));
    await fill(job);
    const g = generateBtn();
    if (!g || g.disabled) throw new Error('Generate is disabled.');
    const t0 = Date.now();
    g.click();
    log('generate', job.id, job.length);
    const timeout = (job.timeoutSec || 420) * 1000;
    let sawCreating = false;
    while (Date.now() - t0 < timeout) {
      if (stopFlag) throw new Error('Stopped.');
      await sleep(2000);
      const text = ($('main') || document.body).innerText;
      // A new song shows "Creating "<title>"…" in a fresh session, or a
      // "Generating <title> 39%" row in an existing one; its /song/ link
      // only appears once the audio is complete.
      const busy = /Creating "/.test(text) || /Generating [^\n]*\d+%/.test(text);
      if (busy) sawCreating = true;
      // Sometimes Flow Music makes two variants and asks "Which do you
      // prefer?" (feedback only, no credits). The song has no link until one
      // is chosen: take variant A (or job.variant = 1 for B).
      const choose = pickVariantButtons();
      if (choose.length) {
        sawCreating = true;
        const b = choose[Math.min(job.variant || 0, choose.length - 1)];
        log('variant choice shown; choosing', (job.variant || 0) === 0 ? 'A' : 'B');
        b.click();
        // It then asks "Delete the other song?": never delete, keep both.
        const keep = await waitFor(() => $$('button').find((x) => x.textContent.trim() === 'Keep Both'), 4000);
        if (keep) keep.click();
        await sleep(1500);
        continue;
      }
      const fresh = songCards().filter((s) => !before.has(s.id));
      const mine = fresh.find((s) => s.title === job.title) || fresh[0];
      if (mine && !busy) {
        await sleep(800);
        // Flow Music starts playing a new song; stop it so takes are quiet.
        $$('button[aria-label^="Pause "]').forEach((b) => b.click());
        return { ok: true, songId: mine.id, title: mine.title, secs: (Date.now() - t0) / 1000, session: sessionId(), others: fresh.filter((s) => s !== mine).map((s) => s.id) };
      }
      // No "Creating" message, no song, after a while: the request was lost
      // (seen when a brand-new session changes its URL mid-request).
      if (!sawCreating && Date.now() - t0 > 45000) throw new Error('Flow Music did not start the song. Open the session and try again.');
      const err = text.match(/(something went wrong[^\n]*|couldn['’]t (?:create|generate)[^\n]*|violat[^\n]*|limit reached[^\n]*|out of credits[^\n]*|try again later[^\n]*)/i);
      if (err && sawCreating && !/Creating "/.test(text)) throw new Error(`Flow Music: ${err[1].slice(0, 200)}`);
    }
    throw new Error(`No song after ${Math.round(timeout / 1000)} s.`);
  }

  // More options → Download → WAV for one song card; resolves with the bytes.
  async function captureWav(songId) {
    const link = await waitFor(() => $(`main a[href="/song/${songId}"]`) || $(`a[href="/song/${songId}"]`), 5000);
    if (!link) throw new Error(`Song ${songId} is not on this page. Open the session it was made in.`);
    const title = link.textContent.trim();
    const label = `More options for ${title}`;
    const mores = $$('button[aria-label^="More options for "]').filter((b) => b.getAttribute('aria-label') === label);
    const more = mores.find((b) => b.closest('main')) || mores[0];
    if (!more) throw new Error('More options button not found for that song.');
    more.scrollIntoView({ block: 'center' });
    const nonce = Math.random().toString(36).slice(2);
    const got = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { window.removeEventListener('message', on); reject(new Error('The WAV download did not start within 90 s.')); }, 90000);
      function on(ev) {
        const d = ev.data;
        if (ev.source !== window || !d || d.fmr !== 'wav' || d.nonce !== nonce) return;
        clearTimeout(timer);
        window.removeEventListener('message', on);
        if (d.error) reject(new Error(d.error)); else resolve({ name: d.name, buf: d.buf });
      }
      window.addEventListener('message', on);
    });
    const items = () => $$('[role=menuitem]');
    press(more);
    const dl = await waitFor(() => items().find((e) => e.textContent.trim() === 'Download'), 3000);
    if (!dl) throw new Error('Download menu item not found.');
    dl.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }));
    dl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    const wav = await waitFor(() => items().find((e) => e.textContent.trim() === 'WAV'), 3000);
    if (!wav) throw new Error('WAV option not found in the Download menu.');
    document.documentElement.dataset.fmrCapture = nonce;
    press(wav);
    return got;
  }

  async function bufToBase64Chunks(buf, size, onChunk) {
    for (let o = 0; o < buf.byteLength; o += size) {
      const blob = new Blob([buf.slice(o, Math.min(buf.byteLength, o + size))]);
      const b64 = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result).split(',')[1] || '');
        fr.onerror = () => rej(fr.error);
        fr.readAsDataURL(blob);
      });
      onChunk(b64, o);
    }
  }

  // Exposed for debugging in the page console and for tests.
  window.__FMR = { status, fill, generate, captureWav, songCards };

  if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) return;

  chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
    (async () => {
      try {
        if (msg.type === 'status') return reply(status());
        if (msg.type === 'stop') { stopFlag = true; return reply({ ok: true }); }
        if (msg.type === 'fill') return reply({ ok: true, got: await fill(msg.job) });
        if (msg.type === 'generate') return reply(await generate(msg.job));
        reply({ ok: false, error: `Unknown message ${msg.type}` });
      } catch (e) {
        reply({ ok: false, error: e.message || String(e) });
      }
    })();
    return true;
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'fmr-wav') return;
    port.onMessage.addListener(async (msg) => {
      if (msg.type !== 'fetch') return;
      try {
        const { name, buf } = await captureWav(msg.songId);
        port.postMessage({ type: 'meta', name, size: buf.byteLength });
        await bufToBase64Chunks(buf, 4 * 1024 * 1024, (b64, offset) => port.postMessage({ type: 'chunk', offset, b64 }));
        port.postMessage({ type: 'done' });
      } catch (e) {
        port.postMessage({ type: 'error', error: e.message || String(e) });
      }
    });
  });
})();
