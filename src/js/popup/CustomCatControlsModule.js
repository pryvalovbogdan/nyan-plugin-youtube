import { STORAGE_KEYS } from '../consts.js';
import { customCatStyles, sendCustomStylesUpdate, updateCustomControlDisplay } from './helpers.js';
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
      Object.assign(customCatStyles, { height: 28, top: -13 });
      updateCustomControlDisplay();
      sendCustomStylesUpdate();
    });

    chrome.storage.local.get([STORAGE_KEYS.CUSTOM_USER_CAT, STORAGE_KEYS.CUSTOM_CAT_STYLES], result => {
      if (!result[STORAGE_KEYS.CUSTOM_USER_CAT]) return;

      if (result[STORAGE_KEYS.CUSTOM_CAT_STYLES]) {
        Object.assign(customCatStyles, result[STORAGE_KEYS.CUSTOM_CAT_STYLES]);
      }

      updateCustomControlDisplay();
      controls.style.display = 'flex';
    });
  }
}
