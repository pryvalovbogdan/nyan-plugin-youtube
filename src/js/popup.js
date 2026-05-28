import { ACTIONS, PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS, catsData } from './consts.js';

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
      console.log('res, ', result, cat.src);

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

document.addEventListener('DOMContentLoaded', () => {
  renderCatGrid();
  initTheme();
});
