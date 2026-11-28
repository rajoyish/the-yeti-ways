// Copies functions out of the Flow Account Seeder's content.js into a script an agent can run in the
// Flow tab, for the agent skills (flow-characters, flow-agent-setup) that cannot use the side panel.
//   import { pageCode } from "../../tools/flow-account-seeder/extract.mjs";
//   pageCode(["createCharacter", ...]) -> the DOM helpers plus each named top-level function or const.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Normalise line endings: with core.autocrlf the checkout is CRLF, and the const scanner below ends a
// definition at ";\n", so CRLF made each const run on and copy every function after it.
const src = fs.readFileSync(path.join(HERE, "content.js"), "utf8").replace(/\r\n/g, "\n");

const helpersStart = src.indexOf("const TAG");
const helpersEnd = src.indexOf("// ---------------------------------------------------------------- projects (home page)");
if (helpersStart < 0 || helpersEnd < 0) throw new Error("content.js changed: the DOM helpers section was not found.");
let helpers = src.slice(helpersStart, helpersEnd)
  .replace(/function log\(text, level = "info"\) \{/, 'function log(text, level = "info") { (window.__fasLog = window.__fasLog || []).push((level === "info" ? "" : `[${level}] `) + text);');

// One top-level definition by name, with its body (brace matching that skips strings, templates, and comments).
function grab(name) {
  const re = new RegExp(`^  (?:async function ${name}\\(|function ${name}\\(|const ${name} =)`, "m");
  const m = re.exec(src);
  if (!m) throw new Error(`content.js changed: ${name} was not found.`);
  let i = m.index, depth = 0, started = false, q = null;
  if (/^  const /.test(m[0])) {
    // A const runs to the end of its statement: the first ";" at depth 0 at a line end.
    for (; i < src.length; i++) {
      const ch = src[i];
      if (q) { if (ch === "\\") { i++; continue; } if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'" || ch === "`") { q = ch; continue; }
      if ("([{".includes(ch)) depth++;
      else if (")]}".includes(ch)) depth--;
      else if (ch === ";" && depth === 0 && src[i + 1] === "\n") return src.slice(m.index, i + 1);
    }
  }
  // A function: skip its parameter list, then match its body.
  let p = src.indexOf("(", m.index), pd = 0;
  for (; p < src.length; p++) { if (src[p] === "(") pd++; else if (src[p] === ")" && --pd === 0) break; }
  for (i = p; i < src.length; i++) {
    const ch = src[i];
    if (q) { if (ch === "\\") { i++; continue; } if (ch === q) q = null; continue; }
    if (ch === "/" && src[i + 1] === "/") { i = src.indexOf("\n", i); continue; }
    if (ch === '"' || ch === "'" || ch === "`") { q = ch; continue; }
    if (ch === "/" && /[(,=:!&|?{};\s]/.test(src[i - 1]) && started) {
      // A regex literal: skip to its closing slash.
      for (i++; i < src.length && src[i] !== "/"; i++) { if (src[i] === "\\") i++; else if (src[i] === "[") { while (src[++i] !== "]") if (src[i] === "\\") i++; } }
      continue;
    }
    if (ch === "{") { depth++; started = true; }
    else if (ch === "}" && --depth === 0 && started) return src.slice(m.index, i + 1);
  }
  throw new Error(`Could not read ${name} from content.js.`);
}

export function pageCode(names) {
  return `${helpers}\n${names.map(grab).join("\n\n")}`;
}
