// Flow Storyboard Downloader — service worker.
//
// The content script clicks Download > 1080p Upscaled in Flow and "arms" a
// name here first. Upscaling takes minutes and this worker may be asleep by
// the time Flow starts the file, so the armed name lives in storage.session.
// When the next video download appears, it is renamed to
// "<folder>/<Video N - Title>.mp4" and its progress is tracked by id.

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

const S = chrome.storage.session;
const ARM_TTL = 20 * 60 * 1000; // upscaling can take several minutes

// Windows-safe file and folder names.
function safe(name) {
  return name
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/, "");
}

function looksLikeVideo(item) {
  return /^video\//i.test(item.mime || "") || /\.(mp4|webm|mov)$/i.test(item.filename || "") || /\.(mp4|webm|mov)(\?|$)/i.test(item.finalUrl || item.url || "");
}

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  S.get(["armed"]).then(async ({ armed }) => {
    if (!armed || Date.now() - armed.at > ARM_TTL || !looksLikeVideo(item)) {
      suggest();
      return;
    }
    const ext = (item.filename.match(/\.(mp4|webm|mov)$/i) || [".mp4"])[0].toLowerCase();
    const folder = armed.folder ? safe(armed.folder) + "/" : "";
    const filename = folder + safe(armed.name) + ext;
    suggest({ filename, conflictAction: "uniquify" });
    const jobs = (await S.get("jobs")).jobs || {};
    jobs[item.id] = { name: armed.name, key: armed.key, filename, state: "in_progress" };
    await S.set({ jobs, armed: null });
  });
  return true;
});

chrome.downloads.onChanged.addListener(async (delta) => {
  if (!delta.state && !delta.error) return;
  const jobs = (await S.get("jobs")).jobs || {};
  const job = jobs[delta.id];
  if (!job) return;
  if (delta.state?.current) job.state = delta.state.current;
  if (delta.error?.current) job.error = delta.error.current;
  await S.set({ jobs });
});

// Flow's grid → Library drag listens to trusted pointer events only, so press,
// move in small steps, and release with the DevTools protocol. Chrome shows a
// "started debugging this browser" bar while attached, which can push the page
// down, so the positions are measured in the page *after* attaching, from the
// elements the content script marked with data-fsd-drag="src" and "dst".
async function realDrag(tabId) {
  const target = { tabId };
  await chrome.debugger.attach(target, "1.3");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const mouse = (type, { x, y }, extra = {}) =>
    chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", { type, x, y, button: "left", pointerType: "mouse", ...extra });
  const measure = async () => {
    const { result } = await chrome.debugger.sendCommand(target, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const c = (el) => { if (!el) return null; el.scrollIntoView({ block: "center", inline: "nearest" });
          const r = el.getBoundingClientRect(); return r.width && r.height ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; };
        const dst = c(document.querySelector('[data-fsd-drag="dst"]'));
        const src = c(document.querySelector('[data-fsd-drag="src"]'));
        return { src, dst };
      })()`,
    });
    return result?.value || {};
  };
  try {
    await wait(900); // let the debugging bar settle the layout
    const { src: from, dst: to } = await measure();
    if (!from || !to) throw new Error("drag source or target not found on the page");
    await mouse("mouseMoved", from, { button: "none" });
    await wait(150);
    await mouse("mousePressed", from, { buttons: 1, clickCount: 1 });
    await wait(300);
    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const p = { x: from.x + ((to.x - from.x) * i) / steps, y: from.y + ((to.y - from.y) * i) / steps };
      await mouse("mouseMoved", p, { buttons: 1 });
      await wait(25);
    }
    // Hover over the target a moment, wiggling slightly, so the drop zone registers.
    for (const dx of [0, 3, -3, 0]) { await mouse("mouseMoved", { x: to.x + dx, y: to.y }, { buttons: 1 }); await wait(150); }
    await mouse("mouseReleased", to, { buttons: 0, clickCount: 1 });
    await wait(300);
  } finally {
    await chrome.debugger.detach(target).catch(() => {});
  }
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  (async () => {
    switch (msg?.type) {
      case "arm": {
        // msg: {name, folder, key}
        await S.set({ armed: { ...msg, at: Date.now() } });
        return { ok: true };
      }
      case "drag":
        // The content script marked the source and target with data-fsd-drag.
        await realDrag(sender.tab.id);
        return { ok: true };
      case "disarm":
        await S.set({ armed: null });
        return { ok: true };
      case "job-status": {
        // Find the download made for msg.key (the latest one if several).
        const jobs = (await S.get("jobs")).jobs || {};
        const [id, job] = Object.entries(jobs).filter(([, j]) => j.key === msg.key).pop() || [];
        const { armed } = await S.get("armed");
        return { job: job ? { id: Number(id), ...job } : null, armed: !!armed };
      }
      case "already-downloaded": {
        // msg: {names: [...]} → names that already exist as finished downloads on disk.
        const done = [];
        for (const name of msg.names) {
          const base = safe(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const hits = await chrome.downloads.search({
            filenameRegex: `[\\\\/]${base}( \\(\\d+\\))?\\.(mp4|webm|mov)$`,
            state: "complete",
            exists: true,
          });
          if (hits.length) done.push(name);
        }
        return { done };
      }
      default:
        return undefined;
    }
  })().then(reply, (e) => reply({ error: String(e) }));
  return true;
});
