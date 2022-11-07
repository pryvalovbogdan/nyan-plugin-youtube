const url = 'chrome-extension://' + chrome.runtime.id + '/assets/';

/** Remove default scrubber  **/
document.querySelector('.ytp-scrubber-button').style.display = 'none'

/** Adding animated nyan cat  **/
const scrubber = document.querySelector('.ytp-scrubber-container');
const image = document.createElement('img');
image.src = url + 'catty.gif';
image.className = 'nyan-running';
scrubber.append(image);

/** Changing default toolbar **/
const toggleToolBars = (parent = document, isChapter) => {
	const barProgress = parent.querySelectorAll('.ytp-play-progress');

	barProgress.forEach(item => {
		const rainbowImage = document.createElement('img');
		rainbowImage.src = url + 'rainbow.png';
		rainbowImage.className = 'rainbow';

		item.append(rainbowImage)
	});

	const loadProgress = parent.querySelectorAll('.ytp-load-progress');

	loadProgress.forEach(item => {
		const skyImage = document.createElement('img');
		skyImage.src = url + 'night-sky.gif';
		skyImage.className = 'night-sky';

		if (isChapter) {
			skyImage.style.left = '-7px';
		}

		item.append(skyImage)
	});
}

toggleToolBars();

const targetNode = document.querySelector('.ytp-chapters-container');

/** Config observer to react only for child changing **/
const config = { attributes: false, childList: true, subtree: false };

/** Callback will call on mutation **/
const callback = () => {
	toggleToolBars(targetNode, true);
};

/** Creating observer with callback **/
const observer = new MutationObserver(callback);

/** Start observing for chapter toolbars with config **/
observer.observe(targetNode, config);

