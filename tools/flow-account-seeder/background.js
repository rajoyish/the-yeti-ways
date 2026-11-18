// Flow Account Seeder — service worker.
// - Opens the side panel from the toolbar icon.
// - Saves exported files ({ type: "download" }) so the test bridge can export
//   without the side panel.
// - Reloads the extension when the content script's test bridge asks
//   ({ fas: "reload" } in the Flow tab's console).
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

// Another extension that listens to onDeterminingFilename (Flow Storyboard
// Downloader does) makes Chrome drop the filename passed to download() and save
// data: URLs as "download.jpeg". So this extension names its own downloads in
// the same event; Chrome keeps the last-installed extension's suggestion.
const pending = []; // filenames of this extension's downloads, in start order

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if (item.byExtensionId !== chrome.runtime.id || !pending.length) return;
  suggest({ filename: pending.shift(), conflictAction: "overwrite" });
});

function download(url, filename) {
  return new Promise((resolve) => {
    pending.push(filename);
    chrome.downloads.download({ url, filename, conflictAction: "overwrite", saveAs: false }, (id) => {
      if (!id) {
        pending.splice(pending.indexOf(filename), 1);
        return resolve({ ok: false, error: chrome.runtime.lastError?.message || "download refused" });
      }
      const on = (d) => {
        if (d.id !== id || !d.state) return;
        if (d.state.current === "complete" || d.state.current === "interrupted") {
          chrome.downloads.onChanged.removeListener(on);
          chrome.downloads.search({ id }, ([item]) => resolve({ ok: d.state.current === "complete", id, path: item?.filename }));
        }
      };
      chrome.downloads.onChanged.addListener(on);
    });
  });
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg?.type === "reload-extension") chrome.runtime.reload();
  if (msg?.type === "expect-download") {
    pending.push(msg.filename);
    reply({ ok: true });
    return false;
  }
  if (msg?.type === "download") {
    download(msg.url, msg.filename).then(reply);
    return true;
  }
  return false;
});
