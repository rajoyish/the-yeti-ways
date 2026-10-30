// Toolbar click and Alt+Shift+L both ask the Flow tab to link its @ mentions.
function trigger(tab) {
  if (tab && tab.id) chrome.tabs.sendMessage(tab.id, { type: "link-characters" }).catch(() => {});
}

chrome.action.onClicked.addListener(trigger);

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "link-characters") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  trigger(tab);
});
