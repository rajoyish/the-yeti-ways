// Side panel: load a storyboard, start jobs in the Flow tab, show the log.

const $ = (id) => document.getElementById(id);
let plan = null;

// "# Babu Yeti and the Sour Mango Trick 150s Storyboard — 16:9 Horizontal"
//   → "Babu Yeti and the Sour Mango Trick"
// "## Video 1 - The Mango Tree", "## Pick-up 1 - Kobi's Search" → collections.
function parseStoryboard(md) {
  const h1 = (md.match(/^#\s+(.+)$/m) || [])[1] || "Untitled";
  const title = h1
    .replace(/\s+\d+\s*s\s+Storyboard\b.*$/i, "")
    .replace(/\s+Storyboard\b.*$/i, "")
    .replace(/\s+[—–-]\s+.*$/, "")
    .trim();
  const collections = [...md.matchAll(/^##\s+((?:Video|Pick-up)\s+\d+\s+-\s+.+?)\s*$/gim)].map((m) => m[1].replace(/\s+/g, " "));
  return { title, collections };
}

function log(text, level = "info") {
  const line = document.createElement("div");
  line.className = level;
  line.textContent = `${new Date().toLocaleTimeString()}  ${text}`;
  $("log").appendChild(line);
  $("log").scrollTop = $("log").scrollHeight;
}

function renderDrop() {
  const drop = $("drop");
  drop.classList.toggle("loaded", !!plan);
  $("clearRow").hidden = !plan;
  if (!plan) {
    drop.textContent = "Drop a storyboard .md here, or click to choose";
    return;
  }
  const name = document.createElement("strong");
  name.textContent = `📄 ${plan.file || "Storyboard"}`;
  const hint = document.createElement("small");
  hint.textContent = "Drop another .md or click to replace";
  drop.replaceChildren(name, hint);
}

function clearPlan() {
  plan = null;
  $("file").value = "";
  $("folder").value = "";
  save();
  render();
  log("Storyboard cleared.");
}

function render() {
  renderDrop();
  $("planBox").hidden = !plan;
  $("create").disabled = $("download").disabled = $("start").disabled = !plan;
  $("needPlan").hidden = !!plan;
  renderFrame();
  if (!plan) {
    $("start").replaceChildren(new Option("Load a storyboard first (Storyboard box above)", ""));
    return;
  }
  $("title").value = plan.title;
  $("count").textContent = `${plan.collections.length} collections`;
  $("list").replaceChildren(...plan.collections.map((c) => Object.assign(document.createElement("li"), { textContent: c })));
  const prev = $("start").value;
  $("start").replaceChildren(...plan.collections.map((c, i) => new Option(c, i)));
  if (prev && prev < plan.collections.length) $("start").value = prev;
  if (!$("folder").value) $("folder").value = plan.title;
}

async function loadFile(file) {
  log(`Reading ${file.name}…`);
  const md = await file.text();
  plan = { ...parseStoryboard(md), file: file.name };
  if (!plan.collections.length) {
    log(`No "## Video N - Title" headings found in ${file.name}.`, "error");
    plan = null;
  } else log(`Loaded ${file.name}: ${plan.collections.length} collections.`);
  await save();
  render();
}

async function save() {
  await chrome.storage.local.set({
    fsdPanel: {
      plan, start: $("start").value, folder: $("folder").value, skip: $("skip").checked, takes: $("takes").checked,
    },
  });
}

// The Flow tab: the active one if it is Flow, else any open Flow tab.
async function flowTab() {
  const isFlow = (t) => /^https:\/\/(labs\.google\/fx|flow\.google\.com)/.test(t.url || "");
  const [active] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (active && isFlow(active)) return active;
  const all = (await chrome.tabs.query({})).filter(isFlow);
  return all[0] || null;
}

async function send(tab, msg) {
  try {
    return await chrome.tabs.sendMessage(tab.id, msg);
  } catch {
    // Tab opened before the extension was loaded: inject the script now.
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    await new Promise((r) => setTimeout(r, 300));
    return chrome.tabs.sendMessage(tab.id, msg);
  }
}

async function start(kind) {
  $("logCard").open = true;
  const tab = await flowTab();
  if (!tab) return log("Open Google Flow in a tab first.", "error");
  plan.title = $("title").value.trim() || plan.title;
  await save();
  const status = await send(tab, { type: "ping" });
  if (kind !== "create" && !status?.inProject) return log("Open the Flow project (not the home page) first.", "error");
  const job = {
    kind,
    status: "running",
    plan: { title: plan.title, collections: plan.collections, folder: $("folder").value.trim() },
    step: kind === "create" ? (status?.inProject ? "collections" : "project") : null,
    index: 0,
    start: Number($("start").value) || 0,
    skipExisting: $("skip").checked,
    allTakes: $("takes").checked,
    projectUrl: kind === "download" ? status.url : null,
  };
  if (kind === "create" && status?.inProject) job.projectUrl = status.url;
  await chrome.storage.local.set({ fsdJob: job });
  log(kind === "create" ? `Creating "${plan.title}"…` : `Downloading from ${plan.collections[job.start]}…`);
  await send(tab, { type: "start" });
}

// ---- End frame of the open video
//
// The panel asks the Flow tab every 1.5 s whether a video is open. The video's
// number comes from Flow itself when the job runs (Back leads to its "Video N"
// collection), so this needs no storyboard.

let openVideo = null; // {title, url, collection: {name, n, next}} from the Flow tab, or null
let frameBusy = false;

function renderFrame() {
  const c = openVideo?.collection;
  $("frameCard").classList.toggle("ready", !!openVideo && !frameBusy);
  if (!openVideo) {
    $("frameTarget").textContent = "No video open";
    $("frameHint").textContent = "In Flow, click a finished video so its player and timeline show.";
  } else {
    $("frameTarget").textContent = openVideo.title || "Untitled video";
    $("frameHint").textContent = c?.n
      ? `Probably from ${c.name}: saves "End frame V${c.n}" into ${c.next || `Video ${c.n + 1}`}. Flow confirms the collection when it runs.`
      : 'Saves its last frame as "End frame V<N>", N from the video\'s "Video N" collection, and moves it into Video N+1.';
  }
  $("frameNow").disabled = !openVideo || frameBusy;
  $("frameHere").disabled = !openVideo || frameBusy;
  $("frameNow").textContent = frameBusy === "end" ? "Saving…" : "Save end frame";
  $("frameHere").textContent = frameBusy === "here" ? "Saving…" : "Save frame at playhead";
}

async function pollOpenVideo() {
  let video = null;
  try {
    const tab = await flowTab();
    if (tab) video = (await chrome.tabs.sendMessage(tab.id, { type: "ping" }))?.video || null;
  } catch {}
  if (JSON.stringify(video) !== JSON.stringify(openVideo)) { openVideo = video; renderFrame(); }
}

async function saveFrameNow(atPlayhead = false) {
  $("logCard").open = true;
  const tab = await flowTab();
  if (!tab) return log("Open Google Flow in a tab first.", "error");
  const status = await send(tab, { type: "ping" });
  if (status?.running) return log("Another job is running in the Flow tab; stop it first.", "error");
  if (!status?.video) return log("Open a video in Flow first (its player and timeline showing).", "error");
  await chrome.storage.local.set({
    fsdJob: {
      kind: "endframe", status: "running", step: "save", atPlayhead, videoUrl: status.video.url,
      projectUrl: status.url.replace(/\/(collection|edit)\/.*$/, ""),
    },
  });
  frameBusy = atPlayhead ? "here" : "end";
  renderFrame();
  log(`Saving the end frame of "${status.video.title}"${atPlayhead ? " at the playhead" : ""}…`);
  await send(tab, { type: "start" });
}

async function stop() {
  const tab = await flowTab();
  const { fsdJob } = await chrome.storage.local.get("fsdJob");
  if (fsdJob) await chrome.storage.local.set({ fsdJob: { ...fsdJob, status: "stopped" } });
  if (tab) await send(tab, { type: "stop" }).catch(() => {});
  await chrome.runtime.sendMessage({ type: "disarm" });
  log("Stop requested.", "warn");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "log") log(msg.text, msg.level);
  if (msg?.type === "job-ended" && frameBusy) { frameBusy = false; renderFrame(); }
});

$("drop").onclick = () => $("file").click();
$("file").onchange = (e) => e.target.files[0] && loadFile(e.target.files[0]);
$("drop").ondragover = (e) => { e.preventDefault(); $("drop").classList.add("over"); };
$("drop").ondragleave = () => $("drop").classList.remove("over");
$("drop").ondrop = (e) => { e.preventDefault(); $("drop").classList.remove("over"); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); };
$("clear").onclick = clearPlan;
$("create").onclick = () => start("create");
$("download").onclick = () => start("download");
$("stop").onclick = stop;
$("frameNow").onclick = () => saveFrameNow(false);
$("frameHere").onclick = () => saveFrameNow(true);
for (const id of ["start", "folder", "skip", "takes", "title"]) $(id).onchange = save;
setInterval(pollOpenVideo, 1500);
pollOpenVideo();

(async () => {
  render();
  const { fsdPanel } = await chrome.storage.local.get("fsdPanel");
  if (fsdPanel?.plan) {
    plan = fsdPanel.plan;
    $("folder").value = fsdPanel.folder ?? "";
    $("skip").checked = fsdPanel.skip ?? true;
    $("takes").checked = fsdPanel.takes ?? false;
    render();
    $("start").value = fsdPanel.start ?? 0;
  }
})();
