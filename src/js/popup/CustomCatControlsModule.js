import { STORAGE_KEYS } from '../consts.js';
import {
  catStyleOverrides,
  customCatStyles,
  loadStylesForCat,
  resetCatStyle,
  selectedCatState,
  sendCustomStylesUpdate,
  updateCustomControlDisplay,
} from './helpers.js';
import { PopupModule } from './PopupModule.js';

export class CustomCatControlsModule extends PopupModule {
  init() {
    const controls = document.getElementById('customCatControls');

    if (!controls) return;

    document.getElementById('heightSlider').addEventListener('input', e => {
      customCatStyles.height = parseInt(e.target.value, 10);
      updateCustomControlDisplay();
      sendCustomStylesUpdate();
    });

    document.getElementById('topSlider').addEventListener('input', e => {
      customCatStyles.top = parseInt(e.target.value, 10);
      updateCustomControlDisplay();
      sendCustomStylesUpdate();
    });

    document.getElementById('resetPositionBtn').addEventListener('click', () => {
      resetCatStyle(selectedCatState.src);
    });

    chrome.storage.local.get([STORAGE_KEYS.CAT_STYLE_OVERRIDES], localResult => {
      if (localResult[STORAGE_KEYS.CAT_STYLE_OVERRIDES]) {
        Object.assign(catStyleOverrides, localResult[STORAGE_KEYS.CAT_STYLE_OVERRIDES]);
      }

      chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], syncResult => {
        const saved = syncResult[STORAGE_KEYS.SELECTED_CAT] || 'catty.gif';

        selectedCatState.src = saved;
        loadStylesForCat(saved);
        controls.style.display = 'flex';
      });
    });
  }
}
