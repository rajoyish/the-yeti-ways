// Runs in the page's own world (manifest "world": "MAIN") on flowmusic.app.
//
// Flow Music downloads a song by fetching it with its own signed request,
// wrapping it in a blob: URL and clicking a hidden <a download>. A plain fetch
// of the download URL is refused (403), so the runner lets the site do its
// own download and catches the file here instead of letting it hit the disk.
//
// The isolated content script arms a capture by writing a one-time nonce to
// <html data-fmr-capture>. The next .wav download is posted back to it with
// that nonce and the browser download is skipped.
(function () {
  'use strict';
  if (window.__fmrHook) return;
  window.__fmrHook = true;

  const click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    const root = document.documentElement;
    const nonce = root.dataset.fmrCapture;
    const href = this.href || '';
    const name = this.download || '';
    if (nonce && href.startsWith('blob:') && /\.wav$/i.test(name)) {
      delete root.dataset.fmrCapture;
      fetch(href)
        .then((r) => r.arrayBuffer())
        .then((buf) => window.postMessage({ fmr: 'wav', nonce, name, buf }, location.origin, [buf]))
        .catch((e) => window.postMessage({ fmr: 'wav', nonce, name, error: String(e) }, location.origin));
      return undefined;
    }
    return click.call(this);
  };
})();
