# Shared project skills

Maintain each skill once under `.agents/skills/<name>/SKILL.md`, together with its scripts and references. Paths inside the project skills are relative to the repository root unless explicitly described as relative to the skill. All project skills use standard YAML `name` and `description` frontmatter.

| Assistant | Project discovery path | How to invoke |
| --- | --- | --- |
| Codex | `.agents/skills/` | `$storyboard-30s`, `$storyboard-60s`, or the skill name in a request |
| Claude Code | `.claude/skills/`, with each folder linked to `.agents/skills/` | `/storyboard-30s`, `/storyboard-60s`, or the skill name in a request |
| Antigravity | `.agents/skills/`; `.agent -> .agents` also supports the legacy path | `/storyboard-30s`, `/storyboard-60s`, or the skill name in a request |

The same arrangement covers every skill, including its supporting files. Do not create separate copies or Codex-only `.codex/skills` duplicates. Retired skills remain discoverable so their redirect instructions still work. Archived backups are not active skills.

After adding a skill or rule, run from the repository root:

```sh
rtk proxy sh .agents/link-agents.sh
rtk proxy sh .agents/link-agents.sh --check
```

The linker is idempotent, checks every canonical skill, preserves real files/directories on conflicts, and removes only stale links it manages. `--check` is read-only. It excludes `character-consistency-alt.md` from Claude's automatic rules; the alternate is used only when explicitly requested. If a client has cached its catalog, reload its skills or start a new session.

All three assistants can read and write the prompt files. Media generation, video observation, and helper execution still depend on the current session's tools and installed runtimes (Node.js, and PowerShell for the grid composer). A saved Flow Character is available in Flow, not automatically in another image generator. Finish the portable prompt work and report unavailable capabilities honestly; do not claim that a prompt is a generated image or that a video was observed without a video-capable tool.

The storyboard skills append horizontal 16:9 and vertical 9:16 cover prompts using [the shared cover guide](skills/storyboard-30s/references/cover-images.md). Each cover has a `Cast:` line with one `@` tag per visible character, followed by full character locks and plain-name scene descriptions. Covers are separate from the clip prompts. Generation happens when requested, with an image capability available in that assistant.

Discovery locations checked against the official [Codex documentation](https://learn.chatgpt.com/docs/build-skills), [Claude Code documentation](https://code.claude.com/docs/en/skills), and [Antigravity documentation](https://antigravity.google/docs/skills) on 2026-11-07.
