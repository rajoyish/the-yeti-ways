---
name: flow-agent-setup
description: Set up a film's Google Flow project for the Agent on the user's behalf, in their signed-in Flow tab, with browser automation and the Flow Account Seeder extension's own code. Renames the uploaded location plates to their storyboard names (plate-rhododendron-glade.png → Plate - Rhododendron Glade), adds the storyboard's three Agent instruction cards as Memory cards in Agent settings (title, text, reference plate, Use memory on), sets Agent settings (Confirm before generating: Never; Image defaults Nano Banana 2.1 and Video defaults Omni 1.2 Flash, in the film's aspect ratio, 1 output) and the View settings (Grid, S, Sound on hover off, Return silent videos off, Show tile details off, Clear prompt on submit on). Skips anything already in place. Use for "set up the Agent instructions", "set up Flow for the storyboard", "add the instruction cards", "Agent settings", "Memory", "rename the plates", or /flow-agent-setup. Takes a storyboard from prompts/ whose project already exists in Flow (the Flow Storyboard Downloader's Create) with its plates uploaded.
---

# Set up a film's Flow project for the Agent

Pipeline: **storyboard → `make-runner.mjs` (seed build + runner) → `serve-runner.mjs` → load the runner in the film's Flow project → `__fasRun()` → verify.**

`SKILL` = `.agents/skills/flow-agent-setup` (Claude Code reaches it through `.claude/skills/flow-agent-setup`). Run every command from the repository root. It needs Node.js and a browser-automation tool that can open a tab, click, and run JavaScript in the page (Claude in Chrome's `javascript_tool`, Antigravity's browser, or Codex's browser tool).

**What Flow looks like (2026-11-27).** The separate Agent instructions panel is gone. With the **Flow Agent** toggle on in the prompt bar, the gear beside it, **Agent settings**, holds Confirm before generating, Image and Video defaults, and **Memory**: the storyboard's instruction cards live there, each with a title, a reference image, a description, and a "Use memory" switch, saved as they are edited. The top bar's **Settings** is the View settings menu. Section 1 of `.agents/rules/google-flow.md` records the details.

**Why a runner, not the side panel:** browser-automation tools cannot open or click `chrome-extension://` pages. `make-runner.mjs` copies the Flow Account Seeder's own functions (`fillMemories`, `pickMemoryReference`, `applyAgentSettings`, `applyViewSettings`, `renameTile`, and its DOM helpers) out of `tools/flow-account-seeder/content.js` through `tools/flow-account-seeder/extract.mjs`, so the skill and the extension's Import do the same thing and stay in step. The card text, references, and settings come from the seeder's `seed.mjs build`.

## 0. Before starting

- The film's project exists in Flow under the storyboard's title (the Flow Storyboard Downloader's **Create project & collections**, `tools/flow-collection-downloader/`).
- Each location plate is uploaded to that project's main grid, not into a collection, as the repo file (`references/plates/<storyboard-stem>/plate-<location>.png`, made by `/create-flow-assets`); the runner gives it its storyboard name. A plate that is not uploaded is reported, not uploaded: ask the user to drag the file into the project.
- Say what the run will change in the user's Flow project before starting: the plate names, three Memory cards, the Agent settings, and the View settings. It costs no credits.

## 1. Make the runner

```bash
node SKILL/scripts/make-runner.mjs prompts/<film>-storyboard.md [--skip plates,memory,agent,view] [--out <file.js>]
```

It refreshes the seed (`references/flow-seed/<stem>/`) and prints the project name, each plate and the file name it is renamed from, the cards (with Instruction 2's reference plate), the Agent settings in the film's aspect ratio (from the storyboard's `Horizontal 16:9 video` or `Vertical 9:16 video` lines), and the View settings. The settings are the house defaults in `tools/flow-account-seeder/seed.mjs` (`filmSettings`); change them there, not in the runner, when the user wants others. `--skip` leaves a part alone.

## 2. Load it in the film's project

1. Open a new tab in the user's browser (Claude in Chrome: `tabs_context_mcp` with `createIfEmpty`) at `https://flow.google.com/` and open the project named after the film. If Flow asks to sign in, stop and ask the user; never type credentials.
2. Serve the runner in the background: `node .agents/skills/flow-characters/scripts/serve-runner.mjs <runner.js>` (port 8765).
3. Load it with one JavaScript call (Flow enforces Trusted Types):

```js
const t = await (await fetch("http://127.0.0.1:8765/runner.js")).text();
const p = trustedTypes.createPolicy("flow-agent-setup-" + Date.now(), { createScript: s => s });
(0, eval)(p.createScript(t));
```

It returns `flow-agent-setup runner ready: <project>`. If the fetch fails, paste the runner file's text into the JavaScript call instead.

## 3. Run

```js
__fasRun()            // returns at once
await __fasWait(32)   // status, results, and the last log lines; call again while "running"
```

It refuses to run in a project whose name is not the film's (`wrong project`). Then, in order: **plates** (each `plate-<location>.png` renamed to `Plate - <Location>`; one already named is left), **memory** (each card added at the top of Memory with its title and text, its reference plate picked with **Add to memory**, "Use memory" on; a card already there is skipped, one left with only its title is completed), **agent** (Confirm before generating, Image defaults, Video defaults), **view** (the top bar's Settings menu). It stops at the first error (`stopped at <step>`): read `__fasState.errors`, screenshot the tab, fix the cause, and call `__fasRun()` again; finished steps are skipped. The whole run takes under a minute.

## 4. Verify and hand off

Reload the project, open **Agent settings**, and check: three Memory cards, each with its full text (compare with the storyboard's `text` blocks, ignoring whitespace), Instruction 2 with its reference image, every "Use memory" switch on; Confirm before generating on Never; the two defaults lines reading the film's models, aspect ratio, and 1 output. Open the top bar's **Settings** and check the View settings. Stop the server and close the tab you opened.

Report what was renamed, added, skipped, and set, and what still needs the user: the Flow Agent toggle on, the project's Characters linked, and the first video's Agent prompt pasted from the storyboard (with Flow Character Linker run on it).

## Checklist

- [ ] The runner ran in the project named after the storyboard, never another project.
- [ ] Every plate is named exactly as the storyboard's Agent setup prompt names it, and Instruction 2's reference resolves to it.
- [ ] Three Memory cards, word for word as the storyboard, "Use memory" on, no duplicates.
- [ ] Agent settings and View settings match the house settings, in the film's aspect ratio.
- [ ] No browser call awaited longer than about 35 s; no credential typed; the server stopped and the tab closed.
