// Flow Character Linker
//
// Google Flow's prompt box is a ProseMirror editor. A linked Character is a
// `mention` node ({id, entityId, referenceType: "entity", title}) rendered as
// <span class="mention-chip">. Pasting chip HTML loses entityId and
// referenceType, so this script drives Flow's own "@" asset picker instead:
// for every plain "@Name" it retypes the "@", picks the matching Character in
// the picker, presses "Add to prompt", then removes the leftover name text.

(() => {
  if (window.__flowCharacterLinker) return;
  window.__flowCharacterLinker = true;

  const LOG = "[Flow Character Linker]";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const debug = (...args) => console.debug(LOG, ...args);

  async function waitFor(fn, timeout = 4000, step = 80) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const v = fn();
      if (v) return v;
      await sleep(step);
    }
    return null;
  }

  function getEditor() {
    const all = [...document.querySelectorAll('.ProseMirror[contenteditable="true"]')];
    return all.find((e) => e.contains(document.activeElement)) || all.find((e) => e.offsetParent) || all[0] || null;
  }

  const popover = () => document.querySelector("flow-add-menu-popover-content");

  // "@" at the start of the text or after whitespace/opening punctuation, followed by a letter.
  const AT_RE = /(^|[\s(\[{"'“‘])@(?=\p{L})/gu;

  // Text nodes outside existing chips, in document order.
  function textNodes(editor) {
    const out = [];
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest(".mention-chip") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) out.push(n);
    return out;
  }

  // Character offset across those text nodes, and back; survives re-rendering.
  function offsetOf(editor, node, index) {
    let total = 0;
    for (const n of textNodes(editor)) {
      if (n === node) return total + index;
      total += n.data.length;
    }
    return -1;
  }

  function positionAt(editor, offset) {
    let total = 0;
    for (const n of textNodes(editor)) {
      if (offset <= total + n.data.length) return { node: n, index: offset - total };
      total += n.data.length;
    }
    return null;
  }

  // Plain-text "@" occurrences outside existing chips, in document order.
  function findAts(editor) {
    const out = [];
    for (const n of textNodes(editor)) {
      AT_RE.lastIndex = 0;
      let m;
      while ((m = AT_RE.exec(n.data))) out.push({ node: n, index: m.index + m[1].length });
    }
    return out;
  }

  // Put both the DOM and ProseMirror selection on [start, end) of a text node.
  async function selectText(node, start, end) {
    const r = document.createRange();
    r.setStart(node, start);
    r.setEnd(node, end);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    document.dispatchEvent(new Event("selectionchange"));
    await sleep(60);
  }

  function setInputValue(input, value) {
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function closePicker() {
    const p = popover();
    if (!p) return;
    const target = p.querySelector("input") || p;
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, bubbles: true }));
    const backdrop = document.querySelector(".cdk-overlay-backdrop-showing");
    if (popover() && backdrop) backdrop.click();
  }

  // Switch the picker's top-left dropdown and side nav to "Characters".
  async function showCharacters(p) {
    const listKey = () => assetItems(p).map((it) => it.title).join("|");

    // Each switch first shows the old list, then an empty one while the new one
    // loads (over the network on first use). Switching again mid-load leaves
    // the list empty, so wait for the change and then for the new items.
    const settle = async (before) => {
      await waitFor(() => listKey() !== before, 3000);
      await waitFor(() => assetItems(p).length, 8000);
      await sleep(200);
    };

    // On a fresh page the dropdown renders about a second after the picker opens.
    const select = await waitFor(() => p.querySelector('mat-select[aria-label="Select project"]'), 5000);
    if (!select) throw new Error("The picker's project dropdown did not appear");
    if (select.textContent.trim() !== "Characters") {
      select.querySelector(".mat-mdc-select-trigger")?.click();
      const opt = await waitFor(() =>
        [...document.querySelectorAll("mat-option")].find((o) => o.textContent.trim() === "Characters")
      );
      if (!opt) throw new Error("Characters option not found in the picker dropdown");
      const before = listKey();
      opt.click();
      await settle(before);
    } else {
      await waitFor(() => assetItems(p).length, 8000);
    }

    const tab = [...p.querySelectorAll('mat-list-item[role="tab"]')].find((t) => t.textContent.trim().endsWith("Characters"));
    if (tab && tab.getAttribute("aria-selected") !== "true") {
      const before = listKey();
      tab.click();
      await settle(before);
    }
  }

  const assetItems = (p) =>
    [...p.querySelectorAll("button.asset-item")].map((b) => ({
      button: b,
      title: (b.querySelector(".asset-title")?.textContent || "").trim(),
    }));

  // Flow rebuilds the prompt box when the first Character thumbnail appears, so
  // never hold on to an editor element across a picker round trip.
  const chipCount = (title) =>
    [...(getEditor()?.querySelectorAll(".mention-chip") || [])].filter((c) => c.textContent.trim() === title).length;

  const activeTitle = (p) => (p.querySelector("button.asset-item-active .asset-title")?.textContent || "").trim();

  // Clicking an item only makes it active; the list can re-render and reset the
  // active item, so click until the wanted one stays active.
  async function activate(p, title) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const item = assetItems(p).find((it) => it.title === title);
      if (!item) return false;
      if (activeTitle(p) !== title) item.button.click();
      if (await waitFor(() => activeTitle(p) === title, 1000)) {
        await sleep(250);
        if (activeTitle(p) === title) return true;
      }
    }
    return false;
  }

  // Escape removes the "@" that opened the picker; paste it back (a paste does
  // not reopen the picker).
  async function restoreAt(offset) {
    const editor = getEditor();
    const pos = editor && positionAt(editor, offset);
    if (!pos || pos.node.data.charAt(pos.index) === "@") return;
    await selectText(pos.node, pos.index, pos.index);
    const data = new DataTransfer();
    data.setData("text/plain", "@");
    editor.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
    await sleep(120);
  }

  // Longest Character title that the text after "@" starts with, as whole words.
  function matchTitle(items, after) {
    const lower = after.toLowerCase();
    return items
      .filter((it) => it.title && lower.startsWith(it.title.toLowerCase()))
      .filter((it) => !/[\p{L}\p{N}_]/u.test(after.charAt(it.title.length)))
      .sort((a, b) => b.title.length - a.title.length)[0];
  }

  // Link the "@" at `at`. Returns the linked title, or null if no Character matched.
  async function linkOne(editor, at) {
    const after = at.node.data.slice(at.index + 1);
    const firstWord = after.match(/^[\p{L}\p{N}_'’-]+/u)?.[0] || "";
    const offset = offsetOf(editor, at.node, at.index);

    // Retyping the "@" fires Flow's mention trigger and opens the picker at that spot.
    editor.focus();
    await selectText(at.node, at.index, at.index + 1);
    document.execCommand("insertText", false, "@");
    const p = await waitFor(popover);
    if (!p) throw new Error("Flow's @ picker did not open");

    await showCharacters(p);

    // The picker keeps the last search between openings; start from a clean list.
    const search = p.querySelector("input.search-input, input[placeholder='Search assets']");
    if (search && search.value) setInputValue(search, "");

    let item = await waitFor(() => matchTitle(assetItems(p), after), 1000);
    debug("list", assetItems(p).map((it) => it.title), "→", item?.title);

    // A long list is virtualised; search for names that are not rendered.
    if (!item && search && firstWord) {
      setInputValue(search, firstWord);
      item = await waitFor(() => matchTitle(assetItems(p), after), 2000);
      debug("search", firstWord, assetItems(p).map((it) => it.title), "→", item?.title);
    }

    if (!item || !(await activate(p, item.title))) {
      debug("no match for", JSON.stringify(after.slice(0, 30)));
      if (search && search.value) setInputValue(search, "");
      closePicker();
      await waitFor(() => !popover(), 1500);
      await restoreAt(offset);
      return null;
    }

    const chipsBefore = chipCount(item.title);
    const add = await waitFor(() => {
      const b = p.querySelector("button.detail-add-to-prompt-btn") ||
        [...p.querySelectorAll("button")].find((x) => /add to prompt/i.test(x.textContent));
      return b && !b.disabled ? b : null;
    });
    if (!add) throw new Error(`"Add to prompt" button not found for ${item.title}`);
    if (activeTitle(p) !== item.title) throw new Error(`Picker switched away from ${item.title}`);
    add.click();
    if (!(await waitFor(() => !popover()))) throw new Error("Picker did not close after Add to prompt");

    if (!(await waitFor(() => chipCount(item.title) > chipsBefore, 6000))) {
      throw new Error(`Flow did not insert a chip for ${item.title}`);
    }
    await removeLeftover(item.title);
    return item.title;
  }

  // Flow inserts the chip, usually plus a space, where the "@" was, so the typed
  // name still follows it: "<chip> Babu Yeti and". Remove the name and keep one
  // space before a word, none before punctuation. Flow re-renders the prompt
  // while it attaches the Character, so find the chip afresh on every try.
  async function removeLeftover(title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^([ \\u00a0]*)${escaped}(?![\\p{L}\\p{N}_])`, "iu");
    const leftover = () => {
      for (const chip of getEditor()?.querySelectorAll(".mention-chip") || []) {
        const n = chip.nextSibling;
        if (chip.textContent.trim() === title && n && n.nodeType === Node.TEXT_NODE && re.test(n.data)) return n;
      }
      return null;
    };
    for (let attempt = 0; attempt < 4; attempt++) {
      const t = await waitFor(leftover, attempt ? 600 : 1500);
      if (!t) return;
      const lead = t.data.match(re)[1].length;
      const nameEnd = lead + title.length;
      const next = t.data.charAt(nameEnd);
      let start = lead ? 1 : 0;
      let end = nameEnd;
      if (lead && /[  ]/.test(next)) end += 1; // "<chip> and"
      else if (lead && (next === "" || /[.,;:!?)\]}"'”’…]/.test(next))) start = 0; // "<chip>, and"
      getEditor()?.focus();
      await selectText(t, start, end);
      document.execCommand("delete");
      if (await waitFor(() => !leftover(), 600)) return;
      debug("leftover still there after", title, "attempt", attempt + 1);
    }
    throw new Error(`Could not remove the typed name after ${title}`);
  }

  let running = false;

  async function run() {
    if (running) return;
    if (!getEditor()) return toast("No Flow prompt box found on this page.");
    running = true;
    setButtonBusy(true);
    const linked = [];
    const missed = [];
    try {
      let skip = 0;
      for (let guard = 0; guard < 200; guard++) {
        const editor = getEditor();
        const ats = editor ? findAts(editor) : [];
        if (skip >= ats.length) break;
        const at = ats[skip];
        const word = at.node.data.slice(at.index, at.index + 30).split(/[\s,.;:!?]/)[0];
        const title = await linkOne(editor, at);
        if (title) linked.push(title);
        else {
          missed.push(word);
          skip++;
        }
        await sleep(150);
      }
      const parts = [];
      parts.push(linked.length ? `Linked ${linked.length}: ${linked.join(", ")}` : "Nothing to link");
      if (missed.length) parts.push(`No Character for: ${missed.join(", ")}`);
      toast(parts.join(" · "));
      console.info(LOG, { linked, missed });
    } catch (err) {
      console.error(LOG, err);
      closePicker();
      toast(`Stopped: ${err.message}`);
    } finally {
      running = false;
      setButtonBusy(false);
    }
  }

  // --- UI: a small button beside the prompt box, plus toasts ---------------

  let button;

  function ensureButton() {
    const editor = getEditor();
    if (!editor) {
      button?.remove();
      button = null;
      return;
    }
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.textContent = "@ Link";
      button.title = "Link @ Characters in this prompt (Alt+Shift+L)";
      Object.assign(button.style, {
        position: "fixed",
        zIndex: 2147483000,
        padding: "4px 10px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,.25)",
        background: "#2b2b2b",
        color: "#fff",
        font: "500 12px/1.4 system-ui, sans-serif",
        cursor: "pointer",
      });
      // mousedown would blur the editor; keep focus where it is.
      button.addEventListener("mousedown", (e) => e.preventDefault());
      button.addEventListener("click", run);
      document.body.appendChild(button);
    }
    const box = (editor.closest("flow-rich-text-editor") || editor).getBoundingClientRect();
    button.style.left = `${Math.round(box.right - 64)}px`;
    button.style.top = `${Math.round(box.top - 30)}px`;
  }

  function setButtonBusy(busy) {
    if (!button) return;
    button.disabled = busy;
    button.textContent = busy ? "Linking…" : "@ Link";
  }

  function toast(text) {
    const el = document.createElement("div");
    el.textContent = text;
    Object.assign(el.style, {
      position: "fixed",
      left: "50%",
      bottom: "24px",
      transform: "translateX(-50%)",
      zIndex: 2147483001,
      padding: "8px 14px",
      borderRadius: "8px",
      background: "#1f1f1f",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.2)",
      font: "13px/1.4 system-ui, sans-serif",
      maxWidth: "80vw",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  setInterval(ensureButton, 700);

  if (window.chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg?.type === "link-characters") run();
    });
  }

  window.__flowCharacterLinkerRun = run;
})();
