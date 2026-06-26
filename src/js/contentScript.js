import {
  ACTIONS,
  ASSETS,
  CUSTOM_CAT_SENTINEL,
  PLUGIN_CLASSES,
  PLUGIN_IDS,
  STORAGE_KEYS,
  YT_SELECTORS,
} from './consts.js';
import {
  activeSelectors,
  addObserver,
  addYoutubeMusicObserver,
  applyBannerTranslation,
  applyCustomCat,
  getCurrentScrubberSrc,
  injectPromoBanner,
  isMobileSafari,
  rafCoalesce,
  runSelectorHealthCheck,
  setCatStyleOverrides,
  setCurrentScrubberSrc,
  setCustomCatDataUrl,
  toggleCurrentVideo,
  togglePreview,
  updateActiveCatElements,
  updateCatStyleOverride,
  url,
  waitForElement,
} from './contentScript/helpers.js';

chrome.storage.local.get(['customUserCat', STORAGE_KEYS.CAT_STYLE_OVERRIDES], localResult => {
  if (localResult[STORAGE_KEYS.CAT_STYLE_OVERRIDES]) {
    setCatStyleOverrides(localResult[STORAGE_KEYS.CAT_STYLE_OVERRIDES]);
  }

  chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], syncResult => {
    const saved = syncResult[STORAGE_KEYS.SELECTED_CAT];

    if (saved === CUSTOM_CAT_SENTINEL && localResult.customUserCat) {
      applyCustomCat(localResult.customUserCat);
    } else if (saved && saved !== CUSTOM_CAT_SENTINEL) {
      setCurrentScrubberSrc(saved);
      updateActiveCatElements(saved);
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === ACTIONS.CHANGE_CAT_IMAGE) {
    if (message.isCustom) {
      chrome.storage.local.get(['customUserCat'], localResult => {
        if (localResult.customUserCat) {
          applyCustomCat(localResult.customUserCat);
        }

        sendResponse({ status: 'success' });
      });
    } else {
      setCurrentScrubberSrc(message.src);
      setCustomCatDataUrl(null);
      chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: message.src }, () => {
        updateActiveCatElements(message.src);
        sendResponse({ status: 'success' });
      });
    }
  } else if (message.action === ACTIONS.UPDATE_CAT_STYLE) {
    updateCatStyleOverride(message.catSrc, message.styles);
    updateActiveCatElements(getCurrentScrubberSrc());
    sendResponse({ status: 'success' });
  }

  return true;
});

// Main scrubber
if (isMobileSafari) {
  // Mobile Safari Track Setup
  waitForElement(activeSelectors.CONTENT, container => {
    const mobileDOMObserver = new MutationObserver(
      rafCoalesce(() => {
        const nativeVideo = document.querySelector('video');
        const scrubberContainer = document.querySelector(activeSelectors.SCRUBBER_CONTAINER);

        // If a mobile track container exists and the cat hasn't been appended yet
        if (scrubberContainer && !scrubberContainer.querySelector(`.${PLUGIN_CLASSES.CAT_RUNNING}`)) {
          toggleCurrentVideo(null, [scrubberContainer]);
        }

        // Fallback: Bind directly to HTML5 video lifecycle updates
        // if mobile UI shifts block native CSS timeline positioning
        if (nativeVideo && !nativeVideo.dataset.nyanBound) {
          nativeVideo.dataset.nyanBound = 'true';

          nativeVideo.addEventListener('timeupdate', () => {
            const catImg = document.querySelector(`.${PLUGIN_CLASSES.CAT_RUNNING}`);

            if (catImg && nativeVideo.duration) {
              const currentPercentage = (nativeVideo.currentTime / nativeVideo.duration) * 100;

              // Adjust position inline if native layout classes clip relative transforms
              catImg.style.setProperty('left', `calc(${currentPercentage}% - 15px)`, 'important');
            }
          });
        }
      }),
    );

    // attributeFilter limits fires to the attributes the callback actually
    // reacts to. Without it, every aria-*, data-*, focus-state churn fires.
    mobileDOMObserver.observe(container, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: true,
      subtree: true,
    });
  });

  waitForElement(PLUGIN_CLASSES.BODY, player => {
    const observer = new MutationObserver(
      rafCoalesce(() => {
        document.querySelectorAll(activeSelectors.SCRUBBER_BUTTON).forEach(dot => {
          if (
            dot.style.getPropertyValue('background-color') === 'transparent' ||
            dot.style.getPropertyValue('z-index') === '2'
          ) {
            return;
          }

          if (dot.classList.contains(PLUGIN_CLASSES.SCRUBBER_DOT)) {
            return;
          }

          dot.classList.add(PLUGIN_CLASSES.SCRUBBER_DOT);
        });

        document.querySelectorAll(activeSelectors.LOAD_PROGRESS_BAR_SEGMENTAL).forEach(item => {
          const width = item.style.getPropertyValue('width');

          if (item.querySelector(`.${PLUGIN_CLASSES.RAINBOW}`) || width === '0%') return;

          item.style.setProperty('background', 'transparent', 'important');
          const img = document.createElement('img');

          img.src = url + ASSETS.RAINBOW;
          img.className = PLUGIN_CLASSES.RAINBOW;

          item.parentNode
            .querySelector(YT_SELECTORS.FILL_PLAYED_BAR)
            .style.setProperty('background', 'transparent', 'important');

          item.append(img);
        });
        const seenClass = activeSelectors.PLAY_PROGRESS_BAR_SEGMENTAL.slice(1);

        document.querySelectorAll(activeSelectors.PROGRESS_BAR_SEGMENTAL).forEach(item => {
          const isSeen = item.classList.contains(seenClass);
          const existingRainbow = item.querySelector(`:scope > .${PLUGIN_CLASSES.RAINBOW}`);

          if (isSeen && !existingRainbow) {
            item.classList.add(PLUGIN_CLASSES.SCRUBBER_ATTACHED);
            item.style.setProperty('background', 'transparent', 'important');
            const img = document.createElement('img');

            img.src = url + ASSETS.RAINBOW;
            img.className = PLUGIN_CLASSES.RAINBOW;
            img.style.setProperty('min-width', 'auto', 'important');
            item.append(img);
          } else if (!isSeen && existingRainbow) {
            // User seeked back, YouTube stripped ChapterSeen — drop the rainbow
            // so it can be re-added if the chapter is seen again.
            existingRainbow.remove();
            item.classList.remove(PLUGIN_CLASSES.SCRUBBER_ATTACHED);
          }
        });
      }),
    );

    observer.observe(player, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: true,
      subtree: true,
    });
  });
} else {
  // Original Desktop/Desktop-SPA Pipelines
  waitForElement(activeSelectors.SCRUBBER_BUTTON, el => toggleCurrentVideo(el));

  window.addEventListener('yt-navigate-finish', () => {
    waitForElement(activeSelectors.SCRUBBER_BUTTON, el => toggleCurrentVideo(el));
    waitForElement(activeSelectors.CHAPTERS_CONTAINER, node => {
      addObserver(node, { attributes: false, childList: true, subtree: true });
    });
  });

  waitForElement(activeSelectors.CHAPTERS_CONTAINER, node => {
    addObserver(node, { attributes: false, childList: true, subtree: true });
  });

  setTimeout(runSelectorHealthCheck, 5000);

  // Chapter toolbars
  waitForElement(YT_SELECTORS.CHAPTERS_CONTAINER, node => {
    addObserver(node, { attributes: false, childList: true, subtree: true });
  });

  // Page observer: scrubbers, mini player, watched segments, main page rainbow bars
  waitForElement(YT_SELECTORS.CONTENT, contentEl => {
    const observer = new MutationObserver(
      rafCoalesce(mutations => {
        // Every branch below gates on "did a new container appear?". If no nodes
        // were added in this batch, nothing can have changed — skip the sweep.
        let hasAdded = false;

        if (mutations) {
          for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
              hasAdded = true;
              break;
            }
          }
        }

        if (!hasAdded) return;

        // New scrubber containers after navigation or new video load
        const scrubbers = document.querySelectorAll(YT_SELECTORS.SCRUBBER_CONTAINER);

        if (scrubbers.length > document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).length) {
          const defaultScrubbers = document.querySelectorAll(YT_SELECTORS.SCRUBBER_BUTTON);

          toggleCurrentVideo(defaultScrubbers[0], scrubbers);
          defaultScrubbers.forEach(btn => (btn.style.display = 'none'));
          document.querySelectorAll(YT_SELECTORS.CHAPTERS_CONTAINER).forEach(node => addObserver(node));
        }

        // Shorts-only branch: skip on every other route so the home feed doesn't
        // pay for two extra document queries on every mutation.
        if (location.pathname.startsWith('/shorts')) {
          const d = document.querySelector('#shorts-container');
          const dot = document.querySelector(YT_SELECTORS.HOVER_PLAYHEAD_DOT);

          if (d && dot) {
            togglePreview();
          }
        }

        // Mini player scrubber
        const miniPlayerParent = document.querySelector(YT_SELECTORS.MINI_PLAYER_UI);
        const miniScrubber = miniPlayerParent?.parentNode?.querySelector(YT_SELECTORS.SCRUBBER_CONTAINER);

        if (miniPlayerParent && miniScrubber && !miniScrubber.classList.contains(PLUGIN_CLASSES.MINI_PLAYER_ATTACHED)) {
          miniScrubber.classList.add(PLUGIN_CLASSES.MINI_PLAYER_ATTACHED);
          toggleCurrentVideo();
        }

        // Watched segment bars on thumbnails
        const watchedBars = document.querySelectorAll(YT_SELECTORS.WATCHED_PROGRESS_BAR);

        if (document.querySelectorAll(`.${PLUGIN_CLASSES.MAIN_RAINBOW_WATCHED}`).length < watchedBars.length) {
          watchedBars.forEach(item => {
            if (item.querySelector(`.${PLUGIN_CLASSES.MAIN_RAINBOW_WATCHED}`)) return;

            const img = document.createElement('img');

            img.src = url + ASSETS.RAINBOW;
            img.className = PLUGIN_CLASSES.MAIN_RAINBOW_WATCHED;
            img.style.cssText = 'height:12px;top:0px;position:absolute;width:100%';
            item.style.position = 'relative';
            item.style.height = '100%';
            item.parentElement.style.height = '8px';
            item.parentElement.style.marginBottom = '6px';
            item.append(img);
          });
        }

        // Main page resume progress bars
        const mainProgressBars = document.querySelectorAll(YT_SELECTORS.RESUME_PROGRESS_BAR);

        if (document.querySelectorAll(`.${PLUGIN_CLASSES.MAIN_RAINBOW}`).length >= mainProgressBars.length) return;

        mainProgressBars.forEach(item => {
          if (item.querySelector(`.${PLUGIN_CLASSES.MAIN_RAINBOW}`)) return;

          const img = document.createElement('img');

          img.src = url + ASSETS.RAINBOW;
          img.className = PLUGIN_CLASSES.MAIN_RAINBOW;
          item.append(img);
        });
      }),
    );

    observer.observe(contentEl, { attributes: false, childList: true, subtree: true });
  });

  // Video hover preview
  waitForElement(YT_SELECTORS.PLAYER_CONTROLS, player => {
    const observer = new MutationObserver(
      rafCoalesce(() => {
        togglePreview();
      }),
    );

    observer.observe(player, { attributes: false, childList: true, subtree: true });
  });

  // YouTube Music
  const musicPlayer = document.querySelector(YT_SELECTORS.MUSIC_PROGRESS_BAR);

  if (musicPlayer) {
    addYoutubeMusicObserver(musicPlayer);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;

    const banner = document.getElementById(PLUGIN_IDS.PROMO_BANNER);

    if (!banner) return;

    if (changes[STORAGE_KEYS.THEME]) {
      banner.classList.toggle(PLUGIN_CLASSES.LIGHT_THEME, changes[STORAGE_KEYS.THEME].newValue === 'light');
    }

    if (changes[STORAGE_KEYS.LANGUAGE]) {
      applyBannerTranslation(banner, changes[STORAGE_KEYS.LANGUAGE].newValue);
    }
  });
}

injectPromoBanner();
