import { PLUGIN_CLASSES, POPUP_IDS, STORAGE_KEYS } from '../consts.js';
import { PopupModule } from './PopupModule.js';

export class ThemeModule extends PopupModule {
  #setTheme(isLight) {
    const themeCheckbox = document.getElementById(POPUP_IDS.THEME_CHECKBOX);

    document.body.classList.toggle(PLUGIN_CLASSES.LIGHT_THEME, isLight);

    if (themeCheckbox) themeCheckbox.checked = isLight;
  }

  init() {
    const themeCheckbox = document.getElementById(POPUP_IDS.THEME_CHECKBOX);

    chrome.storage.sync.get([STORAGE_KEYS.THEME], result => {
      if (result[STORAGE_KEYS.THEME]) {
        this.#setTheme(result[STORAGE_KEYS.THEME] === 'light');
      } else {
        this.#setTheme(window.matchMedia('(prefers-color-scheme: light)').matches);
      }
    });

    themeCheckbox.addEventListener('change', e => {
      const isLight = e.target.checked;

      this.#setTheme(isLight);
      chrome.storage.sync.set({ [STORAGE_KEYS.THEME]: isLight ? 'light' : 'dark' });
    });
  }
}
