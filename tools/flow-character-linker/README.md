# Flow Character Linker

A Chrome extension that turns plain `@Name` text in the Google Flow prompt box into linked Character chips, the same as picking each one by hand from the `@` picker.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder (`tools/flow-character-linker`).
3. Reload any open Flow tab.

After you change a file here, click the reload arrow on the extension's card in `chrome://extensions`, then reload the Flow tab. Until you do, the tab keeps running the old copy.

## Use

Paste an Agent prompt into the Flow prompt box, then do one of these:

- click the **@ Link** pill just above the prompt box,
- press **Alt+Shift+L**,
- click the extension's toolbar icon.

Each `@Nuri Bear`, `@Babu Yeti`, `@Pip Penguin`, ... becomes a chip, and Flow attaches the Character. A toast then lists what was linked and any `@Name` that matched no saved Character. Unmatched names keep their `@` as plain text.

## How it works

Flow's prompt box is a ProseMirror editor. A linked Character is a `mention` node (`id`, `entityId`, `referenceType: "entity"`, `title`), and pasting chip HTML loses `entityId` and `referenceType`. So the extension drives Flow's own picker for each `@Name`:

1. It retypes the `@`, which opens the picker.
2. It switches the picker to **Characters**.
3. It activates the longest Character title that the text after the `@` starts with, then clicks **Add to prompt**.
4. It deletes the leftover typed name and fixes the spacing.

The script never holds on to the editor element, because Flow rebuilds the prompt box when the first Character thumbnail appears. On a freshly loaded page it also waits for the picker's dropdown and the Characters list to load before it picks anything.

Each name takes about a second, and a name with no Character about three. Debug lines go to the DevTools console at the Verbose level, prefixed `[Flow Character Linker]`.

Only an `@` at the start of the text or after a space or an opening bracket or quote counts, so an address like `a@b.com` stays as it is.

If Flow changes its picker markup, update the selectors in `content.js`: `flow-add-menu-popover-content`, `mat-select[aria-label="Select project"]`, `button.asset-item`, `.asset-title`, `button.asset-item-active`, `button.detail-add-to-prompt-btn`, and `.mention-chip`.
