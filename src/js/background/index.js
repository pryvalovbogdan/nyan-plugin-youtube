import { ACTIONS, debugLog } from '../consts.js';
import Messages from './services/Messages.js';
import { reloadYouTubeTabs } from './services/YouTubeTabs.js';

chrome.runtime.onInstalled.addListener(() => {
  reloadYouTubeTabs();

  chrome.runtime.setUninstallURL('https://nyan-progressbar.com/en/contact/uninstall', () => {
    if (chrome.runtime.lastError) {
      console.error('Error setting uninstall URL:', chrome.runtime.lastError.message);
    } else {
      console.log('Uninstall URL successfully set to: https://nyan-progressbar.com/en/contact/uninstall');
    }
  });
});
chrome.runtime.onMessage.addListener(request => {
  if (request.action === ACTIONS.OPEN_POPUP) {
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  const handler = Messages[request.action];

  if (typeof handler === 'function') {
    return handler(request, sender, sendResponse);
  }

  debugLog('No handler for external action:', request.action);

  return false;
});
