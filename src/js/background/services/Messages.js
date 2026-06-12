import { ACTIONS, CUSTOM_CAT_SENTINEL } from '../../consts.js';
import {
  getFullState,
  getSelectedCat,
  getStyleOverrides,
  setCustomUserCat,
  setSelectedCat,
  setStyleOverrides,
} from './CatStorage.js';
import { notifyYouTubeTabs } from './YouTubeTabs.js';

export default {
  [ACTIONS.GET_STATE]: (_request, _sender, sendResponse) => {
    getFullState().then(sendResponse);

    return true;
  },

  [ACTIONS.UPDATE_CUSTOM_CAT_STYLES]: (request, _sender, sendResponse) => {
    if (!request.styles) {
      sendResponse({ ok: false });

      return false;
    }

    (async () => {
      const selectedCat = await getSelectedCat();

      if (!selectedCat) {
        sendResponse({ ok: false });

        return;
      }

      const overrides = await getStyleOverrides();

      overrides[selectedCat] = request.styles;

      await setStyleOverrides(overrides);
      await notifyYouTubeTabs({
        action: ACTIONS.UPDATE_CAT_STYLE,
        catSrc: selectedCat,
        styles: request.styles,
      });
      sendResponse({ ok: true });
    })();

    return true;
  },

  [ACTIONS.SELECT_CAT]: (request, _sender, sendResponse) => {
    if (!request.src) {
      sendResponse({ ok: false });

      return false;
    }

    const isCustom = request.src === CUSTOM_CAT_SENTINEL;

    (async () => {
      await setSelectedCat(request.src);
      await notifyYouTubeTabs({ action: ACTIONS.CHANGE_CAT_IMAGE, src: request.src, isCustom });
      sendResponse({ ok: true });
    })();

    return true;
  },

  [ACTIONS.UPLOAD_CUSTOM_CAT]: (request, _sender, sendResponse) => {
    if (!request.base64) {
      sendResponse({ ok: false });

      return false;
    }

    (async () => {
      await setCustomUserCat(request.base64);
      await setSelectedCat(CUSTOM_CAT_SENTINEL);
      await notifyYouTubeTabs({
        action: ACTIONS.CHANGE_CAT_IMAGE,
        src: CUSTOM_CAT_SENTINEL,
        isCustom: true,
      });
      sendResponse({ ok: true });
    })();

    return true;
  },
};
