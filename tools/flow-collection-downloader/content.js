// Flow Storyboard Downloader — content script for Google Flow.
//
// Drives Flow's own UI the way a person would:
//   create:   "+ New project" → rename → right-click → "New collection" → name, per video.
//   download: open each collection → right-click each video → Download → "1080p Upscaled",
//             wait for the file, go back, next collection.
// A running job is kept in chrome.storage.local, so a page reload resumes it.

(() => {
  if (window.__flowStoryboardDownloader) return;
  window.__flowStoryboardDownloader = true;
  document.documentElement.dataset.flowStoryboardDownloader = chrome.runtime.getManifest().version;

  const TAG = "[Flow Storyboard Downloader]";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
  const low = (s) => norm(s).toLowerCase();

  // ---------------------------------------------------------------- extension context

  // After the extension is reloaded, this old copy of the script stays in any
  // un-refreshed tab and every chrome.* call throws "Extension context invalidated"
  // synchronously (before a promise exists, so .catch() can't see it). Check first.
  const alive = () => { try { return !!chrome.runtime?.id; } catch { return false; } };

  // Fire-and-forget message to the side panel / background; never throws.
  function send(msg) {
    if (!alive()) return;
    try { chrome.runtime.sendMessage(msg).catch(() => {}); } catch {}
  }

  // ---------------------------------------------------------------- logging

  // Logged with console.info, never console.error: the side panel shows the
  // level, and console.error would fill chrome://extensions → Errors.
  function log(text, level = "info") {
    console.info(TAG, level === "info" ? "" : `[${level}]`, text);
    send({ type: "log", text, level });
  }

  // ---------------------------------------------------------------- DOM helpers

  async function waitFor(fn, timeout = 8000, step = 150) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      if (stopRequested) throw new Error("Stopped");
      let v;
      try { v = fn(); } catch { v = null; }
      if (v) return v;
      await sleep(step);
    }
    return null;
  }

  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0";
  }

  // Deepest visible elements whose own text matches.
  function findText(match, root = document) {
    const test = typeof match === "function" ? match : (t) => t === low(match);
    const hits = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    for (let el = walker.currentNode; el; el = walker.nextNode()) {
      if (el.nodeType !== 1 || el.closest("#__fsd_overlay")) continue;
      if (!test(low(el.textContent))) continue;
      if (!visible(el)) continue;
      hits.push(el);
    }
    return hits.filter((el) => !hits.some((o) => o !== el && el.contains(o)));
  }

  const clickable = (el) =>
    el.closest('button, a, [role="button"], [role="menuitem"], [role="option"], [role="tab"], li') || el;

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function fire(el, type, extra = {}) {
    const { x, y } = center(el);
    const init = { bubbles: true, cancelable: true, composed: true, view: window, clientX: x, clientY: y, ...extra };
    const Ctor = type.startsWith("pointer") ? PointerEvent : MouseEvent;
    el.dispatchEvent(new Ctor(type, { pointerId: 1, pointerType: "mouse", isPrimary: true, ...init }));
  }

  function hover(el) {
    for (const t of ["pointerover", "pointerenter", "mouseover", "mouseenter", "pointermove", "mousemove"]) fire(el, t);
  }

  function click(el) {
    el.scrollIntoView({ block: "center", inline: "center" });
    hover(el);
    fire(el, "pointerdown", { button: 0, buttons: 1 });
    fire(el, "mousedown", { button: 0, buttons: 1 });
    el.focus?.({ preventScroll: true });
    fire(el, "pointerup", { button: 0 });
    fire(el, "mouseup", { button: 0 });
    fire(el, "click", { button: 0 });
  }

  function rightClick(el) {
    el.scrollIntoView({ block: "center", inline: "center" });
    hover(el);
    fire(el, "pointerdown", { button: 2, buttons: 2 });
    fire(el, "mousedown", { button: 2, buttons: 2 });
    fire(el, "pointerup", { button: 2 });
    fire(el, "mouseup", { button: 2 });
    fire(el, "contextmenu", { button: 2 });
  }

  function pressKey(el, key) {
    const o = { key, code: key, keyCode: key === "Enter" ? 13 : key === "Escape" ? 27 : 0, bubbles: true, cancelable: true };
    el.dispatchEvent(new KeyboardEvent("keydown", o));
    el.dispatchEvent(new KeyboardEvent("keypress", o));
    el.dispatchEvent(new KeyboardEvent("keyup", o));
  }

  // Set text in an <input>/<textarea> (Angular/React listen for "input").
  function setValue(input, value) {
    input.focus();
    if (input.isContentEditable) {
      document.execCommand("selectAll");
      document.execCommand("insertText", false, value);
      return;
    }
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Close open Material menus (Escape must reach the menu panel itself).
  function escape() {
    for (const m of document.querySelectorAll('.cdk-overlay-pane [role="menu"]')) pressKey(m, "Escape");
    pressKey(document.activeElement || document.body, "Escape");
    document.querySelector(".cdk-overlay-backdrop-showing")?.click();
  }

  // A visible menu item whose label matches. Flow's items are Material menu
  // items: "<mat-icon>download</mat-icon><span class=mat-mdc-menu-item-text>Download</span>",
  // so match the label span, not the whole text (which starts with the icon name).
  function menuItem(match) {
    const test = typeof match === "function" ? match : (t) => t.startsWith(low(match));
    const items = [...document.querySelectorAll('.cdk-overlay-container [role="menuitem"], .cdk-overlay-container .mat-mdc-menu-item')].filter(visible);
    // The label text without its icon ("edit" + "Rename" → "Rename").
    const label = (m) => {
      const el = m.querySelector(".mat-mdc-menu-item-text") || m;
      const icons = [...el.querySelectorAll("mat-icon, .mat-icon, .google-symbols")].map((i) => i.textContent).join("");
      let t = el.textContent;
      for (const i of el.querySelectorAll("mat-icon, .mat-icon, .google-symbols")) t = t.replace(i.textContent, "");
      return low(t) || low(icons);
    };
    return items.find((m) => test(label(m))) || null;
  }

  const inProject = () => /\/project\//.test(location.pathname);

  // ---------------------------------------------------------------- page model

  // Grid tiles that hold a video: <flow-grid-tile-container class="mat-context-menu-trigger">
  // wrapping a <flow-video-tile> (images use <flow-image-tile>, collections <flow-collection-tile>).
  // In reading order, so take 1 is the top-left video.
  function videoTiles() {
    return [...document.querySelectorAll("flow-grid-tile-container")]
      .filter((t) => t.querySelector("flow-video-tile") && visible(t))
      .sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return Math.abs(ra.top - rb.top) > 20 ? ra.top - rb.top : ra.left - rb.left;
      });
  }

  // The collection's entry in the Library side list (always present while in the
  // project), else its tile in the grid.
  function collectionEl(name) {
    const want = low(name);
    const nav = [...document.querySelectorAll("button.nested-list-item-button")].find((b) => low(b.textContent) === want);
    if (nav) return nav;
    const tile = [...document.querySelectorAll("flow-collection-tile")].find(
      (t) => low(t.querySelector(".title-text, .title")?.textContent) === want
    );
    return tile ? tile.closest("flow-grid-tile-container") || tile : null;
  }

  const collectionUrl = () => /\/collection\//.test(location.pathname);

  const createCollectionBtn = () => document.querySelector('button[aria-label="Create collection"]');
  const navItems = () => document.querySelectorAll("button.nested-list-item-button");

  // A collapsed sidebar (icons only) drops the Library "+" and the collection list,
  // so expand it: its bottom button reads "left_panel_open Expand". Then unfold the
  // Library list ("Toggle library") if it holds collections but shows none.
  // Flow's "Project not found." page (it redirects to /404?reason=project).
  const projectMissing = () =>
    /^\/404/.test(location.pathname) || findText((t) => t === "project not found.")[0];

  const expandBtn = () => [...document.querySelectorAll("button")].find((b) => /left_panel_open/.test(b.textContent) && visible(b));

  // `required`: throw when the Library "+" can't be shown (creating collections
  // needs it; downloading only needs the list, so it just tries).
  async function ensureSidebar(required = true) {
    if (!createCollectionBtn()) {
      // Wait for the project page to finish loading: sidebar shown, collapsed, or a 404.
      await waitFor(() => createCollectionBtn() || expandBtn() || projectMissing(), 15000);
      if (projectMissing()) {
        throw new Error("Flow says \"Project not found.\" The project was deleted or belongs to another account. Open the right project, then run again.");
      }
      const expand = expandBtn();
      if (expand) {
        log("Expanding the Flow sidebar…");
        expand.click();
      }
      if (!(await waitFor(createCollectionBtn, 6000))) {
        if (!required) return;
        throw new Error('"Create collection" (+ beside Library) not found. Open the project with the sidebar showing.');
      }
    }
    const toggle = document.querySelector('button[aria-label="Toggle library"]');
    if (toggle && !navItems().length) {
      toggle.click();
      await waitFor(() => navItems().length, 3000);
    }
  }

  // ---------------------------------------------------------------- job state

  let stopRequested = false;
  let running = false;

  const getJob = async () => {
    if (!alive()) return null;
    try { return (await chrome.storage.local.get("fsdJob")).fsdJob || null; } catch { return null; }
  };
  const setJob = async (job) => {
    if (!alive()) throw new Error("Stopped");
    await chrome.storage.local.set({ fsdJob: job });
  };

  async function finish(job, text) {
    job.status = "done";
    await setJob(job);
    log(text);
    send({ type: "job-ended" });
  }

  // ---------------------------------------------------------------- create

  async function createProject(job) {
    if (!inProject()) {
      log("Opening a new project…");
      const btn = await waitFor(() => findText((t) => t === "new project" || t === "+ new project" || t === "add new project")[0]);
      if (!btn) throw new Error('"New project" button not found. Open the Flow home page first.');
      click(clickable(btn));
      if (!(await waitFor(inProject, 20000))) throw new Error("Flow did not open the new project.");
      await sleep(2500);
    }
    job.projectUrl = location.href;
    job.step = "rename";
    await setJob(job);
  }

  // The name field Flow shows for a rename or a new collection: a dialog input,
  // or an inline field that takes focus.
  const nameField = () => {
    const a = document.activeElement;
    if (a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.isContentEditable) && visible(a) && !a.closest(".ProseMirror")) return a;
    return [...document.querySelectorAll('mat-dialog-container input, [role="dialog"] input, .cdk-overlay-container input, .cdk-overlay-container textarea')]
      .find(visible);
  };

  async function submitName(input, value) {
    setValue(input, value);
    await sleep(250);
    const confirm = [...document.querySelectorAll('mat-dialog-container button, [role="dialog"] button, .cdk-overlay-container button')]
      .filter(visible)
      .find((b) => /^(create|save|done|ok|rename|confirm)$/i.test(norm(b.textContent)));
    if (confirm && !confirm.disabled) click(confirm);
    else { pressKey(input, "Enter"); input.blur?.(); }
  }

  const projectTitle = () => {
    const btn = document.querySelector('button[aria-label="More options for the project"]');
    const bar = btn?.parentElement;
    return norm(bar?.textContent.replace(/more_vert|arrow_back|home/g, ""));
  };

  // Project "⋮" (More options for the project) → Rename → name field.
  async function renameProject(job) {
    const title = job.plan.title;
    const more = await waitFor(() => document.querySelector('button[aria-label="More options for the project"]'), 10000);
    if (more && projectTitle() !== title) {
      more.click();
      const item = await waitFor(() => menuItem("rename"), 3000);
      const input = item && (item.click(), await waitFor(nameField, 4000));
      if (input) {
        await submitName(input, title);
        await sleep(1000);
        log(`Project named "${title}".`);
      } else {
        escape();
        log(`Could not rename the project; rename it to "${title}" yourself.`, "warn");
      }
    }
    job.step = "collections";
    await setJob(job);
  }

  // Library "+" (Create collection) → name field → collection appears in the Library list.
  async function createCollection(name) {
    await ensureSidebar();
    const add = createCollectionBtn();
    const before = navItems().length;
    add.click();
    const input = await waitFor(nameField, 5000);
    if (input) await submitName(input, name);
    else {
      // Flow made an "Untitled" collection straight away: rename it from its menu.
      const fresh = await waitFor(() => navItems().length > before, 4000);
      if (!fresh) throw new Error("No new collection or name field appeared.");
      throw new Error("Flow created a collection without asking for a name; rename it, then run again.");
    }
    if (!(await waitFor(() => collectionEl(name), 8000))) throw new Error(`Collection "${name}" did not appear.`);
    log(`Created collection "${name}".`);
  }

  async function createCollections(job) {
    await ensureSidebar();
    for (; job.index < job.plan.collections.length; job.index++) {
      const name = job.plan.collections[job.index];
      if (collectionEl(name)) log(`"${name}" already exists.`);
      else await createCollection(name);
      await setJob(job);
      await sleep(600);
    }
    await finish(job, `Done: ${job.plan.collections.length} collections ready in "${job.plan.title}".`);
  }

  // ---------------------------------------------------------------- download

  // Open a collection from the Library list. Resolves to true once its page is showing.
  async function openCollection(name) {
    const el = await waitFor(() => collectionEl(name), 10000);
    if (!el) return false;
    const before = location.href;
    el.scrollIntoView({ block: "center" });
    if (el.tagName === "BUTTON") el.click();
    else { click(el); if (!(await waitFor(() => location.href !== before, 2000))) fire(el, "dblclick"); }
    if (!(await waitFor(() => location.href !== before && collectionUrl(), 8000))) {
      throw new Error(`Could not open collection "${name}".`);
    }
    // Let the grid swap from the previous page's tiles to this collection's.
    await sleep(2000);
    return true;
  }

  async function backToProject(job) {
    if (location.href === job.projectUrl) return;
    const home = [...document.querySelectorAll("button, a")].find((b) => /^arrow_back$/.test(norm(b.textContent)) && visible(b));
    if (home) home.click();
    else history.back();
    if (!(await waitFor(() => location.href === job.projectUrl, 6000))) location.href = job.projectUrl;
    await sleep(1500);
  }

  async function waitDownload(key, timeoutMs) {
    const end = Date.now() + timeoutMs;
    let announced = false;
    while (Date.now() < end) {
      if (stopRequested || !alive()) throw new Error("Stopped");
      const s = await chrome.runtime.sendMessage({ type: "job-status", key });
      if (s?.job) {
        if (!announced) { log(`  Saving ${s.job.filename}…`); announced = true; }
        if (s.job.state === "complete") return s.job;
        if (s.job.state === "interrupted") throw new Error(`Download failed: ${s.job.error || "interrupted"}`);
      }
      await sleep(2000);
    }
    throw new Error("Timed out waiting for the 1080p download.");
  }

  async function downloadTile(tile, name, job) {
    rightClick(tile);
    const dl = await waitFor(() => menuItem("download"), 4000);
    if (!dl) throw new Error("The video's right-click menu did not open.");
    hover(dl);
    click(dl);
    const hd = await waitFor(() => menuItem((t) => t.startsWith("1080p")), 4000);
    if (!hd) throw new Error('"1080p Upscaled" option not found in the Download menu.');
    if (hd.getAttribute("aria-disabled") === "true" || hd.disabled) throw new Error("1080p is disabled for this video.");
    const key = `${name}#${Date.now()}`;
    await chrome.runtime.sendMessage({ type: "arm", name, folder: job.plan.folder, key });
    click(hd);
    log(`  Upscaling "${name}" to 1080p… (this can take several minutes)`);
    await sleep(800);
    escape();
    const done = await waitDownload(key, 20 * 60 * 1000);
    log(`  ✓ ${done.filename}`);
  }

  async function downloadAll(job) {
    const list = job.plan.collections;
    if (job.index === 0 && job.skipExisting && !job.checked) {
      const { done = [] } = await chrome.runtime.sendMessage({ type: "already-downloaded", names: list.slice(job.start) });
      job.skip = done;
      job.checked = true;
      if (done.length) log(`Already downloaded, skipping: ${done.join(", ")}`);
    }
    if (job.index < job.start) job.index = job.start;
    for (; job.index < list.length; job.index++, job.take = 0) {
      const name = list[job.index];
      if (job.skip?.includes(name)) continue;
      await setJob(job);
      log(`${name}`);
      if (!collectionEl(name) && location.href !== job.projectUrl) await backToProject(job);
      if (!collectionEl(name)) await ensureSidebar(false);
      if (!(await openCollection(name))) {
        log(`  Collection "${name}" not found, skipped.`, "warn");
        continue;
      }
      const tiles = await waitFor(() => { const t = videoTiles(); return t.length ? t : null; }, 8000);
      if (!tiles) {
        log(`  No videos in "${name}" yet, skipped.`, "warn");
        continue;
      }
      const count = job.allTakes ? tiles.length : 1;
      if (tiles.length > 1) log(`  ${tiles.length} videos found; downloading ${count}.`);
      for (job.take = job.take || 0; job.take < count; job.take++) {
        await setJob(job);
        const tile = videoTiles()[job.take];
        if (!tile) break;
        const fileName = job.take === 0 ? name : `${name} (take ${job.take + 1})`;
        await downloadTile(tile, fileName, job);
        await sleep(1500);
      }
    }
    await backToProject(job);
    await finish(job, "All downloads finished.");
  }

  // ---------------------------------------------------------------- end frame
  //
  // With a video open in Flow: put the playhead on its last frame, "Save frame",
  // then go Back, which Flow takes to the video's own collection
  // ("Video 9 - …"). That gives the number: the new "Saved frame from …" image
  // is renamed "End frame V9" and dragged onto "Video 10 - …" in the Library
  // list. No storyboard is needed. Flow ignores synthetic pointer events for the
  // drag, so the service worker performs it with real mouse input (chrome.debugger).

  const tileName = (t) => norm(t.getAttribute("aria-label")) ||
    norm(t.textContent.replace(/play_circle|favorite|redo|more_vert|image/g, ""));
  const gridTiles = () => [...document.querySelectorAll("flow-grid-tile-container")].filter(visible);
  const imageTiles = () => gridTiles().filter((t) => t.querySelector("flow-image-tile"));
  const imageTile = (name) => imageTiles().find((t) => low(tileName(t)) === low(name));

  // The Library row for a collection; its data-item-id is the collection id in the URL.
  const navRow = (name) => [...document.querySelectorAll("[data-item-id]")].find((r) => low(r.textContent) === low(name));
  const videoRow = (n) => [...document.querySelectorAll("[data-item-id]")].find((r) => new RegExp(`^video ${n} - `).test(low(r.textContent)));
  const currentCollection = () => {
    if (!collectionUrl()) return null;
    const row = [...document.querySelectorAll("[data-item-id]")].find((r) => location.pathname.endsWith(`/collection/${r.dataset.itemId}`));
    return row ? norm(row.textContent) : null;
  };

  async function gotoCollection(name, job) {
    let row = navRow(name);
    if (!row) { await backToProject(job); await ensureSidebar(false); row = await waitFor(() => navRow(name), 8000); }
    if (!row) return false;
    const id = row.dataset.itemId;
    if (location.pathname.endsWith(`/collection/${id}`)) return true;
    row.scrollIntoView({ block: "center" });
    row.querySelector("button")?.click();
    if (!(await waitFor(() => location.pathname.endsWith(`/collection/${id}`), 8000))) throw new Error(`Could not open collection "${name}".`);
    await sleep(2000); // let the grid swap to this collection's tiles
    return true;
  }

  // Flow fades some player buttons (Save frame) to opacity 0 until the player is
  // hovered, so match on size and display, not on opacity.
  const present = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const btn = (label) => [...document.querySelectorAll(`button[aria-label="${label}"]`)].find(present);

  const onVideoPage = () => /\/edit\//.test(location.pathname) && !!btn("Save frame") && !!btn("Skip to next clip");
  const pageTitle = () => norm(document.querySelector('input[aria-label="Editable text"]')?.value);

  // While a collection is showing, remember it and the next video's collection
  // (per tab), so the panel can say where a video opened from it will go.
  function rememberCollection() {
    const name = currentCollection();
    if (!name) return;
    const n = Number((name.match(/^Video\s+(\d+)\s+-/i) || [])[1]);
    const next = n ? videoRow(n + 1) : null;
    try { sessionStorage.setItem("fsdLastCollection", JSON.stringify({ name, n: n || null, next: next ? norm(next.textContent) : null })); } catch {}
  }
  setInterval(rememberCollection, 1000);

  // For the panel: the open video's title and, if known, its collection.
  function openVideo() {
    if (!onVideoPage()) return null;
    let last = null;
    try { last = JSON.parse(sessionStorage.getItem("fsdLastCollection") || "null"); } catch {}
    return { title: pageTitle(), url: location.pathname, collection: last };
  }

  function playTimes() {
    const t = norm(btn("Skip to next clip")?.parentElement?.textContent);
    const m = t.match(/Current time:\s*([\d:.]+).*Total duration:\s*([\d:.]+)/i);
    return m ? { cur: m[1], total: m[2] } : null;
  }

  // On the video page: Save frame → wait for "Frame saved". With atPlayhead the
  // playhead stays where the user left it (the video is only paused); otherwise
  // it first moves to the last frame. Flow sometimes reorders a clip's shots, so
  // the clean frame to continue from is not always the last one.
  async function saveFrame(atPlayhead) {
    if (atPlayhead) {
      // Flow's player draws on a <canvas>; its Play/Pause button is the only control.
      if (btn("Pause")) {
        btn("Pause").click();
        if (!(await waitFor(() => btn("Play"), 3000))) throw new Error("Could not pause the player.");
      }
      const p = playTimes();
      if (p?.cur === "00:00:00") log("  The playhead is at 00:00:00, the clip's first frame; that frame is saved.", "warn");
      log(`  Playhead at ${p ? `${p.cur} of ${p.total}` : "an unknown time"}.`);
    } else {
      btn("Skip to next clip").click();
      const atEnd = await waitFor(() => { const p = playTimes(); return p && p.cur === p.total && p.cur !== "00:00:00"; }, 5000);
      if (!atEnd) throw new Error(`Could not move the playhead to the last frame (${JSON.stringify(playTimes())}).`);
    }
    await sleep(1200); // let the frame paint
    const save = btn("Save frame");
    hover(save);
    await sleep(300);
    save.click();
    log(atPlayhead ? "  Saving the frame at the playhead…" : "  Saving the last frame…");
    const saved = await waitFor(() => [...document.querySelectorAll("button, a")].find((b) => norm(b.textContent) === "View image" && present(b)), 30000);
    if (!saved) throw new Error('Flow did not confirm "Frame saved".');
  }

  // Right-click the tile → Rename → type in the inline field → Enter.
  async function renameTile(tile, name) {
    const { x, y } = center(tile);
    tile.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 2 }));
    const item = await waitFor(() => menuItem("rename"), 3000);
    if (!item) throw new Error("The image's Rename menu item was not found.");
    const oldName = tileName(tile);
    item.click();
    // Flow opens an inline field holding the current name and focuses it.
    const input = await waitFor(() => {
      const a = document.activeElement;
      if (a && a.tagName === "INPUT" && a.getAttribute("aria-label") === "Editable text" && !a.closest("header")) return a;
      return [...document.querySelectorAll('input[aria-label="Editable text"]')]
        .find((i) => present(i) && low(i.value).replace(/…$/, "") && low(oldName).replace(/…$/, "").startsWith(low(i.value).slice(0, 20)) && low(i.value).startsWith("saved frame"));
    }, 3000);
    if (!input) throw new Error("The image's name field did not open.");
    input.focus();
    input.select();
    document.execCommand("insertText", false, name);
    if (input.value !== name) setValue(input, name);
    await sleep(300);
    pressKey(input, "Enter");
    await sleep(300);
    input.blur?.();
    if (!(await waitFor(() => imageTile(name), 5000))) throw new Error(`Could not rename the frame to "${name}".`);
    log(`  Named "${name}".`);
  }

  // Drag the image tile onto the target collection's Library row with real mouse
  // input. Tries up to three times by itself before giving up.
  async function moveToCollection(frameName, to) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const tile = await waitFor(() => imageTile(frameName), 8000);
      if (!tile) {
        // Gone already? Then an earlier try moved it.
        if (attempt > 1) { log(`  Moved "${frameName}" → "${to}".`); return; }
        throw new Error(`"${frameName}" is not in this collection's grid.`);
      }
      const row = navRow(to);
      if (!row) throw new Error(`"${to}" is not in the Library list.`);
      escape();
      document.activeElement?.blur?.();
      for (const el of document.querySelectorAll("[data-fsd-drag]")) el.removeAttribute("data-fsd-drag");
      (tile.querySelector("img") || tile).setAttribute("data-fsd-drag", "src");
      (row.querySelector(".item-label") || row).setAttribute("data-fsd-drag", "dst");
      await sleep(400);
      const res = await chrome.runtime.sendMessage({ type: "drag" });
      if (res?.error) log(`  Drag try ${attempt}: ${res.error}`, "warn");
      if (await waitFor(() => !imageTile(frameName), 6000)) {
        log(`  Moved "${frameName}" → "${to}".`);
        return;
      }
      if (attempt < 3) { log(`  "${frameName}" did not move yet; trying again (${attempt + 1} of 3)…`, "warn"); await sleep(1500); }
    }
    throw new Error(`"${frameName}" did not move to "${to}" after 3 tries. Drag it there yourself.`);
  }

  // job: {kind: "endframe", videoUrl, atPlayhead, step: "save" | "rename" | "move", from, n, title}.
  // Each step is saved before the next, so a page reload never saves a second frame.
  async function endFrameJob(job) {
    if (job.step === "save") {
      if (!onVideoPage()) throw new Error("Open the video in Flow first (the page with Save frame and the timeline).");
      if (job.videoUrl && location.pathname !== job.videoUrl) throw new Error("A different video is open now than when you clicked. Try again.");
      job.title = pageTitle();
      log(`"${job.title}": saving its end frame${job.atPlayhead ? " at the playhead" : ""}…`);
      await saveFrame(!!job.atPlayhead);
      // Back from a video goes to the collection it belongs to.
      btn("Back button to go to previous page")?.click();
      if (!(await waitFor(() => currentCollection(), 10000))) throw new Error("Back did not lead to the video's collection; rename and move the saved frame yourself.");
      job.from = currentCollection();
      job.n = Number((job.from.match(/^Video\s+(\d+)\s+-/i) || [])[1]) || null;
      if (!job.n) throw new Error(`The video is in "${job.from}", not a "Video N - …" collection. The frame is saved there as "Saved frame from …".`);
      job.step = "rename";
      await setJob(job);
      log(`  It is in "${job.from}".`);
    }
    const frameName = `End frame V${job.n}`;
    if (!(await gotoCollection(job.from, job))) throw new Error(`Collection "${job.from}" not found.`);
    if (job.step === "rename") {
      await waitFor(() => imageTiles().length, 5000);
      // The newest "Saved frame from <title>" image (Flow lists the newest first).
      const want = low(`Saved frame from ${job.title}`).replace(/…$/, "");
      const saved = imageTiles().filter((t) => /^saved frame from /.test(low(tileName(t))));
      const tile = saved.find((t) => want.startsWith(low(tileName(t)).replace(/…$/, "")) || low(tileName(t)).startsWith(want)) || saved[0];
      if (!tile && !imageTile(frameName)) throw new Error(`The saved frame is not in "${job.from}".`);
      if (tile) {
        try { await renameTile(tile, frameName); }
        catch (err) {
          if (err.message === "Stopped") throw err;
          log(`  ${err.message} Trying again…`, "warn");
          escape();
          await sleep(1500);
          const again = imageTile(frameName) ? null : imageTiles().find((t) => /^saved frame from /.test(low(tileName(t))));
          if (again) await renameTile(again, frameName);
        }
      }
      job.step = "move";
      await setJob(job);
    }
    const next = videoRow(job.n + 1);
    if (!next) throw new Error(`No "Video ${job.n + 1} - …" collection; "${frameName}" stays in "${job.from}".`);
    const to = norm(next.textContent);
    await moveToCollection(frameName, to);
    await finish(job, `Done: "${frameName}" is in "${to}".`);
  }

  // ---------------------------------------------------------------- runner

  async function run() {
    if (running) return;
    const job = await getJob();
    if (!job || job.status !== "running") return;
    running = true;
    stopRequested = false;
    try {
      if (job.kind === "create") {
        if (job.step === "project") await createProject(job);
        if (job.step === "rename") await renameProject(job);
        if (job.step === "collections") await createCollections(job);
      } else if (job.kind === "download") {
        if (!job.projectUrl) {
          if (!inProject()) throw new Error("Open the Flow project first.");
          job.projectUrl = location.href;
          await setJob(job);
        }
        await downloadAll(job);
      } else if (job.kind === "endframe") {
        if (!job.projectUrl) {
          job.projectUrl = location.href.replace(/\/(collection|edit)\/.*$/, "");
          await setJob(job);
        }
        await endFrameJob(job);
      }
    } catch (err) {
      escape();
      if (!alive()) return; // extension reloaded: this copy of the script is dead
      console.info(TAG, err);
      send({ type: "disarm" });
      const j = await getJob();
      if (j) { j.status = err.message === "Stopped" ? "stopped" : "failed"; await setJob(j).catch(() => {}); }
      log(err.message === "Stopped" ? "Stopped." : `Stopped: ${err.message}`, "error");
      send({ type: "job-ended" });
    } finally {
      running = false;
    }
  }

  chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
    if (msg?.type === "start") { run(); reply({ ok: true }); }
    else if (msg?.type === "stop") { stopRequested = true; reply({ ok: true }); }
    else if (msg?.type === "ping") {
      const row = collectionUrl() && [...document.querySelectorAll("[data-item-id]")].find((r) => location.pathname.endsWith(`/collection/${r.dataset.itemId}`));
      reply({ ok: true, url: location.href, inProject: inProject(), running, collection: row ? norm(row.textContent) : null, video: openVideo() });
    }
    else if (msg?.type === "scan") {
      reply({
        inProject: inProject(),
        videos: videoTiles().length,
        collections: (msg.names || []).filter((n) => collectionEl(n)),
      });
    }
    return false;
  });

  // Test hook: window.postMessage({ fsd: "start", job }, "*") from the page's own
  // console starts a job without the side panel; { fsd: "stop" } stops it.
  window.addEventListener("message", async (e) => {
    if (e.source !== window || !e.data?.fsd) return;
    if (e.data.fsd === "ping") window.postMessage({ fsdPong: { running, url: location.href } }, "*");
    if (e.data.fsd === "stop") stopRequested = true;
    // { fsd: "move", name: "End frame V7", to: "Video 8 - …" }: test the drag alone.
    if (e.data.fsd === "move") {
      stopRequested = false;
      moveToCollection(e.data.name, e.data.to).then(() => log("Move test OK."), (err) => log(`Move test: ${err.message}`, "error"));
    }
    if (e.data.fsd === "start" && e.data.job) {
      await setJob({ status: "running", index: 0, ...e.data.job });
      run();
    }
  });

  // Resume a job after a reload.
  setTimeout(() => run().catch(() => {}), 2500);

  window.__fsd = { videoTiles, collectionEl, findText, menuItem, run };
})();
