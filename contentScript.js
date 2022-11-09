const url = 'chrome-extension://' + chrome.runtime.id + '/assets/';

/** Remove default scrubber  **/
const defaultScrubber = document.querySelector('.ytp-scrubber-button');

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

const toggleCurrentVideo = (component = defaultScrubber) => {
	if(component){
		component.style.display = 'none';
	}

	/** Adding animated nyan cat  **/
	const scrubber = document.querySelectorAll('.ytp-scrubber-container');

	scrubber.forEach(item => {
		const image = document.createElement('img');
		image.src = url + 'catty.gif';
		image.className = 'nyan-running';

		item.append(image)
	})

	toggleToolBars();
}

if (defaultScrubber) {
	toggleCurrentVideo();
}

const targetNode = document.querySelector('.ytp-chapters-container');

const addObserver = node => {
	/** Config observer to react only for child changing **/
	const config = {attributes: false, childList: true, subtree: false};

	/** Callback will call on mutation **/
	const callback = () => {
		toggleToolBars(node, true);
	};

	/** Creating observer with callback **/
	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(node, config);
}

if (targetNode) {
	addObserver(targetNode)
}

const mainPageRow = document.querySelector('#primary');

if (mainPageRow) {
	/** Config observer to react only for child changing **/
	const config = {attributes: false, childList: true, subtree: true};

	/** Callback will call on mutation **/
	const callback = () => {
		const rain = document.querySelectorAll('.main-rainbow');
		const mainPageProgressbars = document.querySelectorAll('.ytd-thumbnail-overlay-resume-playback-renderer');
		const defaultScrubbers = document.querySelectorAll('.ytp-scrubber-button');

		if (rain.length && rain.length >= mainPageProgressbars.length) {
			return;
		}

		mainPageProgressbars.forEach(item => {
			if (item.querySelector('.main-rainbow')) {
				return;
			}

			const rainbowImage = document.createElement('img');

			rainbowImage.src = url + 'rainbow.png';
			rainbowImage.className = 'main-rainbow';

			item.append(rainbowImage)
		})

		const targetNode = document.querySelectorAll('.ytp-chapters-container');
		toggleCurrentVideo();

		defaultScrubbers.forEach(item => item.style.display = 'none')

		targetNode.forEach(item => {
			addObserver(item)
		})
	};

	/** Creating observer with callback **/
	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(mainPageRow, config);
}

const secondaryPage = document.querySelector('#content');

if (secondaryPage) {
	/** Config observer to react only for child changing **/
	const config = {attributes: false, childList: true, subtree: true};

	/** Callback will call on mutation **/
	const callback = () => {
		const rain = document.querySelectorAll('.main-rainbow');
		const mainPageProgressbars = document.querySelectorAll('.ytd-thumbnail-overlay-resume-playback-renderer');

		if (rain.length && rain.length >= mainPageProgressbars.length) {
			return;
		}

		mainPageProgressbars.forEach(item => {
			if (item.querySelector('.main-rainbow')) {
				return;
			}

			const rainbowImage = document.createElement('img');

			rainbowImage.src = url + 'rainbow.png';
			rainbowImage.className = 'main-rainbow';

			item.append(rainbowImage)
		})
	};

	/** Creating observer with callback **/
	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(secondaryPage, config);
}

