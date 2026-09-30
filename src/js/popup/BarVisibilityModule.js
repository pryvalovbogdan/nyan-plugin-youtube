import { POPUP_IDS, STORAGE_KEYS } from '../consts.js';
import { PopupModule } from './PopupModule.js';

// Open YouTube tabs pick the change up from chrome.storage.onChanged, so no message is sent.
const CHECKBOXES = {
  [POPUP_IDS.HIDE_RAINBOW_CHECKBOX]: STORAGE_KEYS.HIDE_RAINBOW,
  [POPUP_IDS.HIDE_NIGHT_SKY_CHECKBOX]: STORAGE_KEYS.HIDE_NIGHT_SKY,
};

export class BarVisibilityModule extends PopupModule {
  init() {
    chrome.storage.sync.get(Object.values(CHECKBOXES), result => {
      Object.entries(CHECKBOXES).forEach(([id, key]) => {
        const checkbox = document.getElementById(id);

        if (checkbox) checkbox.checked = Boolean(result[key]);
      });
    });

    Object.entries(CHECKBOXES).forEach(([id, key]) => {
      document.getElementById(id)?.addEventListener('change', e => {
        chrome.storage.sync.set({ [key]: e.target.checked });
      });
    });
  }
}
