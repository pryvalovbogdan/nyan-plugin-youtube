chrome.action.disable();

/** Disable action bar if it's not youtube **/
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		if (tab.url.indexOf('www.youtube') !== -1) {
			console.log('enable');
			chrome.action.enable(tabId);
		} else {
			console.log('disable');
			chrome.action.disable(tabId);
		}
	}
});
