import { ACTIONS, PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS, catsData } from './consts.js';
import { LANGUAGE_NAMES, detectBrowserLanguage, getTranslation } from './i18n.js';

function applyTranslations(lang) {
  const t = getTranslation(lang);

  const title = document.getElementById('popupTitle');
  const supportBtn = document.getElementById('supportBtn');

  if (title) title.textContent = t.title;

  if (supportBtn) supportBtn.textContent = t.support;
}

function renderCatGrid() {
  const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);

  if (!gridContainer) {
    return;
  }

  chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], result => {
    Object.values(catsData).forEach(cat => {
      const catImg = document.createElement('img');

      catImg.src = `./assets/${cat.src}`;
      catImg.className = PLUGIN_CLASSES.CAT_GRID_ITEM;
      catImg.addEventListener('click', () => handleCatSelection(cat.src, catImg));

      if (result[STORAGE_KEYS.SELECTED_CAT] === cat.src) {
        catImg.classList.add('selected');
      }

      gridContainer.appendChild(catImg);
    });
  });
}

async function handleCatSelection(imgSrc, catImg) {
  const previousSelected = document.querySelector(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}.selected`);

  if (previousSelected) {
    previousSelected.classList.remove('selected');
  }

  catImg.classList.add('selected');

  const matchingTabs = await chrome.tabs.query({
    url: ['*://*.youtube.com/*', '*://music.youtube.com/*'],
  });

  if (!matchingTabs || matchingTabs.length === 0) {
    await chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: imgSrc });

    return;
  }

  matchingTabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: ACTIONS.CHANGE_CAT_IMAGE, src: imgSrc }, () => {
      if (chrome.runtime.lastError) {
        console.log(`Tab ${tab.id} busy or not ready yet.`);
      }
    });
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
});
