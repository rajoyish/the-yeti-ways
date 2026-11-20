import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("./images.js", import.meta.url), "utf8");
function setup(overrides = {}) {
  const requests = [];
  const context = vm.createContext({
    URL, AbortSignal,
    fetch: async (...args) => {
      requests.push(args);
      return { ok: true, blob: async () => ({ size: 12345, type: "image/png" }) };
    },
    createImageBitmap: async () => ({ width: 1376, height: 768, close() {} }),
    FileReader: class {
      readAsDataURL() { this.result = "data:image/png;base64,original-bytes"; this.onload(); }
    },
    ...overrides,
  });
  vm.runInContext(source, context);
  return { images: context.FasImages, requests };
}

test("original URLs preserve signed query strings and remove thumbnail transforms", () => {
  const { images } = setup();
  for (const suffix of ["s64-c", "s512-rw", "w512-h512-p-k-no", "s0"]) {
    assert.equal(images.originalUrl(`https://flow.google.com/asb/id=${suffix}?token=a%3Db&size=512`),
      "https://flow.google.com/asb/id=s0?token=a%3Db&size=512");
  }
});

test("unsized Flow assets request the original; Google path transforms are supported", () => {
  const { images } = setup();
  assert.equal(images.originalUrl("https://flow.google.com/asb/id"), "https://flow.google.com/asb/id=s0");
  assert.equal(images.originalUrl("https://lh3.googleusercontent.com/a/s512-c/photo.png"),
    "https://lh3.googleusercontent.com/a/s0/photo.png");
});

test("unrecognized image paths and query values are left intact", () => {
  const { images } = setup();
  const url = "https://example.com/original.png?signature=abc=size512";
  assert.equal(images.originalUrl(url), url);
  assert.throws(() => images.originalUrl("http://example.com/image"), /secure source/);
});

test("original bytes, MIME, dimensions and credentials survive export", async () => {
  const { images, requests } = setup();
  const image = await images.grab("https://flow.google.com/asb/id=s64-c", { minLongEdge: 513 });
  assert.equal(image.dataUrl, "data:image/png;base64,original-bytes");
  assert.equal(image.width, 1376);
  assert.equal(image.height, 768);
  assert.equal(image.type, "image/png");
  assert.equal(image.size, 12345);
  assert.equal(requests[0][0], "https://flow.google.com/asb/id=s0");
  assert.equal(requests[0][1].credentials, "include");
  assert.ok(requests[0][1].signal instanceof AbortSignal);
});

test("thumbnail-sized responses are rejected and decoded resources are closed", async () => {
  let closed = false;
  const { images } = setup({
    createImageBitmap: async () => ({ width: 512, height: 512, close() { closed = true; } }),
  });
  await assert.rejects(images.grab("https://flow.google.com/asb/id=s64", { minLongEdge: 513 }), /512 × 512.*thumbnail/);
  assert.equal(closed, true);
});

test("HTTP failures never fall back to the thumbnail", async () => {
  let attempts = 0;
  const { images } = setup({ fetch: async () => { attempts++; return { ok: false, status: 403 }; } });
  await assert.rejects(images.grab("https://flow.google.com/asb/id=s64"), /403/);
  assert.equal(attempts, 1);
});

test("empty and non-image responses fail before they reach the ZIP", async () => {
  const empty = setup({ fetch: async () => ({ ok: true, blob: async () => ({ size: 0 }) }) });
  await assert.rejects(empty.images.grab("https://flow.google.com/asb/id"), /empty/);
  const html = setup({ createImageBitmap: async () => { throw new Error("Invalid image"); } });
  await assert.rejects(html.images.grab("https://flow.google.com/asb/id"), /readable image/);
});
