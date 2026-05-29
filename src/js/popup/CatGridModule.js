import { CUSTOM_CAT_SENTINEL, PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS, catsData } from '../consts.js';
import { handleCatSelection } from './helpers.js';
import { PopupModule } from './PopupModule.js';

export class CatGridModule extends PopupModule {
  static render() {
    const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);

    if (!gridContainer) return;

    chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], syncResult => {
      chrome.storage.local.get([STORAGE_KEYS.CUSTOM_USER_CAT], localResult => {
        const activeSelection = syncResult[STORAGE_KEYS.SELECTED_CAT];

        if (localResult[STORAGE_KEYS.CUSTOM_USER_CAT]) {
          const userCatImg = document.createElement('img');

          userCatImg.src = localResult[STORAGE_KEYS.CUSTOM_USER_CAT];
          userCatImg.className = `${PLUGIN_CLASSES.CAT_GRID_ITEM} custom-user-tile`;
          userCatImg.alt = 'Custom uploaded cat theme';

          if (activeSelection === CUSTOM_CAT_SENTINEL) {
            userCatImg.classList.add('selected');
          }

          userCatImg.addEventListener('click', () => {
            document
              .querySelectorAll(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}`)
              .forEach(el => el.classList.remove('selected'));
            userCatImg.classList.add('selected');
            handleCatSelection(localResult[STORAGE_KEYS.CUSTOM_USER_CAT], true);
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
            document
              .querySelectorAll(`.${PLUGIN_CLASSES.CAT_GRID_ITEM}`)
              .forEach(el => el.classList.remove('selected'));
            catImg.classList.add('selected');
            handleCatSelection(cat.src, false);
          });

          gridContainer.appendChild(catImg);
        });
      });
    });
  }

  init() {
    CatGridModule.render();
  }
}
