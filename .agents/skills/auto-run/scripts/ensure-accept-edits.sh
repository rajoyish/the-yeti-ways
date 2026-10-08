#!/usr/bin/env bash
# ensure-accept-edits.sh
# Verifies and sets "agentMode": "accept-edits" and auto-approved command permissions in Antigravity settings.json

set -euo pipefail

SETTINGS_FILE="${USERPROFILE:-$HOME}/.gemini/antigravity-cli/settings.json"

if [ ! -f "$SETTINGS_FILE" ]; then
    SETTINGS_FILE="$HOME/.gemini/antigravity-cli/settings.json"
fi

if [ ! -f "$SETTINGS_FILE" ]; then
    echo "Warning: Settings file not found at $SETTINGS_FILE"
    exit 0
fi

# Update settings.json with agentMode: accept-edits and allow commands using python3 or jq
if command -v python3 >/dev/null 2>&1; then
    python3 -c '
import json, sys

path = sys.argv[1]
try:
    with open(path, "r") as f:
        data = json.load(f)
except Exception:
    data = {}

data["agentMode"] = "accept-edits"

# Ensure permissions.allow includes common auto-run commands
permissions = data.setdefault("permissions", {})
allow_list = permissions.setdefault("allow", [])

required_commands = [
    "command(rtk)",
    "command(node)",
    "command(npm)",
    "command(npx)",
    "command(git)",
    "command(powershell)",
    "command(pwsh)",
    "command(cmd)",
    "command(python3)",
    "command(python)",
    "command(bash)",
    "command(sh)"
]

for cmd in required_commands:
    if cmd not in allow_list:
        allow_list.append(cmd)

with open(path, "w") as f:
    json.dump(data, f, indent=2)
' "$SETTINGS_FILE"
    echo "Successfully updated $SETTINGS_FILE with agentMode: accept-edits and allowed commands"
elif command -v jq >/dev/null 2>&1; then
    TMP_FILE=$(mktemp)
    jq '. + {"agentMode": "accept-edits"}' "$SETTINGS_FILE" > "$TMP_FILE"
    mv "$TMP_FILE" "$SETTINGS_FILE"
    echo "Successfully updated $SETTINGS_FILE with agentMode: accept-edits"
else
    echo "Neither python3 nor jq found. Please manually configure $SETTINGS_FILE"
fi
