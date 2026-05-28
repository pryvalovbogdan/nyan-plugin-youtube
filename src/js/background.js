import { ACTIONS } from './consts.js';

chrome.runtime.onMessage.addListener(request => {
  if (request.action === ACTIONS.OPEN_POPUP) {
    chrome.action.openPopup();
  }
});
