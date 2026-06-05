import { STORAGE_KEYS } from '../consts.js';
import { LANGUAGE_NAMES, detectBrowserLanguage, getTranslation } from '../i18n.js';
import { PopupModule } from './PopupModule.js';

export class LanguageModule extends PopupModule {
  #applyTranslations(lang) {
    const t = getTranslation(lang);

    const title = document.getElementById('popupTitle');
    const donateBtn = document.getElementById('donateBtn');
    const customizeBtn = document.getElementById('customizeBtn');
    const moreBtn = document.getElementById('moreBtn');
    const rateUsLabel = document.getElementById('rateUsLabel');
    const adjustPositionTitle = document.getElementById('adjustPositionTitle');
    const labelHeight = document.getElementById('labelHeight');
    const labelTop = document.getElementById('labelTop');
    const resetPositionBtn = document.getElementById('resetPositionBtn');

    if (title) title.textContent = t.title;

    if (donateBtn) donateBtn.textContent = t.donate;

    if (customizeBtn) customizeBtn.textContent = t.customize;

    if (moreBtn) moreBtn.textContent = t.more;

    if (rateUsLabel) rateUsLabel.textContent = t.rateUs;

    if (adjustPositionTitle) adjustPositionTitle.textContent = t.adjustPosition;

    if (labelHeight) labelHeight.textContent = t.height;

    if (labelTop) labelTop.textContent = t.topOffset;

    if (resetPositionBtn) resetPositionBtn.textContent = t.resetPosition;
  }

  #buildLanguageSelect(savedLang) {
    const container = document.querySelector('.lang-select-container');
    const trigger = document.getElementById('langDropdownTrigger');
    const menu = document.getElementById('langDropdownMenu');

    if (!container || !trigger || !menu) return;

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

        this.#applyTranslations(selectedLang);
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

  init() {
    chrome.storage.sync.get([STORAGE_KEYS.LANGUAGE], result => {
      const lang = result[STORAGE_KEYS.LANGUAGE] || detectBrowserLanguage();

      this.#buildLanguageSelect(lang);
      this.#applyTranslations(lang);
    });
  }
}
