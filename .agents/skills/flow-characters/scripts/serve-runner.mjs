#!/usr/bin/env node
// flow-characters: serve the runner to the Flow tab, so the agent loads it with one short browser call
// instead of pasting 27 KB of code.
//
//   node .agents/skills/flow-characters/scripts/serve-runner.mjs <runner.js> [--port 8765]
//
// Serves the file at http://127.0.0.1:<port>/runner.js with CORS (Chrome lets an https page fetch from
// 127.0.0.1). Run it in the background and stop it when the run is done. Flow's page enforces Trusted Types,
// so the runner is evaluated through a policy of its own (the load snippet in SKILL.md).
import http from "node:http";
import fs from "node:fs";

const argv = process.argv.slice(2);
const file = argv.find(a => a.endsWith(".js"));
const i = argv.indexOf("--port");
const port = i >= 0 ? Number(argv[i + 1]) : 8765;
if (!file || !fs.existsSync(file)) { console.error("Usage: serve-runner.mjs <runner.js> [--port 8765]"); process.exit(2); }
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Private-Network": "true", "Cache-Control": "no-store" });
  res.end(fs.readFileSync(file));
}).listen(port, "127.0.0.1", () => console.log(`Serving ${file} at http://127.0.0.1:${port}/runner.js`));
