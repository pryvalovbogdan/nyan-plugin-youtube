import { ACTIONS, CUSTOM_CAT_SENTINEL, STORAGE_KEYS } from './consts.js';

chrome.runtime.onMessage.addListener(request => {
  if (request.action === ACTIONS.OPEN_POPUP) {
    chrome.action.openPopup();
  }
});

function notifyYouTubeTabs(message, sendResponse) {
  chrome.tabs.query({ url: ['*://*.youtube.com/*', '*://music.youtube.com/*'] }, tabs => {
    tabs.forEach(tab => {
      if (!tab.id) return;

      chrome.tabs.sendMessage(tab.id, message, () => {
        if (chrome.runtime.lastError) {
        }
      });
    });
    sendResponse({ ok: true });
  });
}

chrome.runtime.onMessageExternal.addListener((request, _sender, sendResponse) => {
  if (request.action === ACTIONS.GET_STATE) {
    chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], syncData => {
      chrome.storage.local.get([STORAGE_KEYS.CUSTOM_USER_CAT, STORAGE_KEYS.CUSTOM_CAT_STYLES], localData => {
        sendResponse({
          selectedCat: syncData[STORAGE_KEYS.SELECTED_CAT] ?? null,
          customUserCat: localData[STORAGE_KEYS.CUSTOM_USER_CAT] ?? null,
          customCatStyles: localData[STORAGE_KEYS.CUSTOM_CAT_STYLES] ?? null,
        });
      });
    });

    return true;
  }

  if (request.action === ACTIONS.UPDATE_CUSTOM_CAT_STYLES && request.styles) {
    chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_CAT_STYLES]: request.styles }, () => {
      notifyYouTubeTabs({ action: ACTIONS.UPDATE_CUSTOM_CAT_STYLES, styles: request.styles }, sendResponse);
    });

    return true;
  }

  if (request.action === ACTIONS.SELECT_CAT && request.src) {
    const isCustom = request.src === CUSTOM_CAT_SENTINEL;

    chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: request.src }, () => {
      notifyYouTubeTabs({ action: ACTIONS.CHANGE_CAT_IMAGE, src: request.src, isCustom }, sendResponse);
    });

    return true;
  }

  if (request.action !== ACTIONS.UPLOAD_CUSTOM_CAT || !request.base64) {
    sendResponse({ ok: false });

    return;
  }

  chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_USER_CAT]: request.base64 }, () => {
    chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: CUSTOM_CAT_SENTINEL }, () => {
      notifyYouTubeTabs({ action: ACTIONS.CHANGE_CAT_IMAGE, src: CUSTOM_CAT_SENTINEL, isCustom: true }, sendResponse);
    });
  });

  return true;
});
