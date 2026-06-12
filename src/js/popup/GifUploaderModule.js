import { POPUP_IDS, STORAGE_KEYS } from '../consts.js';
import { validateUploadFile } from '../uploadValidation.js';
import { detectBrowserLanguage, getTranslation } from '../i18n.js';
import { CatGridModule } from './CatGridModule.js';
import { handleCatSelection } from './helpers.js';
import { PopupModule } from './PopupModule.js';

function showUploadError(messageKey) {
  chrome.storage.sync.get([STORAGE_KEYS.LANGUAGE], prefs => {
    const lang = prefs[STORAGE_KEYS.LANGUAGE] || detectBrowserLanguage();
    const t = getTranslation(lang);
    let errorEl = document.getElementById(POPUP_IDS.UPLOAD_ERROR);

    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.id = POPUP_IDS.UPLOAD_ERROR;
      errorEl.className = 'upload-error';
      document.getElementById(POPUP_IDS.CAT_GRID)?.before(errorEl);
    }

    errorEl.textContent = t[messageKey];
    errorEl.style.display = 'block';
    setTimeout(() => (errorEl.style.display = 'none'), 4000);
  });
}

export class GifUploaderModule extends PopupModule {
  init() {
    const uploaderInput = document.getElementById('gifUploader');

    if (!uploaderInput) return;

    uploaderInput.addEventListener('change', event => {
      const file = event.target.files[0];

      // Allow re-selecting the same file after a failed attempt
      event.target.value = '';

      if (!file) return;

      const error = validateUploadFile(file);

      if (error) {
        showUploadError(error);

        return;
      }

      const reader = new FileReader();

      reader.onload = async e => {
        const base64DataUrl = e.target.result;

        chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_USER_CAT]: base64DataUrl }, () => {
          const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);
          const uploadCard = gridContainer.firstElementChild;

          if (chrome.runtime.lastError) {
            console.error('Storage failed:', chrome.runtime.lastError.message);
          }

          gridContainer.innerHTML = '';
          gridContainer.appendChild(uploadCard);

          handleCatSelection(base64DataUrl, true);
          CatGridModule.render();
        });
      };

      reader.readAsDataURL(file);
    });
  }
}
