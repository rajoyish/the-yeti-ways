# Backup: table-based storyboards (2026-10-31)

Snapshot of the storyboard pipeline as it was when every video had a markdown storyboard table
(`Film position:`, `Stage:`, `Characters:`, and a `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`
table) above its `Agent prompt:`. The live skills were then changed to write the Agent prompts only.

Contents:

- `skills/storyboard-30s/`, `skills/storyboard-60s/`: the table-writing storyboard skills.
- `skills/create-3x2-timed-image/`, `skills/reel-carousel/`, `skills/flow-character-builder/`: the skills that read those tables, as they were.
- `rules/`: `cinematic-direction.md`, `google-flow.md`, `prompt-assembly.md`, `character-consistency.md` as they were.
- `prompts/babu-yeti-moonlit-herb-rescue-30s-storyboard.md`: the moonlit storyboard with its tables.

To revert, from the repo root:

```sh
B=.agents/backups/2026-10-31-table-storyboards
for s in storyboard-30s storyboard-60s create-3x2-timed-image reel-carousel flow-character-builder; do rm -rf ".agents/skills/$s" && cp -R "$B/skills/$s" ".agents/skills/$s"; done
cp "$B"/rules/*.md .agents/rules/
cp "$B/prompts/babu-yeti-moonlit-herb-rescue-30s-storyboard.md" prompts/   # optional: the table version of the film
sh .agents/link-agents.sh
```

This folder is outside `.agents/skills/`, so `link-agents.sh` never links these copies as live skills.
