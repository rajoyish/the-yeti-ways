// Flow Account Seeder — content script for Google Flow.
//
// Each command comes from the side panel and drives Flow's own UI the way a
// person would, on the page that is open. The side panel moves the tab between
// projects (the Flow home page, the "Characters" project, the film's project).
//
// The Characters workflow follows the way the Characters are built by hand:
// every front and turnaround image is uploaded into the project named
// "Characters" as "<Name> - Front" and "<Name> - Turnaround", and each saved
// Character is then made with New character → Add from project (Portrait), then
// Body → Add from project, plus its name and Character info.
//
// Uploads go through hook.js (page world), which hands the armed files to
// Flow's own file input instead of opening the system file chooser.

(() => {
  if (window.__flowAccountSeeder) return;
  window.__flowAccountSeeder = true;
  document.documentElement.dataset.flowAccountSeeder = chrome.runtime.getManifest().version;

  const TAG = "[Flow Account Seeder]";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();
  const low = (s) => norm(s).toLowerCase();
  const kebab = (s) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let stopRequested = false;

  const alive = () => { try { return !!chrome.runtime?.id; } catch { return false; } };
  function send(msg) {
    if (!alive()) return;
    try { chrome.runtime.sendMessage(msg).catch(() => {}); } catch {}
  }
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

  function click(el) {
    el.scrollIntoView({ block: "center", inline: "center" });
    for (const t of ["pointerover", "pointerenter", "mouseover", "mouseenter", "pointermove", "mousemove"]) fire(el, t);
    fire(el, "pointerdown", { button: 0, buttons: 1 });
    fire(el, "mousedown", { button: 0, buttons: 1 });
    el.focus?.({ preventScroll: true });
    fire(el, "pointerup", { button: 0 });
    fire(el, "mouseup", { button: 0 });
    fire(el, "click", { button: 0 });
  }

  function pressKey(el, key) {
    const o = { key, code: key, keyCode: key === "Enter" ? 13 : key === "Escape" ? 27 : 0, bubbles: true, cancelable: true };
    el.dispatchEvent(new KeyboardEvent("keydown", o));
    el.dispatchEvent(new KeyboardEvent("keypress", o));
    el.dispatchEvent(new KeyboardEvent("keyup", o));
  }

  // Replace a field's text the way typing would (Angular listens for input).
  function typeInto(input, value) {
    input.focus();
    input.select?.();
    document.execCommand("insertText", false, value);
    if (input.value !== value) {
      const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function escape() {
    for (const m of document.querySelectorAll('.cdk-overlay-pane [role="menu"]')) pressKey(m, "Escape");
    pressKey(document.activeElement || document.body, "Escape");
    document.querySelector(".cdk-overlay-backdrop-showing")?.click();
  }

  const iconless = (el) => {
    let t = el.textContent;
    for (const i of el.querySelectorAll("mat-icon, .mat-icon, .google-symbols, i")) t = t.replace(i.textContent, "");
    return norm(t);
  };

  function menuItem(re) {
    const items = [...document.querySelectorAll('.cdk-overlay-container [role="menuitem"], .cdk-overlay-container .mat-mdc-menu-item')].filter(visible);
    return items.find((m) => re.test(low(iconless(m)))) || null;
  }

  const buttons = (root = document) => [...root.querySelectorAll("button, [role=button]")].filter(visible);
  const byAria = (label, root) => buttons(root).find((b) => b.getAttribute("aria-label") === label);
  const byText = (re, root) => buttons(root).find((b) => re.test(iconless(b)));
  // A left-sidebar view button ("image Images", "accessibility_new Characters"):
  // its icon ligature is the first word of its text.
  const sideTab = (icon) => buttons().find((b) => b.getBoundingClientRect().left < 90 && b.textContent.trim().split(/\s+/)[0] === icon);

  const inProject = () => /\/project\//.test(location.pathname);
  const onCharacterPage = () => /\/character(\/|$)/.test(location.pathname);
  // The "New character" tile: aria-labelled in some Flow builds, text only in others.
  const newCharacterTile = () =>
    byAria("New character") ||
    buttons().find((b) => /^new character$/i.test(iconless(b))) ||
    [...document.querySelectorAll('[class*="custom-tile"]')].find((e) => visible(e) && /new character/i.test(e.textContent));
  const onNewCharacterPage = () => /\/character\/?$/.test(location.pathname);
  const projectName = () => norm(document.querySelector("header input.editable-text-input, input.editable-text-input")?.value) ||
    norm(document.title.replace(/^Google Flow\s*-\s*/, ""));

  function needProject(what) {
    if (!inProject()) throw new Error(`Open ${what} first.`);
  }

  // Every scroller on the page, so a virtual grid renders all of its rows.
  function scrollAll(to) {
    window.scrollTo(0, to === 0 ? 0 : window.scrollY + 600);
    for (const e of document.querySelectorAll("*")) {
      if (e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)) e.scrollTop = to === 0 ? 0 : e.scrollTop + 600;
    }
  }

  async function leaveCharacterPage() {
    if (!onCharacterPage()) return;
    (byAria("Go back") || byAria("Back"))?.click();
    await waitFor(() => !onCharacterPage(), 8000);
    await sleep(500);
  }

  // ---------------------------------------------------------------- projects (home page)

  const projectCards = () =>
    [...document.querySelectorAll("a")]
      .filter((a) => /open project/i.test(a.getAttribute("aria-label") || ""))
      .map((a) => ({ a, name: norm((a.parentElement?.innerText || "").split("\n")[0]) }));

  // The URL of the named project, from the Flow home page; creates it if asked.
  async function projectUrl({ name, create }) {
    if (inProject()) {
      if (low(projectName()) === low(name)) return { url: location.href, created: false };
      throw new Error("projectUrl runs on the Flow home page.");
    }
    await waitFor(() => projectCards().length || byText(/new project/i), 15000);
    await sleep(800);
    const card = projectCards().find((c) => low(c.name) === low(name));
    if (card) return { url: card.a.href, created: false };
    if (!create) throw new Error(`This account has no project named "${name}".`);
    log(`Creating the "${name}" project…`);
    const btn = byText(/^new project$/i) || byAria("add New project");
    if (!btn) throw new Error('"New project" was not found on the Flow home page.');
    click(btn);
    if (!(await waitFor(inProject, 20000))) throw new Error("Flow did not open the new project.");
    const title = await waitFor(() => document.querySelector("input.editable-text-input"), 15000);
    await sleep(1500);
    if (title) {
      typeInto(title, name);
      pressKey(title, "Enter");
      title.blur();
      await sleep(1200);
    }
    if (low(projectName()) !== low(name)) log(`Rename the new project to "${name}" yourself.`, "warn");
    return { url: location.href, created: true };
  }

  // ---------------------------------------------------------------- uploads (hook.js)

  // f.dataUrl from the side panel, or f.devPath (a file in this extension's
  // dev/ folder) from the test bridge.
  async function toFile(f) {
    const src = f.devPath ? chrome.runtime.getURL(f.devPath) : f.dataUrl;
    const blob = await (await fetch(src)).blob();
    return new File([blob], f.name, { type: f.type || blob.type });
  }

  // Arm the files, run the action that makes Flow open its file chooser, and
  // wait for hook.js to confirm it fed them in.
  async function upload(files, trigger) {
    const nonce = Math.random().toString(36).slice(2);
    const fed = new Promise((resolve) => {
      const on = (e) => {
        if (e.source === window && e.data?.fas === "fed" && e.data.nonce === nonce) {
          window.removeEventListener("message", on);
          resolve(true);
        }
      };
      window.addEventListener("message", on);
      setTimeout(() => { window.removeEventListener("message", on); resolve(false); }, 12000);
    });
    window.postMessage({ fas: "arm", nonce, files: await Promise.all(files.map(toFile)) }, location.origin);
    await trigger();
    const ok = await fed;
    window.postMessage({ fas: "arm", files: null }, location.origin);
    if (!ok) throw new Error("Flow did not open a file input, so nothing was uploaded. Reload the Flow tab and try again.");
  }

  // Drop files onto the project grid, as dragging them from Finder does. Flow's
  // "Upload" menu item only opens its file input on a real (trusted) click,
  // but its drop zone accepts a synthetic drop.
  async function dropFiles(files) {
    const list = await Promise.all(files.map(toFile));
    const dt = new DataTransfer();
    for (const f of list) dt.items.add(f);
    const main = document.querySelector("main") || document.body;
    const r = main.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 300);
    const target = document.elementFromPoint(x, y) || main;
    for (const type of ["dragenter", "dragover", "drop"]) {
      target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, dataTransfer: dt }));
      await sleep(type === "drop" ? 0 : 150);
    }
  }

  // ---------------------------------------------------------------- full-resolution images

  const grab = (src, options) => FasImages.grab(src, options);

  // ---------------------------------------------------------------- Characters view

  async function openCharactersView() {
    needProject('the "Characters" project');
    await leaveCharacterPage();
    const tab = await waitFor(() => sideTab("accessibility_new"), 15000);
    if (!tab) throw new Error("The Characters button in Flow's left sidebar was not found.");
    tab.click();
    // With no saved Characters yet, Flow goes straight to the New character page.
    const view = await waitFor(() => newCharacterTile() ? "grid" : onNewCharacterPage() && byText(/^add from project$/i) ? "empty" : null, 10000);
    if (!view) throw new Error('The Characters view did not open ("New character" tile not found).');
    await sleep(800);
    return view;
  }

  const characterTiles = () =>
    [...document.querySelectorAll('img[alt="Character thumbnail"]')]
      .map((img) => ({ img, name: norm((img.parentElement?.parentElement?.innerText || "").split("\n")[0]) }))
      .filter((t) => t.name);

  async function listCharacters() {
    if ((await openCharactersView()) === "empty") { await leaveCharacterPage(); return []; }
    const names = new Set();
    let still = 0;
    scrollAll(0);
    for (let i = 0; i < 60 && still < 3; i++) {
      const before = names.size;
      characterTiles().forEach((t) => names.add(t.name));
      still = names.size === before ? still + 1 : 0;
      scrollAll(1);
      await sleep(350);
    }
    scrollAll(0);
    return [...names];
  }

  async function findCharacterTile(name) {
    scrollAll(0);
    await sleep(300);
    for (let i = 0; i < 40; i++) {
      const t = characterTiles().find((x) => kebab(x.name) === kebab(name));
      if (t) return t;
      scrollAll(1);
      await sleep(300);
    }
    return null;
  }

  async function openCharacter(name) {
    await openCharactersView();
    const t = await findCharacterTile(name);
    if (!t) throw new Error(`No saved Character named "${name}".`);
    click(t.img);
    const ok = await waitFor(() => onCharacterPage() && document.querySelector("textarea.personality-textarea"), 15000);
    if (!ok) throw new Error(`"${name}" did not open.`);
    await sleep(1000);
  }

  // The Portrait or Body chip under the image ("Body" reads "Create body" while empty).
  const slotChip = (slot) => [...document.querySelectorAll("button.chip-button")].find((b) => low(iconless(b)).endsWith(low(slot)));
  const slotImage = (slot) => slotChip(slot)?.querySelector("img.slot-thumbnail[src]") || null;

  async function exportCharacter({ name }) {
    await openCharacter(name);
    const out = {
      name: document.querySelector("input.name-input")?.value || name,
      info: document.querySelector("textarea.personality-textarea")?.value || "",
      voice: currentVoice(),
    };
    try {
      for (const [slot, key] of [["Portrait", "front"], ["Body", "turnaround"]]) {
        const img = await waitFor(() => slotImage(slot), 5000);
        if (!img) { log(`  ${name}: the ${slot} slot is empty.`, "warn"); continue; }
        // Slot thumbnails are commonly 512 px or smaller. A successful HTTP
        // response alone is not enough to promise a high-quality export.
        try { out[key] = await grab(img.currentSrc || img.src, { minLongEdge: 513 }); }
        catch (error) { throw new Error(`${name} · ${slot}: ${error.message}`); }
        log(`  ${name}: ${slot} ${out[key].width} × ${out[key].height} · ${Math.round(out[key].size / 1024)} KB (${out[key].type}).`, "done");
      }
    } finally {
      await leaveCharacterPage();
    }
    return out;
  }

  // ---------------------------------------------------------------- project images

  const tileName = (t) => !t?.getAttribute ? "" : norm(t.getAttribute("aria-label")) || norm(t.textContent.replace(/play_circle|favorite|redo|more_vert|image/g, ""));
  const imageTiles = () => [...document.querySelectorAll("flow-grid-tile-container")].filter((t) => visible(t) && t.querySelector("flow-image-tile"));

  async function openImagesView() {
    needProject("a project");
    await leaveCharacterPage();
    // An empty project has no Images view yet; All media shows images too.
    const tab = await waitFor(() => sideTab("image") || sideTab("dashboard"), 15000);
    if (!tab) throw new Error("The Images (or All media) button in Flow's left sidebar was not found.");
    tab.click();
    await sleep(1500);
  }

  // Image tiles of the open project whose name passes the test: Map name → src.
  async function collectImages(test = () => true) {
    const found = new Map();
    let still = 0;
    scrollAll(0);
    await sleep(500);
    for (let i = 0; i < 100 && still < 3; i++) {
      const before = found.size;
      for (const t of imageTiles()) {
        const n = tileName(t);
        const img = t.querySelector("img[src]");
        if (n && test(n) && !found.has(n)) found.set(n, img ? img.src : "");
      }
      still = found.size === before ? still + 1 : 0;
      scrollAll(1);
      await sleep(350);
    }
    scrollAll(0);
    return found;
  }

  async function listImages() {
    await openImagesView();
    return { project: projectName(), images: [...(await collectImages()).keys()] };
  }

  const isPlate = (n) => /^plate - /i.test(n);

  async function listPlates() {
    const { project, images } = await listImages();
    return { project, plates: images.filter(isPlate) };
  }

  async function exportPlates({ names }) {
    await openImagesView();
    const found = await collectImages((n) => names.includes(n));
    const out = [];
    for (const name of names) {
      const src = found.get(name);
      if (!src) { log(`  ${name}: not found in this project.`, "warn"); continue; }
      const img = await grab(src);
      log(`  ${name}: ${Math.round(img.size / 1024)} KB (${img.type}).`);
      out.push({ name, ...img });
    }
    return { project: projectName(), plates: out };
  }

  // A tile's image id (its src without the size suffix) stays with the asset,
  // while the grid recycles tile elements as it scrolls. Rename by that id, and
  // only after the name field shows the expected old name.
  const assetId = (t) => (t?.querySelector("img[src]")?.src || "").replace(/=[^/=]*$/, "");

  async function renameTile(tile, name) {
    const id = assetId(tile);
    const oldName = tileName(tile);
    if (!id) throw new Error(`"${oldName}" has no image yet, so it cannot be renamed.`);
    const find = () => imageTiles().find((t) => assetId(t) === id);
    for (let attempt = 0; attempt < 4; attempt++) {
      escape();
      await sleep(300);
      let t = find();
      if (!t) { scrollAll(0); await sleep(700); t = find(); }
      if (!t) continue;
      t.scrollIntoView({ block: "center" });
      await sleep(500);
      t = find();
      if (!t || tileName(t) !== oldName) { if (t && tileName(t) === name) return; continue; }
      const { x, y } = center(t);
      t.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 2 }));
      const item = await waitFor(() => menuItem(/^rename/), 3000);
      if (!item) continue;
      item.click();
      const input = await waitFor(() => {
        const a = document.activeElement;
        return a && a.tagName === "INPUT" && a.getAttribute("aria-label") === "Editable text" && !a.closest("header") ? a : null;
      }, 3000);
      // Never type into a field that holds another image's name.
      if (!input || norm(input.value) !== oldName) { if (input) { pressKey(input, "Escape"); input.blur(); } continue; }
      typeInto(input, name);
      await sleep(300);
      pressKey(input, "Enter");
      input.blur();
      if (await waitFor(() => tileName(find() || {}) === name || null, 5000)) return;
    }
    throw new Error(`Could not rename "${oldName}" to "${name}".`);
  }

  // Upload one image into the open project and give it its exact name.
  // `also` lists other names that count as already present (babu-yeti-front).
  async function uploadImage({ name, file, also = [] }) {
    await openImagesView();
    const names = [name, ...also].map(low);
    const have = await collectImages((n) => names.includes(low(n)) || names.includes(low(n).replace(/\.[a-z]+$/, "")));
    if (have.size) {
      let found = [...have.keys()][0];
      // An earlier upload under another of its names ("<name>.png", or "plate-<location>.png" as the
      // repo names the file): give it its exact name.
      if (found !== name) {
        const t = imageTiles().find((x) => tileName(x) === found);
        if (t) { await renameTile(t, name); found = name; }
      }
      log(`${name}: already in ${projectName()}${found !== name ? ` as "${found}"` : ""}; not uploaded again.`);
      return { skipped: true, name: found };
    }
    log(`${name}: uploading…`);
    const before = new Set(imageTiles().map(tileName));
    await dropFiles([file]);
    const base = low(file.name.replace(/\.[^.]+$/, ""));
    const wanted = [base, low(file.name), low(name)];
    const finished = (t) => t.querySelector("img[src]") && !/\d+%/.test(t.textContent);
    // While uploading, a tile can carry a temporary name, so watch every new
    // tile until one has the file's name and a finished image.
    const done = await waitFor(() => {
      scrollAll(0);
      const fresh = imageTiles().filter((t) => !before.has(tileName(t)));
      return fresh.find((t) => wanted.includes(low(tileName(t))) && finished(t)) ||
        (fresh.length === 1 && finished(fresh[0]) && !/upload/i.test(tileName(fresh[0])) ? fresh[0] : null);
    }, 240000, 800);
    if (!done) throw new Error(`"${name}" did not finish uploading.`);
    const uploadedAs = tileName(done);
    await sleep(1200);
    if (uploadedAs !== name) await renameTile(imageTiles().find((x) => tileName(x) === uploadedAs) || done, name);
    if (!(await waitFor(() => imageTiles().find((t) => tileName(t) === name), 8000)))
      log(`${name}: uploaded, but it is named "${tileName(tile)}". Rename it in Flow.`, "warn");
    else log(`${name}: uploaded.`);
    return { created: true, name };
  }

  // ---------------------------------------------------------------- building a Character

  // The media picker ("Add from project"): choose an image by its exact name.
  async function pickFromProject(imageName) {
    const pane = await waitFor(() => [...document.querySelectorAll(".flow-media-picker-dialog-panel, .flow-add-menu-dialog-panel")].find(visible), 8000);
    if (!pane) throw new Error("The image picker did not open.");
    const select = pane.querySelector('mat-select[aria-label="Select project"]');
    if (select && low(select.textContent) !== "characters") {
      select.querySelector(".mat-mdc-select-trigger")?.click();
      const opt = await waitFor(() => [...document.querySelectorAll("mat-option")].find((o) => low(o.textContent) === "characters"), 5000);
      if (!opt) throw new Error('The picker has no "Characters" project.');
      opt.click();
      await sleep(1500);
    }
    const search = pane.querySelector('input[placeholder="Search assets"]');
    if (search) {
      typeInto(search, imageName);
      await sleep(1200);
    }
    const title = (b) => low((b.querySelector(".asset-title")?.textContent) || b.innerText.split("\n")[0]);
    const item = await waitFor(() => [...pane.querySelectorAll("button.asset-item")].find((b) => title(b) === low(imageName)), 10000);
    if (!item) {
      (pane.querySelector("button.header-close-btn") || byAria("Close", pane))?.click();
      escape();
      throw new Error(`"${imageName}" is not an image in the Characters project.`);
    }
    item.click();
    await sleep(600);
    const add = pane.isConnected && pane.querySelector("button.detail-add-to-prompt-btn");
    if (add && visible(add)) add.click();
    await waitFor(() => !pane.isConnected || !visible(pane), 6000);
  }

  // ---------------------------------------------------------------- voices

  // The voice a Character speaks with: Flow shows it in a card ("puck") once
  // chosen, and a "Select a voice" button while it has none.
  const cap = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v);
  const currentVoice = () => {
    const card = document.querySelector(".voice-card-name");
    return card && visible(card) ? cap(norm(card.textContent)) : null;
  };

  // Choose a Flow voice by name in the "Select a voice" picker. Replaces a
  // different voice (Remove first); does nothing when it is already set.
  async function setVoice(voice) {
    const now = currentVoice();
    if (now && low(now) === low(voice)) return { unchanged: true };
    if (now) {
      document.querySelector("button.voice-remove-btn")?.click();
      if (!(await waitFor(() => document.querySelector("button.voice-selector-empty-btn"), 5000))) throw new Error(`Could not remove the voice ${now}.`);
      await sleep(400);
    }
    const open = await waitFor(() => document.querySelector("button.voice-selector-empty-btn"), 5000);
    if (!open) throw new Error('"Select a voice" was not found on the Character page.');
    open.click();
    const pane = await waitFor(() => [...document.querySelectorAll(".flow-add-menu-dialog-panel")].find((p) => visible(p) && /select a voice/i.test(p.textContent)), 8000);
    if (!pane) throw new Error("The voice picker did not open.");
    const search = pane.querySelector('input[placeholder="Search assets"], input');
    if (search) { typeInto(search, voice); await sleep(1000); }
    const nameOf = (b) => low((b.innerText || "").split("\n").map(norm).filter((x) => x && x !== "voice_selection")[0]);
    const item = await waitFor(() => [...pane.querySelectorAll("button.asset-item")].find((b) => nameOf(b) === low(voice)), 8000);
    if (!item) {
      pane.querySelector("button.header-close-btn")?.click();
      throw new Error(`Flow has no voice named "${voice}".`);
    }
    // Clicking the already-selected voice applies it and closes the picker;
    // otherwise it selects it and "Add to character" applies it.
    item.click();
    const applied = () => low(currentVoice() || "") === low(voice);
    await waitFor(() => applied() || !pane.isConnected || pane.querySelector("button.detail-add-to-prompt-btn"), 4000);
    if (!applied() && pane.isConnected) pane.querySelector("button.detail-add-to-prompt-btn")?.click();
    if (!(await waitFor(applied, 8000))) throw new Error(`The voice ${voice} did not take.`);
    return { changed: now || "none" };
  }

  // Open a saved Character, give it the voice, and save.
  async function setCharacterVoice({ name, voice }) {
    await openCharacter(name);
    const r = await setVoice(voice);
    if (r.unchanged) {
      await leaveCharacterPage();
      return { unchanged: true, voice };
    }
    byText(/^Done$/)?.click();
    await waitFor(() => !onCharacterPage(), 10000);
    await sleep(800);
    log(`${name}: voice ${r.changed === "none" ? "set to" : `changed from ${r.changed} to`} ${voice}.`);
    return { set: true, voice, was: r.changed };
  }

  // Type the Character's name, commit it, and check Flow kept it (both the
  // field and the page title show it). Up to three tries.
  async function setCharacterName(name) {
    for (let attempt = 0; attempt < 3; attempt++) {
      let input = document.querySelector("input.name-input");
      if (!input || !visible(input)) { byAria("Edit name")?.click(); await sleep(300); input = document.querySelector("input.name-input"); }
      if (!input) return false;
      typeInto(input, name);
      await sleep(200);
      pressKey(input, "Enter");
      input.blur();
      await sleep(1500);
      const field = document.querySelector("input.name-input")?.value;
      const title = document.querySelector("input.editable-text-input")?.value;
      if (field === name && (!title || title === name)) return true;
    }
    return false;
  }

  async function createCharacter({ name, info, front, turnaround, voice }) {
    const view = await openCharactersView();
    if (view === "grid" && (await findCharacterTile(name))) {
      // Not copied again, but it still gets the voice the seed gives it.
      if (voice) {
        const r = await setCharacterVoice({ name, voice });
        log(`${name}: already a saved Character; skipped${r.unchanged ? ` (voice ${voice} already set)` : ""}.`);
        return { skipped: true, voice: r };
      }
      log(`${name}: already a saved Character; skipped.`);
      return { skipped: true };
    }
    log(`${name}: building the Character…`);
    if (view === "grid") {
      // The grid is virtual: after a scroll the tile may need a moment to render.
      scrollAll(0);
      const tile = await waitFor(() => { scrollAll(0); return newCharacterTile(); }, 8000, 300);
      if (!tile) throw new Error('The "New character" tile was not found at the top of the Characters grid.');
      click(tile);
    }
    const addFrom = await waitFor(() => onCharacterPage() && byText(/^add from project$/i), 15000);
    if (!addFrom) throw new Error('"Add from project" was not found on the New character page.');
    addFrom.click();
    await pickFromProject(front);
    // Flow saves the Character as soon as it has a Portrait: the URL gains its id.
    if (!(await waitFor(() => /\/character\/[^/]+/.test(location.pathname) && slotImage("Portrait"), 60000, 300)))
      throw new Error("The Portrait did not appear.");
    log(`  Portrait: ${front}.`);
    await sleep(800);

    // Flow is still saving the new Character for a moment; a name typed then is
    // overwritten with "Untitled character". Wait, set it, and check it stuck.
    await sleep(2500);
    if (!(await setCharacterName(name))) throw new Error(`Flow would not keep the name "${name}".`);

    if (info) {
      const ta = document.querySelector("textarea.personality-textarea");
      typeInto(ta, info);
      ta.dispatchEvent(new Event("blur", { bubbles: true }));
      ta.blur();
      await sleep(500);
    }

    if (voice) {
      await setVoice(voice);
      log(`  Voice: ${voice}.`);
    }

    if (turnaround) {
      slotChip("Body").click();
      const addBody = await waitFor(() => byText(/^add from project$/i), 8000);
      if (!addBody) throw new Error('The Body slot shows no "Add from project".');
      addBody.click();
      await pickFromProject(turnaround);
      if (!(await waitFor(() => slotImage("Body"), 90000, 400))) throw new Error("The Body image did not appear.");
      log(`  Body: ${turnaround}.`);
      await sleep(1500);
    }

    if (document.querySelector("input.name-input")?.value !== name) await setCharacterName(name);
    if (info && document.querySelector("textarea.personality-textarea")?.value !== info) log("  The Character info did not take in full.", "warn");
    const done = byText(/^Done$/);
    if (!done) throw new Error('"Done" was not found on the Character page.');
    done.click();
    await waitFor(() => !onCharacterPage(), 10000);
    await sleep(1200);
    // Confirm the grid shows it by name; repair an "Untitled character" left behind.
    await openCharactersView();
    if (!(await findCharacterTile(name))) {
      const untitled = await findCharacterTile("Untitled character");
      if (!untitled) throw new Error(`"${name}" was not found in the Characters grid after saving.`);
      log(`  Saved as "Untitled character"; renaming it to "${name}".`, "warn");
      click(untitled.img);
      await waitFor(() => onCharacterPage() && document.querySelector("input.name-input"), 15000);
      await sleep(1500);
      if (!(await setCharacterName(name))) throw new Error(`Rename "Untitled character" to "${name}" in Flow.`);
      byText(/^Done$/)?.click();
      await waitFor(() => !onCharacterPage(), 10000);
    }
    log(`${name}: saved.`);
    return { created: true };
  }

  // ---------------------------------------------------------------- Agent instruction cards

  async function openInstructions() {
    needProject("the film's project");
    await leaveCharacterPage();
    const open = document.querySelector(".agent-panel-content");
    if (open && visible(open)) return open;
    if (!byAria("Agent instructions")) {
      document.querySelector(".agent-mode-chip")?.click();
      if (!(await waitFor(() => byAria("Agent instructions"), 5000))) throw new Error("Could not switch the prompt box to Agent.");
    }
    if (!document.querySelector(".agent-panel-content")) byAria("Agent instructions").click();
    const panel = await waitFor(() => document.querySelector(".agent-panel-content"), 8000);
    if (!panel) throw new Error("The Agent instructions panel did not open.");
    await sleep(600);
    return panel;
  }

  const cardTitles = (panel) => [...panel.querySelectorAll('input[placeholder="Instruction title"]')].map((i) => norm(i.value));

  // The panel's header arrow closes it without saving.
  function closeInstructions(panel, save) {
    if (save) { panel.querySelector(".done-button")?.click(); return; }
    let el = panel;
    for (let i = 0; i < 4 && el; i++, el = el.parentElement) {
      const back = [...el.querySelectorAll("button")].find((b) => visible(b) && /arrow_back|chevron_left|close/.test(b.textContent) && !panel.contains(b));
      if (back) { back.click(); return; }
    }
  }

  async function listCards() {
    const panel = await openInstructions();
    const titles = cardTitles(panel);
    const texts = [...panel.querySelectorAll("textarea.description-input")].map((t) => norm(t.value).slice(0, 120));
    closeInstructions(panel, false);
    await waitFor(() => !document.querySelector(".agent-panel-content"), 4000);
    await sleep(400);
    return { cards: titles, texts };
  }

  async function pickReference(card, plate) {
    card.querySelector(".reference-button").click();
    const dlg = await waitFor(() => [...document.querySelectorAll(".flow-add-menu-dialog-panel, .flow-media-picker-dialog-panel")].find(visible), 6000);
    if (!dlg) throw new Error("The reference picker did not open.");
    const search = dlg.querySelector('input[placeholder="Search assets"]');
    if (search) { typeInto(search, plate); await sleep(1200); }
    const item = await waitFor(() => [...dlg.querySelectorAll("button.asset-item")].find((b) => low(b.querySelector(".asset-title")?.textContent || b.innerText.split("\n")[0]) === low(plate)), 10000);
    if (!item) {
      dlg.querySelector("button.header-close-btn")?.click();
      throw new Error(`"${plate}" is not in this project's images; upload the plate first.`);
    }
    item.click();
    await sleep(500);
    const add = dlg.isConnected && dlg.querySelector("button.detail-add-to-prompt-btn");
    if (add && visible(add)) add.click();
    await waitFor(() => !dlg.isConnected || !visible(dlg), 5000);
  }

  async function fillInstructions({ cards }) {
    const panel = await openInstructions();
    const have = cardTitles(panel).map(low);
    const texts = [...panel.querySelectorAll("textarea.description-input")].map((t) => norm(t.value).slice(0, 120));
    let added = 0;
    for (const c of cards) {
      if (have.includes(low(c.title)) || texts.includes(norm(c.text).slice(0, 120))) {
        log(`${c.title}: already a card; skipped.`);
        continue;
      }
      // Flow re-renders the panel after each edit: find it again, and retry the add.
      const P = () => document.querySelector(".agent-panel-content");
      const titles = () => P()?.querySelectorAll('input[placeholder="Instruction title"]') || [];
      const count = titles().length;
      let ok = false;
      for (let attempt = 0; attempt < 4 && !ok; attempt++) {
        await sleep(attempt ? 1200 : 600);
        P()?.querySelector(".add-instruction-button")?.click();
        ok = !!(await waitFor(() => titles().length > count, 2500));
      }
      if (!ok) throw new Error('"Add instruction" did not add a card.');
      const inputs = titles();
      const title = inputs[inputs.length - 1];
      let card = title;
      while (card && !card.querySelector("textarea.description-input")) card = card.parentElement;
      // The title only saves when committed with Enter, then blur.
      typeInto(title, c.title);
      await sleep(200);
      pressKey(title, "Enter");
      title.blur();
      await sleep(400);
      const ta = card.querySelector("textarea.description-input");
      typeInto(ta, c.text);
      ta.blur();
      await sleep(400);
      if (ta.value !== c.text) log(`  ${c.title}: the guideline did not take in full (${ta.value.length} of ${c.text.length} characters).`, "warn");
      for (let i = 0; i < 3; i++) {
        const sw = card.querySelector('button[role="switch"]');
        if (!sw || sw.getAttribute("aria-checked") === "true") break;
        sw.click();
        await waitFor(() => card.querySelector('button[role="switch"]')?.getAttribute("aria-checked") === "true", 1500);
      }
      if (card.querySelector('button[role="switch"]')?.getAttribute("aria-checked") !== "true") log(`  ${c.title}: could not switch the card on; switch it on in Flow.`, "warn");
      if (c.reference) await pickReference(card, c.reference);
      log(`${c.title}: added${c.reference ? ` with ${c.reference}` : ""}.`);
      added++;
      await sleep(400);
    }
    closeInstructions(panel, true);
    await waitFor(() => !document.querySelector(".agent-panel-content"), 4000);
    await sleep(400);
    return { added };
  }


  // ---------------------------------------------------------------- Agent settings (Flow UI of 2026-11-27)
  //
  // Flow replaced the "Agent instructions" cards with Agent settings: the gear in the prompt bar (or the
  // Agent side panel) opens a panel with "Confirm before generating" (Always / Never), "Image defaults" and
  // "Video defaults" (model, aspect ratio, outputs), and "Memory": cards with a title, a description, a
  // "Use memory" switch, and "Add reference" (an image the card refers to). Cards save as they are edited.

  const agentSettingsBtn = () => byAria("Agent settings");
  const inAgentSettings = () => !!buttons().find((b) => /^add new$/i.test(iconless(b))) && [...document.querySelectorAll("*")].some((e) => e.childElementCount === 0 && norm(e.textContent) === "Confirm before generating" && visible(e));

  async function openAgentSettings() {
    needProject("the film's project");
    await leaveCharacterPage();
    if (inAgentSettings()) return;
    if (!agentSettingsBtn()) {
      // The gear shows while the Flow Agent is on: switch it on if the toggle says it is off.
      const toggle = byAria("Flow Agent");
      if (toggle) { click(toggle); await waitFor(agentSettingsBtn, 4000); }
    }
    const gear = await waitFor(agentSettingsBtn, 6000);
    if (!gear) throw new Error('"Agent settings" (the gear in the prompt bar) was not found. Turn on the Flow Agent in the prompt bar.');
    gear.click();
    if (!(await waitFor(inAgentSettings, 8000))) throw new Error("Agent settings did not open.");
    await sleep(600);
  }

  // A Memory card (<flow-project-brief-card>): its header holds the title, switch, Add reference, and Delete;
  // its body below holds the description (a textarea while editing, a preview once saved).
  const memoryCard = (title) => {
    const card = title.closest("flow-project-brief-card");
    if (card) return card;
    let c = title;
    while (c && !c.querySelector("textarea.card-description, .description-preview")) c = c.parentElement;
    return c;
  };
  const memoryCards = () => [...document.querySelectorAll("input.card-title")].map((t) => {
    const card = memoryCard(t);
    const d = card?.querySelector("textarea.card-description, .description-preview, .card-description");
    return { title: t, card, name: norm(t.value), text: norm(d ? (d.value ?? d.textContent) : "") };
  });

  async function listMemories() {
    await openAgentSettings();
    return { cards: memoryCards().map((m) => m.name).filter(Boolean), texts: memoryCards().map((m) => m.text.slice(0, 120)) };
  }

  // "Add reference" on a card → "Select reference image" → the image by name → "Add to memory".
  async function pickMemoryReference(card, imageName) {
    const btn = card.querySelector('button[class*="add-refer"]') || [...card.querySelectorAll("button")].find((b) => /add reference/i.test(b.textContent));
    if (!btn) throw new Error('The card has no "Add reference" button.');
    btn.click();
    const dlg = await waitFor(() => [...document.querySelectorAll(".flow-add-menu-dialog-panel, .flow-media-picker-dialog-panel")].find(visible), 6000);
    if (!dlg) throw new Error("The reference picker did not open.");
    const search = dlg.querySelector('input[placeholder="Search assets"]');
    if (search) { typeInto(search, imageName); await sleep(1200); }
    const title = (b) => low(b.querySelector(".asset-title")?.textContent || b.innerText.split("\n")[0]);
    const item = await waitFor(() => [...dlg.querySelectorAll("button.asset-item")].find((b) => title(b) === low(imageName)), 10000);
    if (!item) {
      dlg.querySelector('button.header-close-btn, button[aria-label="Close"]')?.click();
      throw new Error(`"${imageName}" is not an image in this project; upload and name the plate first.`);
    }
    item.click();
    await sleep(500);
    const add = await waitFor(() => [...dlg.querySelectorAll("button")].find((b) => visible(b) && /^add to (memory|prompt)$/i.test(iconless(b))) || dlg.querySelector("button.detail-add-to-prompt-btn"), 3000);
    if (add) add.click();
    await waitFor(() => !dlg.isConnected || !visible(dlg), 5000);
  }

  // cards: [{ title, text, reference? }]. A card whose title (or text) is already a Memory is skipped.
  async function fillMemories({ cards }) {
    await openAgentSettings();
    let added = 0;
    for (const c of cards) {
      const have = memoryCards();
      const same = have.find((m) => low(m.name) === low(c.title) || (m.text && m.text.slice(0, 120) === norm(c.text).slice(0, 120)));
      if (same && same.text.slice(0, 120) === norm(c.text).slice(0, 120)) {
        log(`${c.title}: already a Memory; skipped.`);
        continue;
      }
      // A card with this title but not its text (a run that stopped half way) is completed; an empty card
      // left open (from "Add new") is reused; otherwise one is added. New cards appear at the top.
      let m = same || have.find((x) => !x.name && !x.text);
      if (!m) {
        const before = have.length;
        const addNew = buttons().find((b) => /^add new$/i.test(iconless(b)));
        if (!addNew) throw new Error('Memory "Add new" was not found in Agent settings.');
        addNew.click();
        if (!(await waitFor(() => memoryCards().length > before, 4000))) throw new Error('"Add new" did not add a Memory card.');
        m = memoryCards().find((x) => !x.name && !x.text);
      }
      if (!m) throw new Error("No empty Memory card to fill.");
      const { title, card } = m;
      typeInto(title, c.title);
      await sleep(200);
      pressKey(title, "Enter");
      title.blur();
      await sleep(400);
      if (!card.querySelector("textarea.card-description")) card.querySelector(".description-preview")?.click();
      const ta = await waitFor(() => card.querySelector("textarea.card-description"), 3000);
      if (!ta) throw new Error(`${c.title}: the card's description box was not found.`);
      typeInto(ta, c.text);
      ta.dispatchEvent(new Event("blur", { bubbles: true }));
      ta.blur();
      await sleep(800);
      if (norm(ta.value) !== norm(c.text)) log(`  ${c.title}: the text did not take in full (${ta.value.length} of ${c.text.length} characters).`, "warn");
      const sw = card.querySelector('button[role="switch"][aria-label="Use memory"], button[role="switch"]');
      if (sw && sw.getAttribute("aria-checked") !== "true") { sw.click(); await waitFor(() => sw.getAttribute("aria-checked") === "true", 1500); }
      if (c.reference) await pickMemoryReference(card, c.reference);
      log(`${c.title}: added${c.reference ? ` with ${c.reference}` : ""}.`);
      added++;
      await sleep(600);
    }
    return { added };
  }

  // settings: { confirm: "Never" | "Always", image: { model, aspect, outputs }, video: { model, aspect, outputs } }.
  async function setDefaultsPage(label, want) {
    if (!want) return;
    const open = buttons().find((b) => new RegExp(`^${label}`, "i").test(iconless(b).replace(/^(image|videocam)/, "")));
    if (!open) throw new Error(`"${label}" was not found in Agent settings.`);
    open.click();
    await waitFor(() => document.querySelector("label.radio-option"), 5000);
    await sleep(400);
    if (want.model) {
      const row = [...document.querySelectorAll("label.radio-option")].filter(visible).find((l) => low(iconless(l)).replace(/^\W+/, "").includes(low(want.model)));
      if (!row) throw new Error(`${label}: Flow offers no model "${want.model}".`);
      if (!row.classList.contains("radio-option-selected")) { row.click(); await waitFor(() => row.classList.contains("radio-option-selected"), 2000); }
    }
    for (const v of [want.aspect, want.outputs && `x${want.outputs}`].filter(Boolean)) {
      const r = [...document.querySelectorAll('[role="radio"]')].filter(visible).find((b) => low(iconless(b)).endsWith(low(v)));
      if (!r) throw new Error(`${label}: no "${v}" option.`);
      if (r.getAttribute("aria-checked") !== "true") { r.click(); await waitFor(() => r.getAttribute("aria-checked") === "true", 2000); }
    }
    byAria("Back")?.click();
    await waitFor(inAgentSettings, 5000);
    await sleep(400);
  }

  async function applyAgentSettings(settings = {}) {
    await openAgentSettings();
    if (settings.confirm) {
      const t = buttons().find((b) => b.classList.contains("mat-button-toggle-button") && low(iconless(b)).replace(/info$/, "").trim() === low(settings.confirm));
      if (!t) throw new Error(`No "${settings.confirm}" option under Confirm before generating.`);
      // Flow marks the chosen option with role="radio" aria-checked="true" (and mat-button-toggle-checked).
      const on = () => t.getAttribute("aria-checked") === "true" || t.getAttribute("aria-pressed") === "true" || !!t.closest(".mat-button-toggle-checked");
      if (!on()) { t.click(); await waitFor(on, 2000); }
      if (!on()) throw new Error(`Could not set Confirm before generating to ${settings.confirm}.`);
    }
    await setDefaultsPage("Image defaults", settings.image);
    await setDefaultsPage("Video defaults", settings.video);
    return { applied: true };
  }

  // The top bar's Settings menu: view mode, grid size, and four switches.
  // view: { mode: "Grid", size: "S", "Sound on hover": false, "Return silent videos": false, "Show tile details": false, "Clear prompt on submit": true }
  async function applyViewSettings(view = {}) {
    needProject("the film's project");
    byAria("Settings")?.click();
    const pane = await waitFor(() => [...document.querySelectorAll(".cdk-overlay-pane")].filter(visible).find((p) => /view mode/i.test(p.textContent)), 5000);
    if (!pane) throw new Error("The view Settings menu did not open.");
    for (const v of [view.mode, view.size].filter(Boolean)) {
      const b = [...pane.querySelectorAll('[role="radio"]')].find((x) => low(iconless(x)).replace(/^(dashboard|campaign_all)/, "") === low(v));
      if (b && b.getAttribute("aria-checked") !== "true") { b.click(); await sleep(400); }
    }
    for (const [name, on] of Object.entries(view)) {
      if (name === "mode" || name === "size") continue;
      const sw = pane.querySelector(`button[role="switch"][aria-label="${name} toggle"]`);
      if (!sw) { log(`  View setting "${name}" not found.`, "warn"); continue; }
      if ((sw.getAttribute("aria-checked") === "true") !== !!on) { sw.click(); await sleep(400); }
    }
    escape();
    await sleep(300);
    return { applied: true };
  }

  // ---------------------------------------------------------------- commands

  const commands = {
    ping: async () => ({ extensionId: chrome.runtime.id, url: location.href, inProject: inProject(), project: inProject() ? projectName() : null, ready: document.readyState }),
    projectUrl,
    listCharacters: async () => ({ names: await listCharacters() }),
    exportCharacter,
    // Test bridge: export a Character straight to Downloads/flow-seed-export/.
    saveCharacter: async ({ name }) => {
      const c = await exportCharacter({ name });
      const k = kebab(c.name);
      const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
      const saved = [];
      for (const view of ["front", "turnaround"]) {
        if (!c[view]) continue;
        const filename = `flow-seed-export/characters/${k}-${view}.${ext[c[view].type] || "png"}`;
        const r = await chrome.runtime.sendMessage({ type: "download", url: c[view].dataUrl, filename });
        if (!r?.ok) throw new Error(`Saving ${filename} failed: ${r?.error}`);
        saved.push(r.path);
      }
      const json = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ name: c.name, info: c.info, voice: c.voice, exported: new Date().toISOString() }, null, 2));
      const filename = `flow-seed-export/characters/${k}-info.json`;
      const r = await chrome.runtime.sendMessage({ type: "download", url: json, filename });
      if (!r?.ok) throw new Error(`Saving ${filename} failed: ${r?.error}`);
      saved.push(r.path);
      return { name: c.name, voice: c.voice, infoLength: c.info.length, saved };
    },
    listImages,
    listPlates,
    exportPlates,
    uploadImage: async (m) => uploadImage(m.image),
    createCharacter: async (m) => createCharacter(m.character),
    setCharacterVoice,
    listCards: async () => (agentSettingsBtn() || inAgentSettings() ? listMemories() : listCards()),
    fillInstructions: async (m) => (agentSettingsBtn() || inAgentSettings() ? fillMemories(m) : fillInstructions(m)),
    applyAgentSettings: async (m) => applyAgentSettings(m.settings),
    applyViewSettings: async (m) => applyViewSettings(m.view),
    renameImage: async ({ from, to }) => {
      await openImagesView();
      await collectImages();
      scrollAll(0);
      await sleep(500);
      let t = null;
      for (let i = 0; i < 40 && !t; i++) { t = imageTiles().find((x) => tileName(x) === from); if (!t) { scrollAll(1); await sleep(300); } }
      if (!t) throw new Error(`No image named "${from}".`);
      await renameTile(t, to);
      return { renamed: true };
    },
    // Test bridge: read a seed or export ZIP from the dev/ folder, unpacked in
    // memory the way the side panel unpacks a chosen ZIP.
    zipManifest: async ({ devZip }) => ({ manifest: JSON.parse(new TextDecoder().decode((await devZipEntries(devZip)).get("manifest.json"))) }),
    zipEntry: async ({ devZip, path }) => {
      const data = (await devZipEntries(devZip)).get(path);
      if (!data) throw new Error(`${path} is not in ${devZip}.`);
      const type = /\.png$/i.test(path) ? "image/png" : /\.webp$/i.test(path) ? "image/webp" : "image/jpeg";
      const dataUrl = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(new Blob([data], { type })); });
      return { type, dataUrl };
    },
  };

  const zipCache = new Map();
  async function devZipEntries(devZip) {
    if (!zipCache.has(devZip)) {
      const buf = await (await fetch(chrome.runtime.getURL(devZip))).arrayBuffer();
      zipCache.set(devZip, new Map((await FasZip.unzip(buf)).map((e) => [e.path, e.data])));
    }
    return zipCache.get(devZip);
  }

  async function run(msg) {
    stopRequested = false;
    const fn = commands[msg?.type];
    if (!fn) throw new Error(`Unknown command ${msg?.type}.`);
    return fn(msg);
  }

  chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
    if (msg?.type === "stop") { stopRequested = true; reply({ ok: true }); return false; }
    if (!commands[msg?.type]) return false;
    run(msg).then((r) => reply({ ok: true, ...r }), (e) => reply({ ok: false, error: e.message }));
    return true;
  });

  // Test bridge for the page's own console (and for debugging):
  //   window.postMessage({ fas: "cmd", id: 1, type: "listCharacters" }, "*")
  // posts back { fasResult: 1, ok, ... } with image data URLs shortened.
  // { fas: "reload" } reloads the extension itself.
  window.addEventListener("message", async (e) => {
    if (e.source !== window || !e.data?.fas) return;
    if (e.data.fas === "reload") { send({ type: "reload-extension" }); return; }
    if (e.data.fas === "stop") { stopRequested = true; return; }
    if (e.data.fas !== "cmd") return;
    // { devArgs: "dev/args.json" } loads the command's arguments from the dev folder.
    if (e.data.devArgs) Object.assign(e.data, await (await fetch(chrome.runtime.getURL(e.data.devArgs))).json());
    const shorten = (v) => e.data.type === "zipEntry" ? v : JSON.parse(JSON.stringify(v, (k, x) => (k === "dataUrl" ? `${x.slice(0, 40)}… (${x.length})` : x)));
    try {
      const r = await run(e.data);
      window.postMessage({ fasResult: e.data.id, ok: true, ...shorten(r) }, location.origin);
    } catch (err) {
      window.postMessage({ fasResult: e.data.id, ok: false, error: err.message }, location.origin);
    }
  });
})();
