# Flow Storyboard Downloader

A Chrome extension that sets up a Google Flow project from a storyboard and downloads its finished videos at 1080p, named after the storyboard.

- **Create project & collections.** Reads the storyboard's `# <Title> …s Storyboard` heading and every `## Video N - <Title>` and `## Pick-up N - <Title>` heading, and works only in the project named after the film (`Babu Yeti and the Sour Mango Trick`), from any Flow page. In a project with another name (the **Characters** project, which holds only the Character images, or an older film) it goes to the Flow home page first. There it opens the film's project if one has that name, or clicks **+ New project** and names it. Then it adds the collections that are missing (`Video 1 - The Mango Tree`, …). It refuses to add collections to a project whose name is not the film's.
- **Save the end frame of the open video.** Open a finished video in Flow (the page with the player and timeline) and click **Save end frame**. It moves the playhead to the last frame and clicks **Save frame**, then goes Back, which Flow takes to the video's own collection (`Video 9 - …`). That gives the number: the new `Saved frame from …` image is renamed `End frame V9` and dragged onto `Video 10 - …` in the Library list. It reads everything from Flow, so it needs no storyboard. Skip it for a video whose next video opens on a plate (a scene change).
- **Save the frame at the playhead.** Flow sometimes reorders a clip's shots, so its last frame is not the shot the next video should open on. Pause the player on the clean, held frame you want and click **Save frame at playhead**: it saves that frame instead of the last one, then renames and moves it exactly like **Save end frame**. The next video's `Images:` line in the storyboard says what that frame should look like (`End frame V<N> should look like the held last shot of Video <N>: …`), so you know which frame to pause on.

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
4. **End frame:** after each video is approved, open it in Flow and click **Save end frame** in the **2 · End frame** box. If the clip's last frame is not the right opening (Flow put a shot out of order), pause on the frame you want and click **Save frame at playhead** instead. Chrome shows a "started debugging this browser" bar during the drag; it closes by itself. Don't click **Cancel** on that bar, or the drag fails.

5. **Download:** open the project in Flow, choose **Start from** (for example `Video 8 - Another and Another`), set the Downloads subfolder, and click **Download videos**.

The log shows every step. **Stop**, in the bar at the top of the panel, ends any job (create, end frame, or download) after its current step; it turns red while a job runs. A job survives a page reload and resumes, which is also how Create moves from one Flow page to another; a stopped job never resumes.

Chrome may ask, on the first download, whether Flow can download multiple files: allow it. If Chrome is set to "Ask where to save each file", turn that off or the renamed path is only a suggestion.

## How it works

The content script drives Flow's own menus with synthetic pointer and context-menu events, matching on visible text (`New project`, `New collection`, `Download`, `1080p`), so it does not depend on Flow's class names. Before clicking **1080p** it arms the expected name in the service worker; `chrome.downloads.onDeterminingFilename` renames the next video download to it, and the worker tracks the download until it completes. The armed name lives in `chrome.storage.session`, so it survives the worker sleeping during a long upscale.

Flow's grid-to-Library drag only reacts to trusted pointer input, so the service worker performs it with `chrome.debugger` (`Input.dispatchMouseEvent`), attached only for the drag. To test a move alone, run `window.postMessage({ fsd: "move", name: "End frame V7", to: "Video 8 - Our Bowls Are Nearly Empty" }, "*")` in the Flow tab's console while the source collection is open. For the end-frame steps, see `endFrameJob()`, `saveFrame()`, `renameTile()`, and `moveToCollection()`.

If Flow changes its UI, update `videoTiles()`, `collectionEl()`, `ensureSidebar()`, `createCollection()`, and `renameProject()` in `content.js`. The Library **+** and the collection list exist only while Flow's sidebar is expanded; the extension expands it itself.
