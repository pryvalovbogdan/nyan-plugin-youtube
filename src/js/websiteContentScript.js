import { ACTIONS } from './consts.js';

// 1. Existing Message Passing: Extension background -> Website
chrome.runtime.onMessage.addListener(message => {
  if (message.action === ACTIONS.CAT_SELECTED_IN_POPUP) {
    window.dispatchEvent(new CustomEvent('nyan:cat-selected', { detail: message }));
  }
});

// Helper to announce extension presence to the React layout
function notifyWebsite() {
  window.postMessage({ type: 'MY_EXTENSION_INSTALLED', version: '1.1.2' }, '*');
}

notifyWebsite();

// 2. Safari Web Handshake Bridge
window.addEventListener('message', async event => {
  console.log('Received message from Safari extension:', event.data);

  if (!event.data) return;

  if (event.data.type === 'CHECK_EXTENSION_PRESENT') {
    notifyWebsite();

    return;
  }

  console.log('event.datassss', event?.data, event?.data?.type);

  if (event.data.target === 'SAFARI_EXTENSION_CONTENT_SCRIPT') {
    const { action, requestId, ...payload } = event.data;

    if (action === ACTIONS.SELECT_CAT) {
      // Delegate data adjustments & cross-tab notifications to the privileged background runner
      chrome.runtime.sendMessage({ action: ACTIONS.SELECT_CAT, src: payload.src, isCustom: false }, response => {
        if (requestId) {
          window.postMessage(
            {
              source: 'SAFARI_EXTENSION_CONTENT_SCRIPT',
              target: 'WEB_PAGE',
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
      chrome.storage.local.set({ customUserCat: payload.customUserCat }, () => {
        chrome.runtime.sendMessage({ action, ...payload }, response => {
          if (requestId) {
            window.postMessage(
              {
                source: 'SAFARI_EXTENSION_CONTENT_SCRIPT',
                target: 'WEB_PAGE',
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

    if (action === 'GET_STATE') {
      chrome.runtime.sendMessage({ action, ...payload }, response => {
        window.postMessage(
          {
            source: 'SAFARI_EXTENSION_CONTENT_SCRIPT',
            target: 'WEB_PAGE',
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
