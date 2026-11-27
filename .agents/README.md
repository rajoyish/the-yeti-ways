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

All three assistants can read and write the prompt files. Media generation, video observation, and helper execution still depend on the current session's tools and installed runtimes (Node.js, PowerShell for the grid composer, and ffmpeg/ffprobe for the audio helpers of `flow-music-score`, `lyric-subtitles`, and the AI Studio tools).

`flow-music-score` writes `music-prompts/<film>-flow-music.md` for the Flow Music Score Runner Chrome extension (`tools/flow-music-score-runner/`), which generates the film's instrumental music and sound effects in Google Flow Music and builds one WAV exactly as long as the voice track. The guide's format is the extension's input; check it with `node .agents/skills/flow-music-score/scripts/check_score_guide.mjs`. A saved Flow Character is available in Flow, not automatically in another image generator. Finish the portable prompt work and report unavailable capabilities honestly; do not claim that a prompt is a generated image or that a video was observed without a video-capable tool.

`youtube-shorts` cuts a 9:16 YouTube Short (30 or 60 seconds) from a finished film and a Shorts script. Its `short.json` holds the beats, headlines and shots; `scripts/short.mjs` writes the speech blocks for the AI Studio Voice Runner (`tools/ai-studio-voice-runner/`), an optional one-movement guide for the Flow Music Score Runner, and builds the Short with ffmpeg, whisper.cpp and a Remotion project made by `npx create-video`. Runs live beside the film (`<film folder>/shorts/<slug>/`), never in git.

`flow-characters` builds a storyboard's story cast as saved Characters in Google Flow without the Flow Account Seeder's side panel: `scripts/make-runner.mjs` runs `seed.mjs build` and copies the extension's own Character-building code out of its `content.js` into an in-page runner, `scripts/serve-runner.mjs` serves it to the Flow tab, and the agent's browser tool runs it in the **Characters** project (portrait, body, name, Character info, and the Voice cast's Flow voice for each).

`flow-agent-setup` sets up a film's Flow project for the Agent in the user's Flow tab: it renames the uploaded plates to their storyboard names, adds the storyboard's three instruction cards as Memory cards in Agent settings (with Instruction 2's reference plate), and applies the house Agent settings (Confirm before generating Never, Nano Banana 2.1 and Omni 1.2 Flash defaults in the film's aspect ratio) and View settings, with the Flow Account Seeder's own code through `tools/flow-account-seeder/extract.mjs`.

`record-story` records a story's speech-blocks file in Google AI Studio without the side panel: `scripts/plan.mjs` writes an in-page runner that the agent's browser tool runs in the AI Studio tab (one speech block per run, the Voice Runner's own steps), `scripts/finish.mjs` joins the takes into `Downloads/speech-takes/<slug>/story-full.wav` and `story-manifest.json` with the extension's `stitch.js`, and `scripts/verify.mjs` checks every word with whisper.cpp and `ggml-medium.en` (`scripts/setup-whisper.sh` installs the model). Any agent with a browser tool that can click and run page JavaScript can use it.

The storyboard skills append horizontal 16:9 and vertical 9:16 cover prompts using [the shared cover guide](skills/storyboard-30s/references/cover-images.md). Each cover has a `Cast:` line with one `@` tag per visible character, followed by full character locks and plain-name scene descriptions. Covers are separate from the clip prompts. Generation happens when requested, with an image capability available in that assistant.

The same four storyboard skills (`storyboard-30s`, `storyboard-60s`, `nursery-rhyme-storyboard`, `story-to-storyboard`) add pick-up shots on request using [the shared pick-up guide](skills/storyboard-30s/references/pickup-shots.md). A pick-up is a short clip ordered during the edit to fix continuity, capture a missing reaction, or bridge two scenes. It is written as `## Pick-up <n> - <Title>` after the last video, never enters the end-frame chain, and is checked with `node .agents/skills/storyboard-30s/check_pickups.mjs <file>`.

Discovery locations checked against the official [Codex documentation](https://learn.chatgpt.com/docs/build-skills), [Claude Code documentation](https://code.claude.com/docs/en/skills), and [Antigravity documentation](https://antigravity.google/docs/skills) on 2026-11-07.
