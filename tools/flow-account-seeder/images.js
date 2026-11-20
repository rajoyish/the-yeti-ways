// Shared original-image handling. Never resize or re-encode exported pixels.
globalThis.FasImages = (() => {
  function originalUrl(src) {
    const url = new URL(src);
    if (url.protocol !== "https:") throw new Error("The image needs a secure source URL.");
    // Work on the path only: signed query parameters must survive unchanged.
    const suffix = /=(?:[swh]\d+)(?:-[a-z0-9]+)*$/i;
    if (suffix.test(url.pathname)) url.pathname = url.pathname.replace(suffix, "=s0");
    else if (/\/asb\/[^/]+$/.test(url.pathname)) url.pathname += "=s0";
    else if (/(^|\.)googleusercontent\.com$/.test(url.hostname)) {
      url.pathname = url.pathname.replace(/\/(?:[swh]\d+)(?:-[a-z0-9]+)*\//i, "/s0/");
    }
    return url.href;
  }

  async function grab(src, { minLongEdge = 0 } = {}) {
    const url = originalUrl(src);
    const response = await fetch(url, { credentials: "include", signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Flow refused the original image (${response.status}). Try opening the Character again.`);
    const blob = await response.blob();
    if (!blob.size) throw new Error("Flow returned an empty original image.");
    let bitmap;
    try { bitmap = await createImageBitmap(blob); }
    catch { throw new Error("Flow did not return a readable image. Refresh the Flow tab and try again."); }
    const { width, height } = bitmap;
    bitmap.close();
    if (Math.max(width, height) < minLongEdge) {
      throw new Error(`Flow returned only ${width} × ${height} pixels. Export stopped to avoid saving a thumbnail. Replace the Character's source with a higher-resolution image and try again.`);
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { type: blob.type, size: blob.size, width, height, dataUrl };
  }

  return { originalUrl, grab };
})();
