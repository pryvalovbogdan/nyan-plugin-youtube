import { ACTIONS } from './consts.js';

chrome.runtime.onMessage.addListener(message => {
  if (message.action === ACTIONS.CAT_SELECTED_IN_POPUP) {
    window.dispatchEvent(new CustomEvent('nyan:cat-selected', { detail: message }));
  }
});
