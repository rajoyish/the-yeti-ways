// Side panel: Export from the old Flow account, Import a seed folder into the new one.

const $ = (id) => document.getElementById(id);
const kebab = (s) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const EXPORT_DIR = "flow-seed-export";
const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

let busy = false;
let stopRequested = false;
let seed = null; // { manifest, files: Map<relative path, File> }
let present = null; // what the open Flow account/project already holds

// The local library's Character names (from the last seed folder loaded), so
// Export and Check can tell new Characters from ones already copied.
let library = null;
try { library = JSON.parse(localStorage.getItem("fas-library") || "null"); } catch {}
const inLibrary = (name) => !!library && library.some((n) => kebab(n) === kebab(name));

// ---------------------------------------------------------------- log

function log(text, level = "info") {
  const line = document.createElement("div");
  line.className = level;
  line.textContent = `${new Date().toLocaleTimeString()}  ${text}`;
  $("log").appendChild(line);
  $("log").scrollTop = $("log").scrollHeight;
  $("logCount").textContent = $("log").children.length;
  if (level === "error") {
    setStatus("Needs attention", "error");
    $("logDetails").open = true;
  }
}

function setStatus(text, state = "ready") {
  $("status").replaceChildren(document.createElement("i"), document.createTextNode(text));
  $("status").dataset.state = state;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "log") log(msg.text, msg.level);
});

// ---------------------------------------------------------------- talking to the Flow tab

const FLOW_URL = /^https:\/\/(flow\.google\.com|labs\.google\/fx)/;

// The active tab when it is Flow, otherwise the Flow tab used most recently.
async function flowTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && FLOW_URL.test(tab.url || "")) return tab;
  const flow = (await chrome.tabs.query({})).filter((t) => FLOW_URL.test(t.url || "")).sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
  if (!flow.length) throw new Error("Open Google Flow in a tab first.");
  return flow[0];
}

async function call(type, extra = {}) {
  const tab = await flowTab();
  let r;
  try {
    r = await chrome.tabs.sendMessage(tab.id, { type, ...extra });
  } catch {
    throw new Error("The Flow tab is not ready. Reload it (the extension was probably just installed or reloaded).");
  }
  if (!r?.ok) throw new Error(r?.error || "No answer from the Flow tab.");
  return r;
}

// Load a URL in the Flow tab and wait until its content script answers.
async function goto(url) {
  const tab = await flowTab();
  await chrome.tabs.update(tab.id, { url });
  await new Promise((resolve) => {
    const on = (id, info) => {
      if (id === tab.id && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(on);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(on);
    setTimeout(() => { chrome.tabs.onUpdated.removeListener(on); resolve(); }, 30000);
  });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await chrome.tabs.sendMessage(tab.id, { type: "ping" });
      if (r?.ok) { await new Promise((res) => setTimeout(res, 2500)); return r; }
    } catch {}
    await new Promise((res) => setTimeout(res, 500));
  }
  throw new Error(`Flow did not finish loading ${url}.`);
}

const FLOW_HOME = "https://flow.google.com/";
const CHAR_PROJECT = "Characters";

// Open the account's "Characters" project, creating it if asked.
async function toCharactersProject(create) {
  const here = await call("ping");
  if (here.inProject && here.project?.toLowerCase() === CHAR_PROJECT.toLowerCase()) return;
  log(`Opening the "${CHAR_PROJECT}" project…`);
  await goto(FLOW_HOME);
  const r = await call("projectUrl", { name: CHAR_PROJECT, create });
  if (!r.created) await goto(r.url);
}

async function job(fn) {
  if (busy) return;
  busy = true;
  stopRequested = false;
  setStatus("Working…", "busy");
  $("logDetails").open = true;
  document.querySelectorAll(".list").forEach((el) => (el.inert = true));
  $("stop").disabled = false;
  document.querySelectorAll("button:not(#stop):not(.tabs button)").forEach((b) => (b.dataset.was = b.disabled, (b.disabled = true)));
  try {
    await fn();
  } catch (e) {
    log(e.message, "error");
  } finally {
    busy = false;
    document.querySelectorAll(".list").forEach((el) => (el.inert = false));
    if ($("status").dataset.state !== "error") setStatus(stopRequested ? "Stopped" : "Ready");
    $("stop").disabled = true;
    document.querySelectorAll("button:not(#stop):not(.tabs button)").forEach((b) => (b.disabled = b.dataset.was === "true"));
    refreshButtons();
  }
}

$("stop").onclick = async () => {
  stopRequested = true;
  try { const tab = await flowTab(); await chrome.tabs.sendMessage(tab.id, { type: "stop" }); } catch {}
  log("Stopping after the current step…", "warn");
  setStatus("Stopping…", "busy");
};

function checkStop() {
  if (stopRequested) throw new Error("Stopped.");
}

// ---------------------------------------------------------------- tabs

function showTab(name) {
  $("export").hidden = name !== "export";
  $("import").hidden = name !== "import";
  $("tabExport").classList.toggle("on", name === "export");
  $("tabImport").classList.toggle("on", name === "import");
  $("tabExport").setAttribute("aria-pressed", String(name === "export"));
  $("tabImport").setAttribute("aria-pressed", String(name === "import"));
}
$("tabExport").onclick = () => showTab("export");
$("tabImport").onclick = () => showTab("import");

// ---------------------------------------------------------------- checklists

function checklist(el, rows) {
  el.replaceChildren(
    ...rows.map((r) => {
      const label = document.createElement("label");
      label.className = "item";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = r.checked !== false;
      box.disabled = !!r.disabled;
      box.value = r.value;
      const text = document.createElement("span");
      text.textContent = r.label;
      if (r.note) {
        const small = document.createElement("small");
        small.textContent = r.note;
        text.appendChild(small);
      }
      label.append(box, text);
      if (r.tag) {
        const tag = document.createElement("span");
        tag.className = `tag ${r.tagClass || ""}`;
        tag.textContent = r.tag;
        label.appendChild(tag);
      }
      return label;
    })
  );
  el.inert = busy;
  refreshButtons();
}
const checked = (el) => [...el.querySelectorAll("input:checked:not(:disabled)")].map((b) => b.value);

function refreshButtons() {
  $("exportChars").disabled = busy || !checked($("charList")).length;
  $("exportPlates").disabled = busy || !checked($("plateList")).length;
  $("exportNew").disabled = busy || !checked($("newList")).length;
  $("run").disabled = busy || !seed || !checked($("planList")).length;
  $("check").disabled = busy || !seed;
  for (const [id, countId, selectionId] of [
    ["charList", "charCount", "charSelection"],
    ["plateList", "plateCount", "plateSelection"],
    ["planList", null, "planSelection"],
    ["newList", null, "newSelection"],
  ]) {
    const total = $(id).children.length;
    const selected = checked($(id)).length;
    if (countId && $(countId).dataset.scanned) $(countId).textContent = `${total} found`;
    $(selectionId).textContent = `${selected} of ${total} selected`;
    document.querySelector(`[data-list="${id}"]`).hidden = !total;
  }
}

document.querySelectorAll(".list").forEach((el) => el.addEventListener("change", refreshButtons));
document.querySelectorAll("[data-select], [data-clear]").forEach((button) => {
  button.onclick = () => {
    if (busy) return;
    const id = button.dataset.select || button.dataset.clear;
    $(id).querySelectorAll("input:not(:disabled)").forEach((box) => (box.checked = !!button.dataset.select));
    refreshButtons();
  };
});

// ---------------------------------------------------------------- export

// Saved by the service worker, which also keeps the filename (see background.js).
async function download(dataUrl, filename) {
  const r = await chrome.runtime.sendMessage({ type: "download", url: dataUrl, filename });
  if (!r?.ok) throw new Error(`Saving ${filename} failed: ${r?.error || "interrupted"}`);
  if (r.path && !r.path.replace(/\\/g, "/").endsWith(filename)) log(`Chrome saved ${filename} as ${r.path}.`, "warn");
  return r.path;
}

// A large file is saved from a blob: URL made here; the service worker is told
// its name first so another extension cannot rename it.
async function saveBlob(bytes, filename, type = "application/zip") {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  try {
    await chrome.runtime.sendMessage({ type: "expect-download", filename });
    const id = await chrome.downloads.download({ url, filename, conflictAction: "uniquify", saveAs: false });
    const state = await new Promise((resolve) => {
      const on = (d) => {
        if (d.id !== id || !d.state) return;
        if (d.state.current === "complete" || d.state.current === "interrupted") {
          chrome.downloads.onChanged.removeListener(on);
          resolve(d.state.current);
        }
      };
      chrome.downloads.onChanged.addListener(on);
    });
    if (state !== "complete") throw new Error(`Saving ${filename} was interrupted.`);
    const [item] = await chrome.downloads.search({ id });
    return item?.filename || filename;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

const dataUrlBytes = async (dataUrl) => new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:]/g, "").replace("T", "-");
const YETI_NAMES = ["Papa Yeti", "Mama Yeti", "Babu Yeti"];
// The Yetis always speak with these Flow voices (.agents/skills/ai-studio-tts/
// references/voices.md, "Fixed voices"); every import sets them, whatever the
// seed or export says.
const FIXED_VOICES = { "Papa Yeti": "Iapetus", "Mama Yeti": "Erinome", "Babu Yeti": "Puck" };
const voiceFor = (c) => FIXED_VOICES[c.name] || c.voice || null;

const jsonUrl = (obj) => "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));

$("scanChars").onclick = () => job(async () => {
  await toCharactersProject(false);
  log("Scanning saved Characters…");
  const { names } = await call("listCharacters");
  $("charCount").dataset.scanned = "true";
  $("charEmpty").hidden = !!names.length;
  $("charEmpty").textContent = "No saved Characters found in this account.";
  checklist($("charList"), names.map((n) => ({
    value: n,
    label: n,
    checked: !inLibrary(n),
    tag: library ? (inLibrary(n) ? "in library" : "new") : "",
    tagClass: library ? (inLibrary(n) ? "ok" : "miss") : "",
  })));
  const fresh = library ? names.filter((n) => !inLibrary(n)) : names;
  log(library
    ? `Found ${names.length} Characters: ${fresh.length} new (ticked), ${names.length - fresh.length} already in your library.`
    : `Found ${names.length} Characters. Load a seed folder in Import to tell new ones from ones already copied.`, "done");
});

// Export the named Characters into one ZIP laid out as a seed (manifest.json +
// characters/), so it can be imported straight into the other account.
async function exportCharacters(names) {
  await toCharactersProject(false);
  const files = [];
  const characters = [];
  for (const name of names) {
    checkStop();
    log(`Exporting ${name}…`);
    const c = await call("exportCharacter", { name });
    const k = kebab(c.name);
    const entry = { name: c.name, kind: YETI_NAMES.includes(c.name) ? "yeti" : "cast", info: c.info, voice: c.voice || null, voiceSource: c.voice ? "exported" : null, front: null, turnaround: null };
    entry.imageMetadata = {};
    for (const view of ["front", "turnaround"]) {
      if (!c[view]) continue;
      entry[view] = `characters/${k}-${view}.${EXT[c[view].type] || "png"}`;
      files.push({ path: entry[view], data: await dataUrlBytes(c[view].dataUrl) });
      const { width, height, size, type } = c[view];
      entry.imageMetadata[view] = { width, height, size, type };
    }
    characters.push(entry);
    log(`${c.name}: added to the ZIP${c.voice ? ` (voice ${c.voice})` : " (no voice)"}.`, "done");
  }
  if (!characters.length) return;
  const here = await call("ping");
  const manifest = {
    version: 1,
    source: "flow-export",
    title: `Flow export ${stamp()} (${characters.length} Characters)`,
    exportedFrom: here.url,
    built: new Date().toISOString(),
    storyboard: null,
    characters,
    plates: [],
    instructions: [],
    library: [...new Set([...(library || []), ...characters.map((c) => c.name)])],
  };
  files.unshift({ path: "manifest.json", data: JSON.stringify(manifest, null, 2) + "\n" });
  const bytes = FasZip.zip(files);
  log(`Packing ${characters.length} Characters (${(bytes.length / 1048576).toFixed(1)} MB)…`);
  const saved = await saveBlob(bytes, `${EXPORT_DIR}/flow-characters-${stamp()}.zip`);
  log(`Saved ${saved}. Import it in the other account's Import tab; seed.mjs collect also adds it to your library.`, "done");
}

$("exportChars").onclick = () => job(() => exportCharacters(checked($("charList"))));

$("scanPlates").onclick = () => job(async () => {
  log("Scanning this project's plates…");
  const { project, plates } = await call("listPlates");
  $("plateCount").dataset.scanned = "true";
  checklist($("plateList"), plates.map((n) => ({ value: n, label: n, note: `plates/${kebab(project)}/` })));
  log(`${project}: ${plates.length} plates.`, "done");
});

$("exportPlates").onclick = () => job(async () => {
  const names = checked($("plateList"));
  const { project, plates } = await call("exportPlates", { names });
  if (!plates.length) return;
  const files = [];
  const list = [];
  for (const p of plates) {
    const image = `plates/${p.name}.${EXT[p.type] || "png"}`;
    files.push({ path: image, data: await dataUrlBytes(p.dataUrl) });
    list.push({ name: p.name, image, project });
  }
  const manifest = { version: 1, source: "flow-export", title: `${project} plates`, built: new Date().toISOString(), storyboard: null, characters: [], plates: list, instructions: [], library: library || [] };
  files.unshift({ path: "manifest.json", data: JSON.stringify(manifest, null, 2) + "\n" });
  const saved = await saveBlob(FasZip.zip(files), `${EXPORT_DIR}/flow-plates-${kebab(project)}-${stamp()}.zip`);
  log(`Saved ${plates.length} plates from ${project}: ${saved}. Open the film's project in the other account and Import it.`, "done");
});

// ---------------------------------------------------------------- import

function useSeed(manifest, files, label) {
  seed = { manifest, files };
  if (manifest.library) {
    // An export ZIP adds its Characters to the library remembered so far.
    library = manifest.source === "flow-export" ? [...new Set([...(library || []), ...manifest.library])] : manifest.library;
    try { localStorage.setItem("fas-library", JSON.stringify(library)); } catch {}
  }
  present = null;
  $("pick").textContent = label;
  renderPlan();
  log(`Loaded ${manifest.title || manifest.storyboard}: ${manifest.characters.length} Characters, ${manifest.plates.length} plates, ${manifest.instructions.length} cards.`, "done");
}

const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", avif: "image/avif", json: "application/json" };

// Unpack a ZIP in memory into the same path → File map a folder gives.
async function loadZip(file) {
  log(`Unpacking ${file.name}…`);
  const entries = await FasZip.unzip(await file.arrayBuffer());
  // Accept a ZIP whose files sit inside one top folder, too.
  const top = entries.find((e) => e.path.endsWith("manifest.json"))?.path.replace(/manifest\.json$/, "") ?? "";
  const files = new Map(
    entries
      .filter((e) => e.path.startsWith(top))
      .map((e) => {
        const p = e.path.slice(top.length);
        return [p, new File([e.data], p.split("/").pop(), { type: MIME[p.split(".").pop().toLowerCase()] || "" })];
      })
  );
  const mf = files.get("manifest.json");
  if (!mf) throw new Error(`${file.name} has no manifest.json; it is not a seed or export ZIP.`);
  useSeed(JSON.parse(await mf.text()), files, `🗜️ ${file.name} (${files.size - 1} files)`);
}

$("pick").onclick = () => $("zipFile").click();
$("pickFolder").onclick = () => $("folder").click();
$("zipFile").onchange = () => {
  const file = $("zipFile").files[0];
  $("zipFile").value = "";
  if (file) job(() => loadZip(file));
};
$("pick").ondragover = (e) => { e.preventDefault(); $("pick").classList.add("over"); };
$("pick").ondragleave = () => $("pick").classList.remove("over");
$("pick").ondrop = (e) => {
  e.preventDefault();
  $("pick").classList.remove("over");
  const f = e.dataTransfer.files[0];
  if (f) job(() => loadZip(f));
};
$("folder").onchange = () => job(async () => {
  const all = [...$("folder").files];
  $("folder").value = "";
  if (!all.length) return;
  const files = new Map(all.map((f) => [f.webkitRelativePath.split("/").slice(1).join("/"), f]));
  const mf = files.get("manifest.json");
  if (!mf) {
    log("That folder has no manifest.json. Choose references/flow-seed/<name>/ or an export ZIP.", "error");
    return;
  }
  useSeed(JSON.parse(await mf.text()), files, `📁 ${all[0].webkitRelativePath.split("/")[0]}`);
});

// Every importable step, in order: Characters (their images go into the
// "Characters" project first), then the film's plates, then its cards (a card's
// reference plate must already be in the film's project).
function steps() {
  const m = seed.manifest;
  const out = [];
  const lc = (a) => (a || []).map((n) => n.toLowerCase());
  for (const c of m.characters) {
    const ready = c.front && c.turnaround && c.info;
    const has = present ? present.characters.some((n) => kebab(n) === kebab(c.name)) : undefined;
    out.push({ id: `c:${c.name}`, kind: "Character", label: c.name, ready, has, item: c });
  }
  for (const p of m.plates) {
    const has = present?.images ? lc(present.images).includes(p.name.toLowerCase()) : undefined;
    out.push({ id: `p:${p.name}`, kind: "plate", label: p.name, ready: !!p.image, has, item: p });
  }
  for (const c of m.instructions) {
    const start = c.text ? c.text.replace(/\s+/g, " ").trim().slice(0, 120) : null;
    const has = present?.cards ? lc(present.cards).includes(c.title.toLowerCase()) || (present.texts || []).includes(start) : undefined;
    out.push({ id: `i:${c.title}`, kind: "card", label: c.title, ready: !!c.text, has, item: c });
  }
  return out;
}

function renderPlan() {
  $("planCard").hidden = !seed;
  if (!seed) return;
  $("planTitle").textContent = seed.manifest.title;
  checklist(
    $("planList"),
    steps().map((s) => ({
      value: s.id,
      label: s.label,
      note:
        s.kind === "Character" ? `Character · ${voiceFor(s.item) ? `voice ${voiceFor(s.item)}` : "no voice"}` :
        s.kind === "card" && s.item.reference ? `card · ref ${s.item.reference}` : s.kind,
      checked: s.ready && !s.has,
      disabled: !s.ready,
      tag: !s.ready ? "missing locally" : s.has === undefined ? "" : s.has ? "in Flow" : "to create",
      tagClass: !s.ready ? "miss" : s.has ? "ok" : "",
    }))
  );
  refreshButtons();
}

async function fileArg(path, name) {
  const f = seed.files.get(path);
  if (!f) throw new Error(`${path} is missing from the seed folder.`);
  const dataUrl = await new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => rej(fr.error);
    fr.readAsDataURL(f);
  });
  const ext = path.split(".").pop();
  return { name: name ? `${name}.${ext}` : f.name, type: f.type, dataUrl };
}

// The film's project must be open when the plan has plates or cards.
async function filmProject(needed) {
  const here = await call("ping");
  const isFilm = here.inProject && here.project?.toLowerCase() !== CHAR_PROJECT.toLowerCase();
  if (needed && !isFilm) throw new Error(`Open the film's project in the Flow tab first (it is needed for plates and cards), then run again.`);
  return isFilm ? here : null;
}

function renderNew(names) {
  $("newCard").hidden = !names.length;
  checklist($("newList"), names.map((n) => ({ value: n, label: n, tag: "not in library", tagClass: "miss" })));
}

$("exportNew").onclick = () => job(async () => {
  const names = checked($("newList"));
  await exportCharacters(names);
  log("Import that ZIP in the other account. (seed.mjs collect adds it to your library too.)", "done");
});

$("check").onclick = () => job(async () => {
  const film = await filmProject(seed.manifest.plates.length || seed.manifest.instructions.length);
  present = {};
  if (film) {
    log(`Checking ${film.project}…`);
    present.images = (await call("listPlates")).plates;
    const cardsNow = await call("listCards");
    present.cards = cardsNow.cards;
    present.texts = cardsNow.texts;
  }
  await toCharactersProject(false).catch(() => {});
  try {
    present.characters = (await call("listCharacters")).names;
  } catch {
    present.characters = [];
  }
  const fresh = present.characters.filter((n) => !inLibrary(n));
  const both = present.characters.length - fresh.length;
  const toImport = seed.manifest.characters.filter((c) => !present.characters.some((n) => kebab(n) === kebab(c.name)));
  log(`${present.characters.length} Characters in Flow: ${both} already in your library (skipped), ${toImport.length} to import${fresh.length ? `, ${fresh.length} new here` : ""}.${film ? ` ${present.images.length} plates, ${present.cards.length} cards in ${film.project}.` : ""}`, "done");
  if (fresh.length) log(`New in this account, not in your library: ${fresh.join(", ")}. They are kept; export them to copy them to the other account.`, "warn");
  renderNew(fresh);
  if (film) await goto(film.url);
  renderPlan();
});

$("run").onclick = () => job(async () => {
  const chosen = new Set(checked($("planList")));
  const todo = steps().filter((s) => chosen.has(s.id));
  const chars = todo.filter((s) => s.kind === "Character").map((s) => s.item);
  const plates = todo.filter((s) => s.kind === "plate").map((s) => s.item);
  const cards = todo.filter((s) => s.kind === "card").map((s) => s.item);
  const film = await filmProject(plates.length || cards.length);

  if (chars.length) {
    await toCharactersProject(true);
    for (const c of chars) {
      checkStop();
      const k = kebab(c.name);
      const front = await call("uploadImage", { image: { name: `${c.name} - Front`, also: [`${k}-front`], file: await fileArg(c.front, `${c.name} - Front`) } });
      checkStop();
      const turn = await call("uploadImage", { image: { name: `${c.name} - Turnaround`, also: [`${k}-turnaround`], file: await fileArg(c.turnaround, `${c.name} - Turnaround`) } });
      checkStop();
      await call("createCharacter", { character: { name: c.name, info: c.info, voice: voiceFor(c), front: front.name, turnaround: turn.name } });
    }
  }

  if (film && (plates.length || cards.length)) {
    if ((await call("ping")).url !== film.url) await goto(film.url);
    for (const p of plates) {
      checkStop();
      await call("uploadImage", { image: { name: p.name, file: await fileArg(p.image, p.name) } });
    }
    if (cards.length) {
      checkStop();
      await call("fillInstructions", { cards });
    }
  }
  log(`Import finished: ${todo.length} items. Type @ in the prompt box to check each Character resolves.`, "done");
  present = null;
});

refreshButtons();
