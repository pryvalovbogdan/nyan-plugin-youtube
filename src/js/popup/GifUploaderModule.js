import { POPUP_IDS, STORAGE_KEYS } from '../consts.js';
import { CatGridModule } from './CatGridModule.js';
import { handleCatSelection, updateCustomControlDisplay } from './helpers.js';
import { PopupModule } from './PopupModule.js';

export class GifUploaderModule extends PopupModule {
  init() {
    const uploaderInput = document.getElementById('gifUploader');

    if (!uploaderInput) return;

    uploaderInput.addEventListener('change', event => {
      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = async e => {
        const base64DataUrl = e.target.result;

        chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_USER_CAT]: base64DataUrl }, () => {
          const gridContainer = document.getElementById(POPUP_IDS.CAT_GRID);
          const uploadCard = gridContainer.firstElementChild;

          gridContainer.innerHTML = '';
          gridContainer.appendChild(uploadCard);

          CatGridModule.render();
          handleCatSelection(base64DataUrl, true);

          const controls = document.getElementById('customCatControls');

          if (controls) controls.style.display = 'flex';

          updateCustomControlDisplay();
        });
      };

      reader.readAsDataURL(file);
    });
  }
}
