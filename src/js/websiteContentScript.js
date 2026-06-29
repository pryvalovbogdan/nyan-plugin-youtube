import {
  ACTIONS,
  CUSTOM_EVENTS,
  EXTENSION_VERSION,
  STORAGE_KEYS,
  WEB_BRIDGE_MESSAGES,
  WEB_BRIDGE_TARGETS,
} from './consts.js';
import { isSafariOnAppleOS } from './utils/utils.js';

// 1. Existing Message Passing: Extension background -> Website
chrome.runtime.onMessage.addListener(message => {
  if (message.action === ACTIONS.CAT_SELECTED_IN_POPUP) {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.CAT_SELECTED, { detail: message }));
  }
});

// Helper to announce extension presence to the React layout
function notifyWebsite() {
  window.postMessage({ type: WEB_BRIDGE_MESSAGES.EXTENSION_INSTALLED, version: EXTENSION_VERSION }, '*');
}

function initSafariWebBridge() {
  notifyWebsite();

  // 2. Safari Web Handshake Bridge
  window.addEventListener('message', async event => {
    if (!event.data) return;

    if (event.data.type === WEB_BRIDGE_MESSAGES.CHECK_EXTENSION_PRESENT) {
      notifyWebsite();

      return;
    }

    if (event.data.target === WEB_BRIDGE_TARGETS.CONTENT_SCRIPT) {
      const { action, requestId, ...payload } = event.data;

      if (action === ACTIONS.SELECT_CAT) {
        // Delegate data adjustments & cross-tab notifications to the privileged background runner
        chrome.runtime.sendMessage({ action: ACTIONS.SELECT_CAT, src: payload.src, isCustom: false }, response => {
          if (requestId) {
            window.postMessage(
              {
                source: WEB_BRIDGE_TARGETS.CONTENT_SCRIPT,
                target: WEB_BRIDGE_TARGETS.WEB_PAGE,
                requestId,
                response: response ?? { ok: true },
              },
              '*',
            );
          }
        });

        return;
      }

      // Handle Custom Upload State synchronization
      if (action === ACTIONS.CHANGE_CAT_IMAGE && payload.isCustom && payload.customUserCat) {
        // Direct update to local extension storage mimicking context updates
        chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_USER_CAT]: payload.customUserCat }, () => {
          chrome.runtime.sendMessage({ action, ...payload }, response => {
            if (requestId) {
              window.postMessage(
                {
                  source: WEB_BRIDGE_TARGETS.CONTENT_SCRIPT,
                  target: WEB_BRIDGE_TARGETS.WEB_PAGE,
                  requestId,
                  response,
                },
                '*',
              );
            }
          });
        });

        return;
      }

      if (action === ACTIONS.GET_STATE) {
        chrome.runtime.sendMessage({ action, ...payload }, response => {
          window.postMessage(
            {
              source: WEB_BRIDGE_TARGETS.CONTENT_SCRIPT,
              target: WEB_BRIDGE_TARGETS.WEB_PAGE,
              requestId,
              response,
            },
            '*',
          );
        });
      } else {
        // Fire-and-forget actions (such as regular SELECT_CAT / ACTIONS.CHANGE_CAT_IMAGE)
        chrome.runtime.sendMessage({ action, ...payload });
      }
    }
  });
}

if (isSafariOnAppleOS()) {
  initSafariWebBridge();
}
