---
name: flow-characters
description: Build a film's story cast as saved Characters in Google Flow on the user's behalf, by driving their signed-in Flow tab with browser automation and the Flow Account Seeder extension's own code (tools/flow-account-seeder/content.js). For each Character it picks the uploaded front image into Portrait and the turnaround into Body, sets the exact Character name, pastes the Character info, and selects the Flow voice from the storyboard's Voice cast. Checks which images the Flow project already has and which Characters already exist, so nothing is duplicated. Use for "build the characters in Flow", "set up the Characters", "create the Flow Characters", "upload the characters to Flow", "save the characters with their voices", or /flow-characters. Takes a storyboard from prompts/ whose cast already has files in prompts/characters/ and images in references/characters/.
---

# Build Flow Characters

Pipeline: **storyboard → `make-runner.mjs` (seed build + runner) → images in the Flow project → `serve-runner.mjs` → load the runner in the Flow tab → `__fasRun()` → verify.**

`SKILL` = `.agents/skills/flow-characters` (Claude Code reaches it through `.claude/skills/flow-characters`). Run every command from the repository root. It needs Node.js and a browser-automation tool that can open a tab, click, and run JavaScript in the page (Claude in Chrome's `javascript_tool`, Antigravity's browser, or Codex's browser tool).

**Why not the extension's side panel:** the Flow Account Seeder (`tools/flow-account-seeder/`) imports Characters from its side panel, and browser-automation tools cannot open or click `chrome-extension://` pages. The runner is the extension's own code, copied out of its `content.js` by `make-runner.mjs` every time (its DOM helpers, the Characters view, the image picker, the voice picker, `setCharacterName`, `createCharacter`), so it follows the extension when the extension is updated. The Character data comes from the seeder's own `seed.mjs build`, so the names, Character info, and voices are the ones the Import tab would use. When the user would rather click through the panel, give them the seeder README's Import steps instead.

## 0. Before starting

- The storyboard's story cast has files in `prompts/characters/` (`/flow-character-builder <storyboard>`), and each member's front and turnaround images exist in `references/characters/` (`/create-flow-assets <storyboard>`). Papa Yeti, Mama Yeti, and Babu Yeti already exist in Flow and are skipped unless the user asks (`--yetis`).
- The images go in the user's Flow project named **Characters** (the project the seeder and the image picker use). The user may have uploaded them already, as image files named `<kebab-name>-front.png` and `<kebab-name>-turnaround.png`.
- Building a Character in Flow costs no credits, but it changes the user's Flow account: say which Characters will be created before starting.

## 1. Make the runner

```bash
node SKILL/scripts/make-runner.mjs prompts/<film>-storyboard.md [--only "Gombu Tortoise,Meadow Mouse"] [--yetis] [--out <file.js>]
```

It runs `node tools/flow-account-seeder/seed.mjs build <storyboard>` (which refreshes `references/flow-seed/<stem>/`, reads the storyboard's `## Voice cast` "Flow Character voice" column, and enforces `voices.md`: no story character takes a fixed voice, no two share one), then writes the runner and prints each Character with its voice and image names, any missing image, and the local image paths. A member with no Voice cast row (no lines) gets no voice. Read the seed's `## Missing` table it prints; fix a missing image with `/create-flow-assets` before going on, or build that Character without a Body only if the user agrees.

## 2. Open the Characters project

1. Open a new tab in the user's browser (Claude in Chrome: `tabs_context_mcp` with `createIfEmpty`) and go to `https://labs.google/fx/tools/flow`. Flow usually reopens the last project; if it is not the **Characters** project, open that project from the Flow home page. If Flow asks to sign in, stop and ask the user; never type credentials.
2. Start the server in the background: `node SKILL/scripts/serve-runner.mjs <runner.js>` (port 8765; `--port` for another).
3. Load the runner in the Flow tab with one JavaScript call. Flow enforces Trusted Types, so it is evaluated through a policy of its own:

```js
const t = await (await fetch("http://127.0.0.1:8765/runner.js")).text();
const p = trustedTypes.createPolicy("flow-characters-" + Date.now(), { createScript: s => s });
(0, eval)(p.createScript(t));
```

It returns `flow-characters runner ready: <names>`. If the fetch fails, paste the runner file's whole text into the JavaScript call instead (about 27 KB).

## 3. Check what Flow already has

```js
({ images: await __fas.haveImages(__fasJobs.flatMap(j => [j.front, j.turnaround].filter(Boolean))), characters: await __fas.listCharacters() })
```

- **Characters already in the list** are not created again; the run only sets their voice if it differs (the seeder's rule).
- **Images missing** from the project: upload them first. Ask the user to drag the missing files (the paths `make-runner.mjs` printed) onto the Flow project, as they would from Finder, then check again. With a file-upload tool, the runner can do it: `__fas.armUpload()` adds a file input (aria-label "flow-characters upload") whose files are dropped onto the project grid the way the extension's Import uploads them; fill it with the browser tool's file upload (`find` the input, then `file_upload` with the paths, at most 10 MB per call), wait for the tiles to finish, and check again. (Not yet tested end to end on 2026-11-27: if the files do not appear, fall back to asking the user.) Images must keep their file names; a tile renamed in Flow is not found by the picker.

## 4. Build

Start it in its own call, then watch it, each call under the browser tool's script limit (Claude in Chrome times out at 45 s):

```js
__fasRun()            // returns at once; builds every Character in order inside the page
await __fasWait(35)   // the status after at most 35 s: done, errors, and the last log lines
```

For each Character it clicks New character, Add from project, picks `<name>-front.png` into Portrait, sets the name (and checks Flow kept it), pastes the Character info, selects the voice, picks `<name>-turnaround.png` into Body, clicks Done, and confirms the tile appears by name (repairing an "Untitled character"). About 40 to 60 seconds each. Give the user a short progress line between waits. It stops at the first error (`stopped at <name>`): read `__fasState.errors`, screenshot the tab, fix what it shows, and call `__fasRun()` again; it skips the Characters already done.

## 5. Verify and hand off

1. `await __fas.listCharacters()` lists every new Character by its exact name.
2. Stop the server, close the tab you opened.
3. Report: each Character with its Portrait and Body image names and its voice (or none), anything skipped as already present, and anything that failed. Say what the user should check by eye in Flow: the right picture in each slot, the Character info complete, and the voice; and that typing `@<Name>` in a prompt box should resolve it. Then the next step: run Flow Character Linker on each pasted Agent prompt (an unmatched name in its toast is a Character not saved yet).

## Checklist

- [ ] Every Character built has a file in `prompts/characters/` and both images; its name is spelled exactly as the storyboard and the file spell it.
- [ ] Voices come from the seed (the storyboard's Voice cast, checked by `seed.mjs`); no story character has a Yeti's or the Narrator's voice, and no two share one.
- [ ] Existing Characters and images were checked first; nothing was duplicated.
- [ ] No browser call awaited longer than about 35 s; no credential was typed.
- [ ] The server was stopped and the agent's tab closed; the report says what was built, skipped, and still needs the user's eye.
