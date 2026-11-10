#!/usr/bin/env node
// Generate one image with the provider the user chose: ChatGPT (OpenAI GPT Image)
// or Google AI (Gemini image models such as Nano Banana Pro).
//
// Usage (from the repository root):
//   node .agents/skills/create-flow-assets/scripts/generate_image.mjs \
//     --provider openai|google --prompt-file <file.txt> --out <image.png> \
//     --aspect 1:1|9:16|16:9 [--ref <image>]... [--model <id>] [--force]
//
// --ref     attach a reference image (repeatable). The turnaround attaches the
//           approved front; a fix-up edit attaches the image being fixed.
// --model   overrides the default model id. Defaults can also be set with
//           OPENAI_IMAGE_MODEL or GOOGLE_IMAGE_MODEL.
// --force   overwrite an existing --out file. Without it the script refuses.
//
// Keys come from the environment only and are never printed:
//   openai: OPENAI_API_KEY        google: GEMINI_API_KEY or GOOGLE_API_KEY
//
// Prints one JSON line: { ok, path, mime, width, height, provider, model } or { ok:false, error }.

import fs from "node:fs";
import path from "node:path";

function arg(name, multi = false) {
  const out = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) if (argv[i] === `--${name}`) out.push(argv[i + 1]);
  return multi ? out : out[0];
}
const fail = (error) => {
  console.log(JSON.stringify({ ok: false, error }));
  process.exit(1);
};

const provider = arg("provider");
const promptFile = arg("prompt-file");
let outPath = arg("out");
const aspect = arg("aspect") ?? "1:1";
const refs = arg("ref", true);
const force = process.argv.includes("--force");

if (!["openai", "google"].includes(provider)) fail("--provider must be openai or google");
if (!promptFile || !fs.existsSync(promptFile)) fail("--prompt-file is missing or does not exist");
if (!outPath) fail("--out is required");
if (!["1:1", "9:16", "16:9"].includes(aspect)) fail("--aspect must be 1:1, 9:16, or 16:9");
for (const r of refs) if (!fs.existsSync(r)) fail(`reference image not found: ${r}`);
if (fs.existsSync(outPath) && !force) fail(`${outPath} already exists; pass --force only if the user agreed to replace it`);

const prompt = fs.readFileSync(promptFile, "utf8").trim();
const mimeOf = (f) => ({ ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" })[path.extname(f).toLowerCase()] ?? "image/png";

function dimensions(buf) {
  if (buf.slice(1, 4).toString() === "PNG") return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") {
    const chunk = buf.slice(12, 16).toString();
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  return { width: null, height: null };
}

async function openai() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) fail("OPENAI_API_KEY is not set in this shell");
  const model = arg("model") ?? process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
  // GPT Image sizes: square, portrait 2:3, landscape 3:2. 9:16 and 16:9 map to the nearest.
  const size = { "1:1": "1024x1024", "9:16": "1024x1536", "16:9": "1536x1024" }[aspect];
  let res;
  if (refs.length === 0) {
    res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, size, n: 1, quality: "high" }),
    });
  } else {
    const form = new FormData();
    form.append("model", model);
    form.append("prompt", prompt);
    form.append("size", size);
    form.append("quality", "high");
    for (const r of refs) form.append("image[]", new Blob([fs.readFileSync(r)], { type: mimeOf(r) }), path.basename(r));
    res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`OpenAI ${res.status}: ${json.error?.message ?? "request failed"}`);
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) fail("OpenAI returned no image data");
  return { model, mime: "image/png", buf: Buffer.from(b64, "base64") };
}

async function google() {
  const key = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!key) fail("GEMINI_API_KEY (or GOOGLE_API_KEY) is not set in this shell");
  const model = arg("model") ?? process.env.GOOGLE_IMAGE_MODEL ?? "gemini-3-pro-image-preview";
  const parts = [{ text: prompt }];
  for (const r of refs) parts.push({ inline_data: { mime_type: mimeOf(r), data: fs.readFileSync(r).toString("base64") } });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: aspect } },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`Google ${res.status}: ${json.error?.message ?? "request failed"}`);
  const cand = json.candidates?.[0];
  const img = cand?.content?.parts?.find((p) => p.inlineData || p.inline_data);
  if (!img) fail(`Google returned no image (finishReason: ${cand?.finishReason ?? json.promptFeedback?.blockReason ?? "unknown"})`);
  const data = img.inlineData ?? img.inline_data;
  return { model, mime: data.mimeType ?? data.mime_type ?? "image/png", buf: Buffer.from(data.data, "base64") };
}

const { model, mime, buf } = provider === "openai" ? await openai() : await google();

// Keep the file extension true to the bytes returned.
const ext = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" }[mime] ?? ".png";
if (path.extname(outPath).toLowerCase() !== ext) {
  outPath = outPath.replace(/\.[^./]+$/, "") + ext;
  if (fs.existsSync(outPath) && !force) fail(`${outPath} already exists; pass --force only if the user agreed to replace it`);
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buf);
console.log(JSON.stringify({ ok: true, path: outPath, mime, ...dimensions(buf), provider, model, refs }));
