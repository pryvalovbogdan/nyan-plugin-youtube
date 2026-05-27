const url = 'chrome-extension://' + chrome.runtime.id + '/assets/';

/** Remove default scrubber  **/
const defaultScrubber = document.querySelector('.ytp-scrubber-button');
let currentScrubberSrc = 'catty.gif';

const catsData = {
    'black.gif': { src: 'black.gif', styles: { height: '34px !important', top: '-13px',  topHover: '-16px' } },
    'cat-garfield.gif': { src: 'cat-garfield.gif', styles: { height: '42px !important', top: '-25px',  topHover: '-28px' } },
    'catty.gif': { src: 'catty.gif', styles: { height: '20px !important', top: '-5px',  topHover: '-8px' } },
    'cute-cat.gif': { src: 'cute-cat.gif', styles: { height: '40px !important', top: '-18px',  topHover: '-22px' } },
    'cute-kawaii.gif': { src: 'cute-kawaii.gif', styles: { height: '56px !important', top: '-42px',  topHover: '-48px' }  },
    'gatito.gif': { src: 'gatito.gif', styles: { height: '40px !important', top: '-28px',  topHover: '-30px' } },
    'glitch-cat.gif': { src: 'glitch-cat.gif', styles: { height: '28px !important', top: '-13px', topHover: '-18px' } },
    'kitty-wigglez.gif': { src: 'kitty-wigglez.gif' },
    'orange-cat-orange.gif': { src: 'orange-cat-orange.gif' },
    'pixel-cat.gif': { src: 'pixel-cat.gif' },
    'sleeping-fat-cat-zzzzzzzzz.gif': { src: 'sleeping-fat-cat-zzzzzzzzz.gif' },
    'white-cat.gif': { src: 'white-cat.gif' },
};

function updateActiveCatElements(srcName) {
    const activeRunningCats = document.querySelectorAll('.nyan-running');
    console.log('activeRunningCats', activeRunningCats)
    activeRunningCats.forEach(catImg => {
        const catConfig = catsData[srcName];
        console.log('currentSrc22', catConfig)
        catImg.src = url + srcName;
        catImg.style.setProperty('height', catConfig.styles.height.replace(' !important', ''), 'important');
        if (catConfig.styles.top) {
            catImg.style.top = catConfig.styles.top;
        }
    });
}

chrome.storage.sync.get(['selectedCat'], (result) => {
    console.log('result', result)
    if (result.selectedCat) {
        currentScrubberSrc = result.selectedCat;
        console.log('Restored saved cat asset:', currentScrubberSrc);

        // If elements are already rendered by the time storage resolves, force an early update
        updateActiveCatElements(currentScrubberSrc);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'CHANGE_CAT_IMAGE') {
        console.log('Received new cat image message:', message.src);

        currentScrubberSrc = message.src;

        // Save selection to storage so it persists across reloads and tab instances
        chrome.storage.sync.set({ selectedCat: message.src }, () => {
            // Update currently rendered elements dynamically
            updateActiveCatElements(currentScrubberSrc);
            sendResponse({ status: 'success', saved: message.src });
        });
    }
    return true;
});

/** Changing default toolbar **/
const toggleToolBars = (parent = document, isChapter) => {
	const barProgress = parent.querySelectorAll('.ytp-play-progress');

	barProgress.forEach(item => {
		if (item.querySelector('.rainbow')) {
			return;
		}

        item.style.backgroundColor = 'transparent';
        item.style.setProperty('background', 'transparent', 'important');

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

        const miniPlayer = document.querySelector('.html5-video-player');

        if (miniPlayer){
            miniPlayer.style.setProperty('overflow', 'visible', 'important');
        }

		const image = document.createElement('img');
		image.src = url + currentScrubberSrc;
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
let intervalScrubber = null;
let currentIterationScrubber = 0;

if (defaultScrubber) {
    toggleCurrentVideo()
} else {
    /** Await for render load container **/
    intervalScrubber = setInterval(() => {
        currentIterationScrubber++;
        const defaultScrubber = document.querySelector('.ytp-scrubber-button');

        if (defaultScrubber) {
            toggleCurrentVideo(defaultScrubber);
            clearInterval(intervalScrubber);
            intervalScrubber = null;
            return;
        }

        if (currentIterationScrubber >= MAX_ITERATIONS) {
            clearInterval(intervalScrubber);
            intervalScrubber = null;
        }
    }, 500);
}

const targetNode = document.querySelector('.ytp-chapters-container');

const addObserver = (node, configProp) => {
	/** Config observer to react only for child changing **/
	const config = configProp || { attributes: false, childList: true, subtree: false };

	/** Callback will call on mutation **/
	const callback = () => {
		toggleToolBars(node, true);
	};

	/** Creating observer with callback **/
	const observer = new MutationObserver(callback);

	/** Start observing for chapter toolbars with config **/
	observer.observe(node, config);
}

let intervalRainbow = null;
let currentIterationRainbow = 0;

if (targetNode) {
	addObserver(targetNode)
} else {
    /** Await for render load container **/
    intervalRainbow = setInterval(() => {
        currentIterationRainbow++;
        const targetNode = document.querySelector('.ytp-chapters-container');
        const config = { attributes: false, childList: true, subtree: true };

        if (targetNode) {
            addObserver(targetNode, config)
            clearInterval(intervalRainbow);
            intervalRainbow = null;
            return;
        }

        if (currentIterationRainbow >= MAX_ITERATIONS) {
            clearInterval(intervalRainbow);
            intervalRainbow = null;
        }
    }, 500);
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

const  addSecondaryPageObserver = (secondaryPage) => {
    /** Config observer to react only for child changing **/
    const config = {attributes: false, childList: true, subtree: true};

    /** Callback will call on mutation **/
    const callback = () => {
        const rain = document.querySelectorAll('.main-rainbow');
        const mainPageProgressbars = document.querySelectorAll('.ytd-thumbnail-overlay-resume-playback-renderer');
        const watchedProgressBarSegment = document.querySelectorAll('.ytThumbnailOverlayProgressBarHostWatchedProgressBar');
        const rainSegment = document.querySelectorAll('.main-rainbow-watched-segment');
        const miniPlayerParent = document.querySelector('.ytp-miniplayer-ui');
        const scrubber =  miniPlayerParent?.parentNode?.querySelector('.ytp-scrubber-container');

        if(miniPlayerParent && scrubber && !scrubber.classList.contains('plugin-attached')){
            scrubber.classList.add('plugin-attached');
            toggleCurrentVideo();
        }

        if (rainSegment.length < watchedProgressBarSegment.length) {
            watchedProgressBarSegment.forEach(item => {
                if (item.querySelector('.main-rainbow-watched-segment')) {
                    return;
                }

                const rainbowImage = document.createElement('img');

                rainbowImage.src = url + 'rainbow.png';
                rainbowImage.className = 'main-rainbow-watched-segment';
                rainbowImage.style.height = '12px';
                rainbowImage.style.top = '0px';
                rainbowImage.style.position = 'absolute';
                rainbowImage.style.width = '100%';
                item.style.position = 'relative';
                item.style.height = '100%';

                item.parentElement.style.height = '8px';
                item.parentElement.style.marginBottom = '6px';

                item.append(rainbowImage)
            });
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
        });

        toggleCurrentVideo();
    };

    /** Creating observer with callback **/
    const observer = new MutationObserver(callback);

    /** Start observing for chapter toolbars with config **/
    observer.observe(secondaryPage, config);
}

let iterationSecondaryPage = 0;
let secondaryPageInterval = null;

const MAX_ITERATIONS = 3;

/** Added interval to wait till content renders **/
if(secondaryPage){
    addSecondaryPageObserver(secondaryPage)
} else {
    secondaryPageInterval = setInterval(() => {
        iterationSecondaryPage++;
        const secondaryPage = document.querySelector('#content');

        if(secondaryPage){
            addSecondaryPageObserver(secondaryPage)
            clearInterval(secondaryPageInterval);

            return;
        }

        if(iterationSecondaryPage >= MAX_ITERATIONS){
            clearInterval(secondaryPageInterval);
        }
    }, 500)
}

let interval = null;
let currentIteration = 0;

const addVideoHoverPreviewObserver = (player) => {
	/** Config observer to react only for child changing **/
	const config = {attributes: false, childList: true, subtree: true};

	const callback = () => {
		const progressbarPlayed = document.querySelectorAll('.ytProgressBarLineProgressBarPlayed');
		const progressbarLoaded = document.querySelectorAll('.ytProgressBarLineProgressBarLoaded')
        const defaultScrubbers = document.querySelector('.ytProgressBarPlayheadProgressBarPlayheadDot');

        if(defaultScrubbers && !defaultScrubbers.classList.contains('displayedNone')){
            defaultScrubbers.style.display = 'none';
            defaultScrubbers.classList.add('displayedNone')
        }

		progressbarPlayed.forEach(item => {
			if (item.querySelector('.main-rainbow') || item.classList.contains('nyanScrubberAttached')) {
				return;
			}
            console.log('progressbarLoaded HTML Context:', item.parentNode.parentNode.parentNode.outerHTML);
			const rainbowImage = document.createElement('img');

            item.parentNode.style.setProperty('overflow', 'visible', 'important');
            console.log('itemitemitem6', item)
            item.style.setProperty('backgroundColor', 'transparent', 'important');
			rainbowImage.src = url + 'rainbow.png';
			rainbowImage.className = 'main-rainbow';
			rainbowImage.style.width = '100%'
			rainbowImage.style.height = '16px';
			rainbowImage.style.top = '-6px'

			item.append(rainbowImage);

			item.classList.add('nyanScrubberAttached')

			const image = document.createElement('img');

			image.src = url + currentScrubberSrc;
			image.className = 'nyan-running';
			image.style.position = 'absolute'
			image.style.right = '-15px'
			image.style.top = '-8px'
			image.style.left = 'auto'
			image.style.zIndex = '2'
            const catConfig = catsData[currentScrubberSrc];
            console.log('item', item)

            image.style.setProperty('height', catConfig.styles.height.replace(' !important', ''), 'important');

            if (catConfig.styles.topHover) {
                image.style.top = catConfig.styles.topHover;
            }

			item.append(image);
		});

		progressbarLoaded.forEach(item => {
			if (item.querySelector('.night-sky')) {
				return;
			}

			const skyImage = document.createElement('img');

			skyImage.src = url + 'night-sky.gif';
			skyImage.className = 'night-sky';
			skyImage.style.height = '10px';
			skyImage.style.top = '-4px';

			item.append(skyImage)
		});
	}

	const observer = new MutationObserver(callback)

	/** Start observing for chapter toolbars with config **/
	observer.observe(player, config)
}

const addYoutubeMusicObserver = (player) => {
    const progressbarPlayed = player.querySelector('#primaryProgress');
    const progressbarLoaded = player.querySelector('#secondaryProgress');
    const scrubber = player.querySelector('#sliderKnob');

    const rainbowImage = document.createElement('img');

    progressbarPlayed.parentNode.style.setProperty('overflow', 'visible', 'important');

    rainbowImage.src = url + 'rainbow.png';
    rainbowImage.className = 'main-rainbow';
    rainbowImage.style.width = '100%'
    rainbowImage.style.height = '16px';
    rainbowImage.style.top = '-6px'

    progressbarPlayed.append(rainbowImage);

    const skyImage = document.createElement('img');

    skyImage.src = url + 'night-sky.gif';
    skyImage.className = 'night-sky';
    skyImage.style.height = '10px';
    skyImage.style.top = '-4px';

    progressbarLoaded.append(skyImage)

    scrubber.classList.add('nyanScrubberAttached')

    const nyanImage = document.createElement('img');

    nyanImage.src = url + currentScrubberSrc;
    nyanImage.className = 'nyan-running';
    nyanImage.style.position = 'absolute'
    nyanImage.style.right = '0'
    nyanImage.style.top = '7px'
    nyanImage.style.left = 'auto'

    scrubber.append(nyanImage);
}


const player = document.querySelector('#player-controls');
const musicPlayer = document.querySelector('#progress-bar');

/** Added interval to wait till content renders **/
if(player){
	addVideoHoverPreviewObserver(player)
} else {
	interval = setInterval(() => {
		currentIteration++;
		const hoverVideoPreviewContainer = document.querySelector('#player-controls')

		if(hoverVideoPreviewContainer){
			addVideoHoverPreviewObserver(hoverVideoPreviewContainer)
			clearInterval(interval);

			return;
		}

		if(currentIteration >= MAX_ITERATIONS){
			clearInterval(interval);
		}
	}, 500)
}

if(musicPlayer){
    addYoutubeMusicObserver(musicPlayer);
}


