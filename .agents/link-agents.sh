#!/bin/sh
# Links every rule and skill in .agents/ into .claude/ (Claude Code) and aliases .agent -> .agents (Antigravity).
# Run from anywhere after adding a rule or a skill: sh .agents/link-agents.sh
set -e
cd "$(dirname "$0")/.."
mkdir -p .claude/rules .claude/skills
for f in .agents/rules/*.md; do
  name=$(basename "$f")
  # The alternate character rules are manual-only; Claude would load them on every turn.
  [ "$name" = "character-consistency-alt.md" ] && continue
  rm -f ".claude/rules/$name"
  ln -s "../../.agents/rules/$name" ".claude/rules/$name"
done
for d in .agents/skills/*/; do
  name=$(basename "$d")
  [ -f "$d/SKILL.md" ] || continue
  rm -f ".claude/skills/$name"
  ln -s "../../.agents/skills/$name" ".claude/skills/$name"
done
[ -e .agent ] || ln -s .agents .agent
# Drop links whose target is gone.
for l in .claude/rules/* .claude/skills/*; do
  [ -L "$l" ] && [ ! -e "$l" ] && rm -f "$l" && echo "removed stale $l"
done
echo "Linked: $(ls .claude/rules | wc -l | tr -d ' ') rules, $(ls .claude/skills | wc -l | tr -d ' ') skills"
