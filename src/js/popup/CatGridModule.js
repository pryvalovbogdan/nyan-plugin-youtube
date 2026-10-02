import { CAT_SECTIONS, CUSTOM_CAT_SENTINEL, PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS, catsData } from '../consts.js';
import { detectBrowserLanguage, getTranslation } from '../utils/i18n.js';
import { handleCatSelection } from './helpers.js';
import { PopupModule } from './PopupModule.js';

function selectTile(tile) {
  document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}`).forEach(el => el.classList.remove('selected'));
  tile.classList.add('selected');
}

function createSectionHeader(section, t) {
  const header = document.createElement('div');
  const icon = document.createElement('img');
  const title = document.createElement('span');
  const line = document.createElement('span');

  header.className = 'cat-section-header';

  icon.src = `./assets/${section.icon}`;
  icon.className = 'cat-section-icon';
  icon.alt = '';

  title.className = 'cat-section-title';
  title.dataset.i18n = section.titleKey;
  title.textContent = t[section.titleKey];

  line.className = 'cat-section-line';

  header.append(icon, title, line);

  return header;
}

export class CatGridModule extends PopupModule {
  static render() {
    const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);

    if (!gridContainer) return;

    chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT, STORAGE_KEYS.LANGUAGE], syncResult => {
      chrome.storage.local.get([STORAGE_KEYS.CUSTOM_USER_CAT], localResult => {
        const activeSelection = syncResult[STORAGE_KEYS.SELECTED_CAT];
        const t = getTranslation(syncResult[STORAGE_KEYS.LANGUAGE] || detectBrowserLanguage());
        const sectionGrids = {};

        gridContainer.replaceChildren();

        CAT_SECTIONS.forEach(section => {
          const grid = document.createElement('div');

          grid.className = 'cat-section-grid';
          sectionGrids[section.id] = grid;
          gridContainer.append(createSectionHeader(section, t), grid);
        });

        const firstGrid = sectionGrids[CAT_SECTIONS[0].id];

        if (localResult[STORAGE_KEYS.CUSTOM_USER_CAT]) {
          const userCatImg = document.createElement('img');

          userCatImg.src = localResult[STORAGE_KEYS.CUSTOM_USER_CAT];
          userCatImg.className = `${PLUGIN_CLASSES.CAT_GRID_ITEM} custom-user-tile`;
          userCatImg.alt = 'Custom uploaded cat theme';

          if (activeSelection === CUSTOM_CAT_SENTINEL) {
            userCatImg.classList.add('selected');
          }

          userCatImg.addEventListener('click', () => {
            selectTile(userCatImg);
            handleCatSelection(localResult[STORAGE_KEYS.CUSTOM_USER_CAT], true);
          });

          const customTile = document.createElement('div');
          const customTag = document.createElement('span');

          customTile.className = 'custom-tile-wrap';
          customTag.className = 'custom-tile-tag';
          customTag.dataset.i18n = 'customTag';
          customTag.textContent = t.customTag;

          customTile.append(userCatImg, customTag);
          firstGrid.appendChild(customTile);
        }

        Object.values(catsData).forEach(cat => {
          const catImg = document.createElement('img');

          catImg.src = `./assets/${cat.src}`;
          catImg.className = PLUGIN_CLASSES.CAT_GRID_ITEM;

          if (activeSelection === cat.src) {
            catImg.classList.add('selected');
          }

          catImg.addEventListener('click', () => {
            selectTile(catImg);
            handleCatSelection(cat.src, false);
          });

          (sectionGrids[cat.section] || firstGrid).appendChild(catImg);
        });

        gridContainer.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
      });
    });
  }

  init() {
    CatGridModule.render();
  }
}
