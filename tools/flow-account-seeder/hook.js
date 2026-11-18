// Runs in the page's own world (manifest "world": "MAIN") on Google Flow.
//
// Every Flow upload button ("Upload media", a Character slot's upload) makes an
// <input type=file> and calls .click() on it, which opens the system file
// chooser. The seeder cannot pick a file in that chooser, so the content script
// first "arms" the files it wants to upload; the next file-input click then
// receives those files and fires "change" instead of opening the chooser.
(function () {
  "use strict";
  if (window.__flowSeederHook) return;
  window.__flowSeederHook = true;

  let armed = null; // { nonce, files: File[], at }
  const ARM_TTL = 20000;

  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.fas !== "arm") return;
    armed = e.data.files ? { nonce: e.data.nonce, files: e.data.files, at: Date.now() } : null;
  });

  function feed(input) {
    if (!armed || Date.now() - armed.at > ARM_TTL || input.type !== "file") return false;
    const { nonce, files } = armed;
    armed = null;
    const dt = new DataTransfer();
    for (const f of input.multiple ? files : files.slice(0, 1)) dt.items.add(f);
    input.files = dt.files;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    window.postMessage({ fas: "fed", nonce, count: dt.files.length, accept: input.accept }, location.origin);
    return true;
  }

  const click = HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () {
    if (feed(this)) return undefined;
    return click.call(this);
  };
  const showPicker = HTMLInputElement.prototype.showPicker;
  if (showPicker) {
    HTMLInputElement.prototype.showPicker = function () {
      if (feed(this)) return undefined;
      return showPicker.call(this);
    };
  }
})();
