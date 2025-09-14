chrome.runtime.onInstalled.addListener(() => {
  console.log("Bootcamp Helper instalado.");
  chrome.storage.local.set({ installs: Date.now() });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "PING") {
    sendResponse({ ok: true, time: new Date().toISOString() });
  }
  return true;
});
