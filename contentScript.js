const url = 'chrome-extension://' + chrome.runtime.id + '/assets/';

/** Remove default scrubber  **/
const defaultScrubber = document.querySelector('.ytp-scrubber-button');

/** Changing default toolbar **/
const toggleToolBars = (parent = document, isChapter) => {
	const barProgress = parent.querySelectorAll('.ytp-play-progress');

	barProgress.forEach(item => {
		if (item.querySelector('.rainbow')) {
			return;
		}

		const rainbowImage = document.createElement('img');
		rainbowImage.src = url + 'rainbow.png';
		rainbowImage.className = 'rainbow';

		item.append(rainbowImage)
	});

	const loadProgress = parent.querySelectorAll('.ytp-load-progress');

	loadProgress.forEach(item => {
		if (item.querySelector('.night-sky')) {
			return;
		}

		const skyImage = document.createElement('img');
		skyImage.src = url + 'night-sky.gif';
		skyImage.className = 'night-sky';

		if (isChapter) {
			skyImage.style.left = '-7px';
		}

		item.append(skyImage)
	});
}

const toggleCurrentVideo = (component = defaultScrubber, scrubberPass) => {
	if(component){
		component.style.display = 'none';
	}

	/** Adding animated nyan cat  **/
	const scrubber = scrubberPass || document.querySelectorAll('.ytp-scrubber-container');

	scrubber.forEach(item => {
		if(item.querySelectorAll('.nyan-running').length){
			return
		}

		const image = document.createElement('img');
		image.src = url + 'catty.gif';
		image.className = 'nyan-running';

		const defaultScrubbers = document.querySelectorAll('.ytp-scrubber-button');
		defaultScrubbers.forEach(item => item.style.display = 'none');

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

		if(document.querySelectorAll('.ytp-scrubber-container').length > document.querySelectorAll('.nyan-running').length){
			const targetNode = document.querySelectorAll('.ytp-chapters-container');

			toggleCurrentVideo(defaultScrubbers[0], document.querySelectorAll('.ytp-scrubber-container'));

			defaultScrubbers.forEach(item => item.style.display = 'none')

			targetNode.forEach(item => {
				addObserver(item)
			})
		}

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

		toggleCurrentVideo();
	};

	/** Creating observer with callback **/
	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(secondaryPage, config);
}

const MAX_ITERATIONS = 3;

let interval = null;
let currentIteration = 0;

const addVideoPreviewObserver = (hoverVideoPreviewContainer) => {
	/** Config observer to react only for child changing **/
	const config = {attributes: false, childList: true, subtree: true};

	const callback = () => {
		const progress = document.querySelector('.YtPlayerProgressBarHost');

		if(!progress || progress && progress.classList.contains('nyanScrubberAttached')){
			return
		}

		progress.classList.add('nyanScrubberAttached')

		const loadedContent = progress.querySelector('.YtProgressBarPlayheadHost');

		loadedContent.innerHTML = ''

		const image = document.createElement('img');
		image.src = url + 'catty.gif';
		image.className = 'nyan-running';
		image.style.position = 'absolute'
		image.style.left = '-10px'
		image.style.top = '-10px'

		loadedContent.append(image);
	};

	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(hoverVideoPreviewContainer, config);
}

const hoverVideoPreviewContainer = document.querySelector('ytd-video-preview')

/** Added interval to wait till content renders **/
if(hoverVideoPreviewContainer){
	addVideoPreviewObserver(hoverVideoPreviewContainer)
} else {
	interval = setInterval(() => {
		currentIteration++;
		const hoverVideoPreviewContainer = document.querySelector('ytd-video-preview')

		if(hoverVideoPreviewContainer){
			addVideoPreviewObserver(hoverVideoPreviewContainer)
			clearInterval(interval);

			return;
		}

		if(currentIteration >= MAX_ITERATIONS){
			clearInterval(interval);
		}
	}, 500)
}