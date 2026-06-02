import { ACTIONS, CUSTOM_CAT_SENTINEL, STORAGE_KEYS } from '../consts.js';

export const customCatStyles = { height: 28, top: -13 };

export async function handleCatSelection(imgSrc, isCustomBase64 = false) {
  const syncKey = isCustomBase64 ? CUSTOM_CAT_SENTINEL : imgSrc;

  await chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: syncKey });

  const [youtubeTabs, websiteTabs] = await Promise.all([
    chrome.tabs.query({ url: ['*://*.youtube.com/*', '*://music.youtube.com/*'] }),
    chrome.tabs.query({ url: ['https://nyan-progressbar.com/*', 'http://localhost/*'] }),
  ]);

  youtubeTabs.forEach(tab => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: ACTIONS.CHANGE_CAT_IMAGE,
        src: isCustomBase64 ? CUSTOM_CAT_SENTINEL : imgSrc,
        isCustom: isCustomBase64,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log(`Tab ${tab.id} busy or not ready yet.`);
        }
      },
    );
  });

  websiteTabs.forEach(tab => {
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: ACTIONS.CAT_SELECTED_IN_POPUP,
        src: isCustomBase64 ? CUSTOM_CAT_SENTINEL : imgSrc,
        isCustom: isCustomBase64,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log(`Tab ${tab.id} busy or not ready yet.`);
        }
      },
    );
  });
}

export function updateCustomControlDisplay() {
  const heightEl = document.getElementById('heightValue');
  const topEl = document.getElementById('topValue');
  const heightSlider = document.getElementById('heightSlider');
  const topSlider = document.getElementById('topSlider');

  if (heightEl) {
    heightEl.textContent = customCatStyles.height;
  }

  if (topEl) {
    topEl.textContent = customCatStyles.top;
  }

  if (heightSlider) {
    heightSlider.value = customCatStyles.height;
  }

  if (topSlider) {
    topSlider.value = customCatStyles.top;
  }
}

export function sendCustomStylesUpdate() {
  chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_CAT_STYLES]: customCatStyles });
  chrome.tabs.query({ url: ['*://*.youtube.com/*', '*://music.youtube.com/*'] }, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: ACTIONS.UPDATE_CUSTOM_CAT_STYLES, styles: customCatStyles }, () => {
        if (chrome.runtime.lastError) {
          console.log(`Tab ${tab.id} busy or not ready yet.`);
        }
      });
    });
  });
}
