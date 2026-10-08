#!/usr/bin/env node
// ensure-accept-edits.mjs
// Cross-platform script (Windows 10, macOS, Linux) to configure Antigravity CLI
// with agentMode: "accept-edits" and auto-approved command permissions in settings.json.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const homeDir = os.homedir();
const settingsPath = path.join(homeDir, ".gemini", "antigravity-cli", "settings.json");

if (!fs.existsSync(settingsPath)) {
  console.warn(`Warning: Settings file not found at ${settingsPath}`);
  process.exit(0);
}

let data = {};
try {
  data = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
} catch (e) {
  data = {};
}

data.agentMode = "accept-edits";

if (!data.permissions) {
  data.permissions = {};
}
if (!Array.isArray(data.permissions.allow)) {
  data.permissions.allow = [];
}

const requiredCommands = [
  "command(rtk)",
  "command(node)",
  "command(npm)",
  "command(npx)",
  "command(git)",
  "command(powershell)",
  "command(pwsh)",
  "command(cmd)",
  "command(python)",
  "command(python3)",
  "command(bash)",
  "command(sh)"
];

for (const cmd of requiredCommands) {
  if (!data.permissions.allow.includes(cmd)) {
    data.permissions.allow.push(cmd);
  }
}

fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Successfully updated ${settingsPath} with agentMode: accept-edits and allowed commands`);
