import { toggleCurrentVideo } from './contentScript';
import { TOOLBAR_VARIANTS } from './sripts/consts';

const elmColors = document.getElementsByName("bar-style");
const barStyles = [[null, null, TOOLBAR_VARIANTS["nyan"]], [null, null, TOOLBAR_VARIANTS["kakashi"]]];

for (let i = 0; i < elmColors.length; i++) {
	elmColors[i].onclick = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: toggleCurrentVideo,
				args: [...barStyles[i]]
			});
		});
	}
}
