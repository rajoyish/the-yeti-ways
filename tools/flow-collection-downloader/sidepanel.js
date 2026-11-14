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

function render() {
  $("planBox").hidden = !plan;
  $("create").disabled = $("download").disabled = $("start").disabled = !plan;
  $("needPlan").hidden = !!plan;
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
    fsdPanel: { plan, start: $("start").value, folder: $("folder").value, skip: $("skip").checked, takes: $("takes").checked },
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
  const tab = await flowTab();
  if (!tab) return log("Open Google Flow in a tab first.", "error");
  plan.title = $("title").value.trim() || plan.title;
  await save();
  const status = await send(tab, { type: "ping" });
  if (kind === "download" && !status?.inProject) return log("Open the Flow project (not the home page) first.", "error");
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
});

$("drop").onclick = () => $("file").click();
$("file").onchange = (e) => e.target.files[0] && loadFile(e.target.files[0]);
$("drop").ondragover = (e) => { e.preventDefault(); $("drop").classList.add("over"); };
$("drop").ondragleave = () => $("drop").classList.remove("over");
$("drop").ondrop = (e) => { e.preventDefault(); $("drop").classList.remove("over"); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); };
$("create").onclick = () => start("create");
$("download").onclick = () => start("download");
$("stop").onclick = stop;
for (const id of ["start", "folder", "skip", "takes", "title"]) $(id).onchange = save;

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
