import { ACTIONS, CUSTOM_CAT_SENTINEL, STORAGE_KEYS, YOUTUBE_URL_PATTERNS, catsData, debugLog } from '../consts.js';

export const customCatStyles = { height: 28, top: -13 };
export const catStyleOverrides = {};
export const selectedCatState = { src: 'catty.gif' };

export function getDefaultStylesForCat(catSrc) {
  if (catSrc === CUSTOM_CAT_SENTINEL || !catsData[catSrc]) {
    return { height: 28, top: -13 };
  }

  return {
    height: parseInt(catsData[catSrc].styles.height, 10),
    top: parseInt(catsData[catSrc].styles.top, 10),
  };
}

export function loadStylesForCat(catSrc) {
  const override = catStyleOverrides[catSrc];
  const defaults = getDefaultStylesForCat(catSrc);

  Object.assign(customCatStyles, override ?? defaults);
  updateCustomControlDisplay();
}

export async function handleCatSelection(imgSrc, isCustomBase64 = false) {
  const syncKey = isCustomBase64 ? CUSTOM_CAT_SENTINEL : imgSrc;

  selectedCatState.src = syncKey;
  loadStylesForCat(syncKey);

  await chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: syncKey });

  const [youtubeTabs, websiteTabs] = await Promise.all([
    chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS }),
    chrome.tabs.query({ url: ['https://*.nyan-progressbar.com/*'] }),
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
        if (chrome.runtime.lastError) debugLog(`Tab ${tab.id} busy or not ready yet.`);
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
        if (chrome.runtime.lastError) debugLog(`Tab ${tab.id} busy or not ready yet.`);
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
  const catSrc = selectedCatState.src;

  catStyleOverrides[catSrc] = { height: customCatStyles.height, top: customCatStyles.top };
  chrome.storage.local.set({ [STORAGE_KEYS.CAT_STYLE_OVERRIDES]: catStyleOverrides });

  chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS }, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: ACTIONS.UPDATE_CAT_STYLE, catSrc, styles: catStyleOverrides[catSrc] },
        () => {
          if (chrome.runtime.lastError) debugLog(`Tab ${tab.id} busy or not ready yet.`);
        },
      );
    });
  });
}

export function resetCatStyle(catSrc) {
  delete catStyleOverrides[catSrc];
  chrome.storage.local.set({ [STORAGE_KEYS.CAT_STYLE_OVERRIDES]: catStyleOverrides });

  const defaults = getDefaultStylesForCat(catSrc);

  Object.assign(customCatStyles, defaults);
  updateCustomControlDisplay();

  chrome.tabs.query({ url: YOUTUBE_URL_PATTERNS }, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: ACTIONS.UPDATE_CAT_STYLE, catSrc, styles: null }, () => {
        if (chrome.runtime.lastError) debugLog(`Tab ${tab.id} busy or not ready yet.`);
      });
    });
  });
}
