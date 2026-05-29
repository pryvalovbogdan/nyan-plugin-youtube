import { ACTIONS, CUSTOM_CAT_SENTINEL, PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS, catsData } from './consts.js';
import { LANGUAGE_NAMES, detectBrowserLanguage, getTranslation } from './i18n.js';

let customCatStyles = { height: 28, top: -13 };

function applyTranslations(lang) {
  const t = getTranslation(lang);

  const title = document.getElementById('popupTitle');
  const supportBtn = document.getElementById('supportBtn');

  if (title) title.textContent = t.title;

  if (supportBtn) supportBtn.textContent = t.support;
}

async function handleCatSelection(imgSrc, isCustomBase64 = false) {
  const syncKey = isCustomBase64 ? CUSTOM_CAT_SENTINEL : imgSrc;

  await chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: syncKey });
  const matchingTabs = await chrome.tabs.query({
    url: ['*://*.youtube.com/*', '*://music.youtube.com/*'],
  });

  if (!matchingTabs || matchingTabs.length === 0) return;

  matchingTabs.forEach(tab => {
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
}

function renderCatGrid() {
  const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);

  if (!gridContainer) {
    return;
  }

  chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], syncResult => {
    chrome.storage.local.get(['customUserCat'], localResult => {
      const activeSelection = syncResult[STORAGE_KEYS.SELECTED_CAT];

      if (localResult.customUserCat) {
        const userCatImg = document.createElement('img');

        userCatImg.src = localResult.customUserCat; // Direct raw target integration
        userCatImg.className = `${PLUGIN_CLASSES.CAT_GRID_ITEM} custom-user-tile`;
        userCatImg.alt = 'Custom uploaded cat theme';

        if (activeSelection === CUSTOM_CAT_SENTINEL) {
          userCatImg.classList.add('selected');
        }

        userCatImg.addEventListener('click', () => {
          document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}`).forEach(el => el.classList.remove('selected'));
          userCatImg.classList.add('selected');
          handleCatSelection(localResult.customUserCat, true);
        });

        gridContainer.appendChild(userCatImg);
      }

      Object.values(catsData).forEach(cat => {
        const catImg = document.createElement('img');

        catImg.src = `./assets/${cat.src}`;
        catImg.className = PLUGIN_CLASSES.CAT_GRID_ITEM;

        if (activeSelection === cat.src) {
          catImg.classList.add('selected');
        }

        catImg.addEventListener('click', () => {
          document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}`).forEach(el => el.classList.remove('selected'));
          catImg.classList.add('selected');
          handleCatSelection(cat.src, false);
        });

        gridContainer.appendChild(catImg);
      });
    });
  });
}

function updateCustomControlDisplay() {
  const heightEl = document.getElementById('heightValue');
  const topEl = document.getElementById('topValue');

  if (heightEl) heightEl.textContent = customCatStyles.height;

  if (topEl) topEl.textContent = customCatStyles.top;
}

function sendCustomStylesUpdate() {
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

function initCustomCatControls() {
  const controls = document.getElementById('customCatControls');

  if (!controls) return;

  document.getElementById('heightUp').addEventListener('click', () => {
    customCatStyles.height += 1;
    updateCustomControlDisplay();
    sendCustomStylesUpdate();
  });

  document.getElementById('heightDown').addEventListener('click', () => {
    customCatStyles.height = Math.max(1, customCatStyles.height - 1);
    updateCustomControlDisplay();
    sendCustomStylesUpdate();
  });

  document.getElementById('topUp').addEventListener('click', () => {
    customCatStyles.top += 1;
    updateCustomControlDisplay();
    sendCustomStylesUpdate();
  });

  document.getElementById('topDown').addEventListener('click', () => {
    customCatStyles.top -= 1;
    updateCustomControlDisplay();
    sendCustomStylesUpdate();
  });

  chrome.storage.local.get(['customUserCat', STORAGE_KEYS.CUSTOM_CAT_STYLES], result => {
    if (!result.customUserCat) return;

    if (result[STORAGE_KEYS.CUSTOM_CAT_STYLES]) {
      customCatStyles = result[STORAGE_KEYS.CUSTOM_CAT_STYLES];
    }

    updateCustomControlDisplay();
    controls.style.display = 'flex';
  });
}

function initGifUploader() {
  const uploaderInput = document.getElementById('gifUploader');

  if (!uploaderInput) return;

  uploaderInput.addEventListener('change', event => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async e => {
      const base64DataUrl = e.target.result;

      chrome.storage.local.set({ customUserCat: base64DataUrl }, () => {
        const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);
        const uploadCard = gridContainer.firstElementChild;

        gridContainer.innerHTML = '';
        gridContainer.appendChild(uploadCard);

        renderCatGrid();
        handleCatSelection(base64DataUrl, true);

        const controls = document.getElementById('customCatControls');

        if (controls) controls.style.display = 'flex';

        updateCustomControlDisplay();
      });
    };

    reader.readAsDataURL(file);
  });
}

function setTheme(isLight) {
  const themeCheckbox = document.getElementById(POPUP_IDS.THEME_CHECKBOX);

  document.body.classList.toggle(PLUGIN_CLASSES.LIGHT_THEME, isLight);

  if (themeCheckbox) themeCheckbox.checked = isLight;
}

function initTheme() {
  const themeCheckbox = document.getElementById(POPUP_IDS.THEME_CHECKBOX);

  chrome.storage.sync.get([STORAGE_KEYS.THEME], result => {
    if (result[STORAGE_KEYS.THEME]) {
      setTheme(result[STORAGE_KEYS.THEME] === 'light');
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: light)').matches);
    }
  });

  themeCheckbox.addEventListener('change', e => {
    const isLight = e.target.checked;

    setTheme(isLight);
    chrome.storage.sync.set({ [STORAGE_KEYS.THEME]: isLight ? 'light' : 'dark' });
  });
}

function buildLanguageSelect(savedLang) {
  const container = document.querySelector('.lang-select-container');
  const trigger = document.getElementById('langDropdownTrigger');
  const menu = document.getElementById('langDropdownMenu');

  if (!container || !trigger || !menu) {
    return;
  }

  menu.innerHTML = '';

  Object.entries(LANGUAGE_NAMES).forEach(([code, name]) => {
    const option = document.createElement('div');

    option.className = 'lang-dropdown-option';
    option.textContent = name;
    option.dataset.value = code;

    if (code === savedLang) {
      option.classList.add('active');
      trigger.textContent = name;
    }

    option.addEventListener('click', () => {
      const selectedLang = option.dataset.value;

      document.querySelectorAll('.lang-dropdown-option').forEach(el => el.classList.remove('active'));
      option.classList.add('active');
      trigger.textContent = name;

      applyTranslations(selectedLang);
      chrome.storage.sync.set({ [STORAGE_KEYS.LANGUAGE]: selectedLang });

      container.classList.remove('open');
    });

    menu.appendChild(option);
  });

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    container.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    container.classList.remove('open');
  });
}

function initLanguage() {
  chrome.storage.sync.get([STORAGE_KEYS.LANGUAGE], result => {
    const lang = result[STORAGE_KEYS.LANGUAGE] || detectBrowserLanguage();

    buildLanguageSelect(lang);
    applyTranslations(lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatGrid();
  initTheme();
  initLanguage();
  initGifUploader();
  initCustomCatControls();
});
