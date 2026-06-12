import { YOUTUBE_URL_PATTERNS, debugLog } from '../../consts.js';

// Tabs without a content script (e.g. discarded) reject sendMessage —
// expected and safely ignored.
const sendToTab = (tabId, message) =>
  chrome.tabs.sendMessage(tabId, message).catch(err => debugLog('sendMessage skipped:', err?.message));

export const notifyYouTubeTabs = async message => {
  const tabs = await chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS });

  await Promise.all(tabs.filter(tab => tab.id).map(tab => sendToTab(tab.id, message)));
};

export const reloadYouTubeTabs = async () => {
  const tabs = await chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS });

  await Promise.all(tabs.filter(tab => tab.id).map(tab => chrome.tabs.reload(tab.id)));
};
