# Flow Storyboard Downloader

A Chrome extension that sets up a Google Flow project from a storyboard and downloads its finished videos at 1080p, named after the storyboard.

- **Create project & collections.** Reads the storyboard's `# <Title> …s Storyboard` heading and every `## Video N - <Title>` and `## Pick-up N - <Title>` heading. On the Flow home page it clicks **+ New project** and names the project after the film (`Babu Yeti and the Sour Mango Trick`); inside a project it only adds the collections that are missing (`Video 1 - The Mango Tree`, …).
- **Download videos.** Opens each collection in turn from the chosen start, right-clicks its video, picks **Download → 1080p Upscaled**, waits for Flow to upscale and save it (one at a time, as Flow asks), and saves it as `Downloads/<folder>/Video 8 - Another and Another.mp4`. Videos already in Downloads under that name are skipped. With **Download every take** on, extra videos in a collection are saved as `… (take 2).mp4`.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder (`tools/flow-collection-downloader`).
3. Reload any open Flow tab.

After you change a file here, click the reload arrow on the extension's card, then reload the Flow tab.

## Use

1. Click the toolbar icon to open the side panel.
2. Drop the storyboard `.md` from `prompts/` on the panel (or click to choose it). Check the project name and the collection list.
3. **Create:** open the Flow home page (or the project, to add missing collections) and click **Create project & collections**.
4. **Download:** open the project in Flow, choose **Start from** (for example `Video 8 - Another and Another`), set the Downloads subfolder, and click **Download videos**.

The log shows every step. **Stop** ends the job after the current step. A job survives a page reload and resumes.

Chrome may ask, on the first download, whether Flow can download multiple files: allow it. If Chrome is set to "Ask where to save each file", turn that off or the renamed path is only a suggestion.

## How it works

The content script drives Flow's own menus with synthetic pointer and context-menu events, matching on visible text (`New project`, `New collection`, `Download`, `1080p`), so it does not depend on Flow's class names. Before clicking **1080p** it arms the expected name in the service worker; `chrome.downloads.onDeterminingFilename` renames the next video download to it, and the worker tracks the download until it completes. The armed name lives in `chrome.storage.session`, so it survives the worker sleeping during a long upscale.

If Flow changes its UI, update `videoTiles()`, `collectionEl()`, `openNewCollectionMenu()`, and `renameProject()` in `content.js`.
