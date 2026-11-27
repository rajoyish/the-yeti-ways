# Flow Account Seeder

Moves a film's Flow setup from one Google Flow account to another, for when an account runs out of monthly credits. Flow has no export or import, so the seeder copies the saved Characters and plates out of the old account into the repo, then recreates them in the new account together with the film's three Agent instruction cards.

It works with the [create-flow-assets](../../.agents/skills/create-flow-assets/SKILL.md) workflow: whether an asset was generated with ChatGPT or Gemini through `/create-flow-assets` or made directly in Flow, its local copy lives in `references/characters/` or `references/plates/<storyboard-stem>/`, and the seed is built from those.

```
old account ──Export──▶ ~/Downloads/flow-seed-export/ ──seed.mjs collect──▶ references/
/create-flow-assets (ChatGPT / Gemini) ────────────────────────────────────▶ references/
storyboard ──seed.mjs build──▶ references/flow-seed/<stem>/ ──Import──▶ new account
```

## Keeping two accounts in step

Your local library, `references/characters/`, sits between the two accounts. Each one is compared against it, never against the other account directly:

- **In both:** skipped. Import never makes a duplicate. It matches names regardless of case, spaces, and hyphens (`Old Herb-Gatherer` = `old-herb-gatherer`), and it never uploads an image the `Characters` project already has.
- **In the library but not in this account:** imported.
- **In this account but not in the library** (made directly in Flow): kept. **Check what Flow has** lists them under **New in this account**, and its **Download ZIP** button saves them. Then run `seed.mjs collect`, `seed.mjs build --all`, and Import that folder into the other account.

The panel remembers the library from the last seed folder you picked. On the Export tab, **Scan Characters** then tags each Character "in library" (unticked) or "new" (ticked), so only new ones are exported. Use **Select all** to download existing library Characters again, or **Clear** to start a fresh selection. Download and import buttons are enabled only when items are selected.

## Voices

Every saved Character's Flow voice (its "Select a voice" choice) travels with it:

- **Export** reads the voice from the Character page and puts it in the ZIP's manifest. `collect` keeps it in `references/characters/voices.json`.
- **Import** sets it with **Select a voice**, picking it by name. A Character the account already has is not copied again, but it still gets the seed's voice: set if it has none, replaced (and logged) if it has another.
- **Papa Yeti, Mama Yeti, Babu Yeti** always get their fixed voices (`Iapetus`, `Erinome`, `Puck`, from the "Fixed voices" table in `.agents/skills/ai-studio-tts/references/voices.md`), whatever a seed or export says.
- **Story cast** get the voice their storyboard chooses: `seed.mjs build` reads the `## Voice cast` table's "Flow Character voice" column. When a storyboard only describes a speaker's voice, `build` picks the closest of Flow's 30 voices from that description, the Character's gender and the words in it ("squeaky", "deep", "gentle", …). It marks the result "suggested" and says to write it into the Voice cast to keep it. A Character with no Voice cast row doesn't speak and gets no voice. `build --all` uses the voices exported from Flow.
- `build` enforces the voices.md rules: no story character takes a fixed speaker's voice, and no two speakers share one; it reports any clash instead of setting it.

Only the voice name can be read back from Flow; a "Customize performance" style in the voice picker is not exported.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder (`tools/flow-account-seeder`).
3. Reload any open Flow tab.

After you change a file here, click the reload arrow on the extension's card, then reload the Flow tab.

## 1 · Export (old account)

Everything moves as **one ZIP**: `manifest.json` plus `characters/<name>-front|turnaround.*` and `plates/Plate - ….*`, the same layout as a seed. Keep it, move it, and import it straight into the other account.

1. In the old account, open the side panel. On **Import**, choose your last seed or export ZIP so the panel knows your library (optional).
2. **Characters:** click **Scan Characters** (it works from any Flow page and opens the `Characters` project itself). New ones are ticked. Click **Download ZIP**, which saves `Downloads/flow-seed-export/flow-characters-<date>.zip`.
3. **Plates:** open the film's project, expand **Project plates**, click **Scan plates**, then **Download ZIP**, which saves `flow-plates-<project>-<date>.zip`.
4. Optional, to keep a copy in your library: `node tools/flow-account-seeder/seed.mjs collect` unpacks every ZIP in `Downloads/flow-seed-export/` (or `collect <file.zip>`) into `references/characters/` and `references/plates/<storyboard>/`. It never replaces a different file; it saves a `-v2` copy instead.

Character images are downloaded from their original source without resizing or re-encoding. **Activity** shows each image's dimensions and size; the ZIP manifest also records them under `imageMetadata`. If either image is unreadable or has a longest edge of 512 pixels or less, the export stops with an error instead of saving a low-resolution ZIP. If the original itself is that small, replace its source image in Flow before exporting again. Missing Portrait or Body slots remain missing and are reported in Activity.

The compact panel keeps plates, help and Activity collapsible. Activity opens while a job runs or when an error needs attention.

## 2 · Build the seed

To copy every library Character (for example, ones exported from the new account back to the old one):

```sh
node tools/flow-account-seeder/seed.mjs build --all
```

This writes `references/flow-seed/all-characters.zip` (and the folder beside it), with no plates or cards. For one film:

```sh
node tools/flow-account-seeder/seed.mjs build prompts/<film>-storyboard.md
```

This runs the create-flow-assets inventory on the storyboard and writes `references/flow-seed/<stem>/`, which holds `manifest.json` and copies of:

- the three Yetis (every film needs them). Their info is the exported Flow text if there is one, otherwise the Copy-Ready Character Lock.
- the film's story cast. Their info is the exported text, otherwise the `## Character info` block of their file in `prompts/characters/`.
- the plates, each saved under the name Flow must give it (`Plate - Mango Grove.png`).
- the Agent instruction cards: the storyboard's `### Instruction N - …` titles, their reference plates, and their `text` blocks, copied verbatim.

It ends with a **Missing** table that gives the next step for each item: export it from the old account, or run `/create-flow-assets`. Yetis are never generated. Run `build` again once they exist.

## 3 · Import (new account)

1. Sign in to the new account and open the film's project (create it with Flow Storyboard Downloader if needed). If you are only copying Characters (an `all-characters` seed), any Flow page will do.
2. In the side panel, open **Import**, then drop or choose a **.zip**: an export ZIP from the other account, or a seed ZIP from `seed.mjs build`. The panel unpacks it in memory as it reads it; nothing is extracted to disk. **Choose a folder instead** still takes a seed folder.
3. Click **Check what Flow has**. Items Flow already has are marked "in Flow" and unticked, so running Import again creates nothing twice.
4. Click **Import selected**. It runs in this order:
   1. **Characters:** opens the account's `Characters` project, creating it if it doesn't exist. It uploads each front and turnaround there as `<Name> - Front` and `<Name> - Turnaround`, skipping any already there, including older names like `babu-yeti-front`. Then it builds the Character the way you do by hand: New character → **Add from project** (Portrait) → name and Character info → Body → **Add from project** → Done. A Character this account already has is skipped.
   2. **Plates:** uploads each image through **+ (Add media) → Upload** and renames it to its exact plate name.
   3. **Cards:** opens **Agent settings** (the gear beside the Flow Agent toggle in the prompt bar) and adds each card as a **Memory** with its title, text, and reference plate, "Use memory" on. A card already there is skipped, and one left with its title but not its text is completed. (A Flow build without Agent settings gets the older Agent instructions cards.)
   4. **Settings:** sets Confirm before generating to Never, the Image defaults (Nano Banana 2.1) and Video defaults (Omni 1.2 Flash) to the film's aspect ratio and 1 output, and the top bar's View settings (Grid, S, three switches off, Clear prompt on submit on), from the seed's `settings`.
   A plate already uploaded under its file name (`plate-<location>.png`) is renamed to its storyboard name instead of being uploaded again.
5. Check the result: type `@` in the prompt box and confirm every Character resolves, then run Flow Character Linker on Video 1's Agent prompt. It should list no unmatched names.

**Stop** ends the job after the current step.

## How it works

- **ZIP.** `zip.js` writes ZIPs with stored (uncompressed) entries, since images are already compressed, and reads stored or deflated entries, so a ZIP from macOS `zip` or Finder opens too. Both the side panel and `seed.mjs` use it.
- **Renaming safely.** The image grid recycles its tile elements as it scrolls, so a tile found by position can be a different image a moment later. The seeder renames by the image's own id and types only after the name field shows the expected old name.
- **Full-resolution export.** `images.js` replaces recognized thumbnail transforms with `=s0` (or `/s0/` for Google image paths), preserving signed query parameters. It also requests `=s0` for unsized `/asb/` URLs. The content script fetches with the page's session and a 45-second timeout, decodes the result to verify its dimensions, and passes the original bytes to the ZIP writer. Character exports reject images whose longest edge is 512 pixels or less. It never falls back to downloading a thumbnail or upscales a small source.
- **Uploads without the file chooser.** Project images (Character fronts and turnarounds, plates) are dropped onto the project grid as a synthetic drag and drop, which Flow accepts. Its **+ → Upload** menu opens a file input only on a real, trusted click. Flow names a dropped image after its file (`Pied Goat - Front.png`), so the seeder waits for the upload to finish and renames it to the exact name. For any other upload button, `hook.js` (page world) hands armed files to Flow's `<input type=file>` instead of opening the system file chooser.
- **Saved fields.** A card title only saves when it is committed with Enter and then blurred. Flow re-renders the instructions panel after each edit, so the seeder finds it again before every **Add instruction**. With no Characters yet, Flow's Characters button goes straight to the New character page, and the seeder handles that.

## When Flow changes its UI

Update these selectors in `content.js`:

- Sidebar views: `sideTab("accessibility_new")` (Characters) and `sideTab("image")` (Images), matched on the icon word.
- Characters grid: `img[alt="Character thumbnail"]` and the `New character` aria-label.
- Character page: `input.name-input`, `textarea.personality-textarea`, `button.chip-button` (Portrait and Body), `img.slot-thumbnail`, the `Go back` aria-label, and `slotUploadButton()`.
- Images: `flow-grid-tile-container` and `flow-image-tile`, the `Add media menu` aria-label, the **Upload** menu item, and `renameTile()`.
- Voices: `.voice-selector-empty-btn` ("Select a voice"), the picker `.flow-add-menu-dialog-panel` titled "Select a voice", `button.asset-item`, `button.detail-add-to-prompt-btn` ("Add to character"), `.voice-card-name`, and `button.voice-remove-btn`. Clicking the already-selected voice applies it at once.
- Agent settings (2026-11-27): `button[aria-label="Agent settings"]`, `button[aria-label="Flow Agent"]`, Memory cards `flow-project-brief-card` with `input.card-title`, `textarea.card-description` (`.description-preview` once saved), the "Use memory" switch, `button[class*="add-refer"]`, the "Select reference image" picker's **Add to memory**; Confirm before generating `.mat-button-toggle-button[role="radio"]` (`aria-checked`); defaults pages `label.radio-option` (`.radio-option-selected`) and `[role="radio"]`; View settings switches `button[role="switch"][aria-label="<Name> toggle"]`. `listMemories()`, `fillMemories()`, `applyAgentSettings()`, `applyViewSettings()` in `content.js`; `extract.mjs` copies them into the agent skills' runners.
- Agent instructions (older builds): `.agent-mode-chip`, the `Agent instructions` aria-label, `.agent-panel-content`, `.add-instruction-button`, `input[placeholder="Instruction title"]`, `textarea.description-input`, `button[role="switch"]`, `.reference-button`, and `.done-button`.
- Reference picker (shared with Flow Character Linker): `.flow-add-menu-dialog-panel`, `button.asset-item`, `.asset-title`, and `button.detail-add-to-prompt-btn`.

Test bridge: in the Flow tab's console, `window.postMessage({ fas: "cmd", id: 1, type: "listCharacters" }, "*")` runs a command and posts back `{ fasResult: 1, ok, … }`; `{ fas: "reload" }` reloads the extension itself. Debug lines go to the Flow tab's DevTools console, prefixed `[Flow Account Seeder]`. 

Run the image-export regression checks with `node --test tools/flow-account-seeder/images.test.mjs`. These cover URL transforms and signatures, original bytes and dimensions, thumbnail rejection, and failed or invalid image responses. Live Flow selectors and account permissions still require a signed-in Flow tab to verify.
