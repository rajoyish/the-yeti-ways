#!/bin/sh
# Codex and current Antigravity read .agents/skills directly. Claude Code uses
# .claude/skills; .agent is retained for older Antigravity installations.
# Run from anywhere: sh .agents/link-agents.sh [--check]
set -e
cd "$(dirname "$0")/.."
check_only=false
case "${1-}" in
  "") ;;
  --check) check_only=true ;;
  *) echo "Usage: sh .agents/link-agents.sh [--check]" >&2; exit 2 ;;
esac
[ "$#" -le 1 ] || { echo "Too many arguments" >&2; exit 2; }

ensure_link() {
  target=$1
  link=$2
  if [ -L "$link" ] && [ "$(readlink "$link")" = "$target" ] && [ -e "$link" ]; then
    return
  fi
  if [ -e "$link" ] && [ ! -L "$link" ]; then
    echo "Conflict: $link is a real file or directory; left unchanged." >&2
    exit 1
  fi
  if "$check_only"; then
    echo "Missing or incorrect link: $link -> $target" >&2
    exit 1
  fi
  # Only replace a symlink; never remove a user's real file or directory.
  if [ -L "$link" ]; then unlink "$link"; fi
  ln -s "$target" "$link"
}

if ! "$check_only"; then mkdir -p .claude/rules .claude/skills; fi
rules=0
skills=0
for f in .agents/rules/*.md; do
  [ -f "$f" ] || continue
  name=$(basename "$f")
  # The alternate character rules are manual-only; Claude would load them on every turn.
  [ "$name" = "character-consistency-alt.md" ] && continue
  ensure_link "../../.agents/rules/$name" ".claude/rules/$name"
  rules=$((rules + 1))
done
for d in .agents/skills/*/; do
  name=$(basename "$d")
  [ -f "$d/SKILL.md" ] || continue
  ensure_link "../../.agents/skills/$name" ".claude/skills/$name"
  skills=$((skills + 1))
done
ensure_link .agents .agent

# Drop only stale links owned by this script, preserving unrelated links.
for l in .claude/rules/* .claude/skills/*; do
  [ -L "$l" ] || continue
  [ ! -e "$l" ] || continue
  case "$(readlink "$l")" in
    ../../.agents/rules/*|../../.agents/skills/*)
      if "$check_only"; then
        echo "Stale managed link: $l" >&2
        exit 1
      fi
      unlink "$l"
      echo "Removed stale link: $l"
      ;;
  esac
done
[ "$skills" -gt 0 ] || { echo "No skills found" >&2; exit 1; }
echo "OK: $skills shared skills (Codex, Claude Code, Antigravity); $rules linked Claude rules."
