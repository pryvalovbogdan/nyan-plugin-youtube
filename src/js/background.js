chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'OPEN_POPUP') {
        chrome.action.openPopup();
    }
});