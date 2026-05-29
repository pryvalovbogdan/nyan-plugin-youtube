import { STORAGE_KEYS } from '../consts.js';
import { customCatStyles, sendCustomStylesUpdate, updateCustomControlDisplay } from './helpers.js';
import { PopupModule } from './PopupModule.js';

export class CustomCatControlsModule extends PopupModule {
  init() {
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
