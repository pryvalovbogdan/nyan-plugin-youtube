import { ACTIONS, ASSETS, PLUGIN_CLASSES, PLUGIN_IDS, STORAGE_KEYS, YT_SELECTORS, catsData } from './consts.js';
import { detectBrowserLanguage, getTranslation } from './i18n.js';

const url = `chrome-extension://${chrome.runtime.id}/assets/`;
const MAX_ITERATIONS = 3;
let currentScrubberSrc = 'catty.gif';

function waitForElement(selector, callback) {
  const el = document.querySelector(selector);

  if (el) {
    callback(el);

    return;
  }

  let count = 0;

  const id = setInterval(() => {
    const found = document.querySelector(selector);

    if (found) {
      callback(found);
      clearInterval(id);

      return;
    }

    if (++count >= MAX_ITERATIONS) {
      clearInterval(id);
    }
  }, 500);
}

function updateActiveCatElements(srcName) {
  const catConfig = catsData[srcName];
  const isYouTubeMusic = window.location.hostname === 'music.youtube.com';

  document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).forEach(catImg => {
    catImg.src = url + srcName;
    catImg.style.setProperty('height', catConfig.styles.height, 'important');
    catImg.style.top = isYouTubeMusic ? catConfig.styles.topMusic : catConfig.styles.top;
  });
}

chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT], result => {
  if (result[STORAGE_KEYS.SELECTED_CAT]) {
    currentScrubberSrc = result[STORAGE_KEYS.SELECTED_CAT];
    updateActiveCatElements(currentScrubberSrc);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === ACTIONS.CHANGE_CAT_IMAGE) {
    currentScrubberSrc = message.src;

    chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: message.src }, () => {
      updateActiveCatElements(currentScrubberSrc);
      sendResponse({ status: 'success', saved: message.src });
    });
  }

  return true;
});

function toggleToolBars(parent = document, isChapter = false) {
  parent.querySelectorAll(YT_SELECTORS.PLAY_PROGRESS).forEach(item => {
    if (item.querySelector(`.${PLUGIN_CLASSES.RAINBOW}`)) return;

    item.style.setProperty('background', 'transparent', 'important');
    const img = document.createElement('img');

    img.src = url + ASSETS.RAINBOW;
    img.className = PLUGIN_CLASSES.RAINBOW;
    item.append(img);
  });

  parent.querySelectorAll(YT_SELECTORS.LOAD_PROGRESS).forEach(item => {
    if (item.querySelector(`.${PLUGIN_CLASSES.NIGHT_SKY}`)) return;

    const img = document.createElement('img');

    img.src = url + ASSETS.NIGHT_SKY;
    img.className = PLUGIN_CLASSES.NIGHT_SKY;

    if (isChapter) img.style.left = '-7px';

    item.append(img);
  });
}

function toggleCurrentVideo(component, scrubbers) {
  if (component) component.style.display = 'none';

  const targets = scrubbers || document.querySelectorAll(YT_SELECTORS.SCRUBBER_CONTAINER);

  targets.forEach(item => {
    if (item.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).length) return;

    const miniPlayer = document.querySelector(YT_SELECTORS.VIDEO_PLAYER);

    if (miniPlayer) miniPlayer.style.setProperty('overflow', 'visible', 'important');

    const catConfig = catsData[currentScrubberSrc];
    const image = document.createElement('img');

    image.src = url + currentScrubberSrc;
    image.className = PLUGIN_CLASSES.CAT_RUNNING;
    image.style.setProperty('height', catConfig.styles.height, 'important');

    if (catConfig.styles.topHover) image.style.top = catConfig.styles.topHover;

    document.querySelectorAll(YT_SELECTORS.SCRUBBER_BUTTON).forEach(btn => (btn.style.display = 'none'));
    item.append(image);
  });

  toggleToolBars();
}

function addObserver(node, config = { attributes: false, childList: true, subtree: false }) {
  const observer = new MutationObserver(() => toggleToolBars(node, true));

  observer.observe(node, config);
}

// Main scrubber
waitForElement(YT_SELECTORS.SCRUBBER_BUTTON, el => toggleCurrentVideo(el));

// Chapter toolbars
waitForElement(YT_SELECTORS.CHAPTERS_CONTAINER, node => {
  addObserver(node, { attributes: false, childList: true, subtree: true });
});

// Page observer: scrubbers, mini player, watched segments, main page rainbow bars
waitForElement(YT_SELECTORS.CONTENT, contentEl => {
  const observer = new MutationObserver(() => {
    // New scrubber containers after navigation or new video load
    const scrubbers = document.querySelectorAll(YT_SELECTORS.SCRUBBER_CONTAINER);

    if (scrubbers.length > document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).length) {
      const defaultScrubbers = document.querySelectorAll(YT_SELECTORS.SCRUBBER_BUTTON);

      toggleCurrentVideo(defaultScrubbers[0], scrubbers);
      defaultScrubbers.forEach(btn => (btn.style.display = 'none'));
      document.querySelectorAll(YT_SELECTORS.CHAPTERS_CONTAINER).forEach(node => addObserver(node));
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
  });

  observer.observe(contentEl, { attributes: false, childList: true, subtree: true });
});

// Video hover preview
waitForElement(YT_SELECTORS.PLAYER_CONTROLS, player => {
  const observer = new MutationObserver(() => {
    const dot = document.querySelector(YT_SELECTORS.HOVER_PLAYHEAD_DOT);

    if (dot && !dot.classList.contains(PLUGIN_CLASSES.DOT_HIDDEN)) {
      dot.style.display = 'none';
      dot.classList.add(PLUGIN_CLASSES.DOT_HIDDEN);
    }

    document.querySelectorAll(YT_SELECTORS.HOVER_PROGRESS_PLAYED).forEach(item => {
      if (
        item.querySelector(`.${PLUGIN_CLASSES.MAIN_RAINBOW}`) ||
        item.classList.contains(PLUGIN_CLASSES.SCRUBBER_ATTACHED)
      )
        return;

      item.parentNode.style.setProperty('overflow', 'visible', 'important');

      const rainbow = document.createElement('img');

      rainbow.src = url + ASSETS.RAINBOW;
      rainbow.className = PLUGIN_CLASSES.MAIN_RAINBOW;
      rainbow.style.cssText = 'width:100%;height:16px;top:-6px';
      item.append(rainbow);
      item.classList.add(PLUGIN_CLASSES.SCRUBBER_ATTACHED);

      const catConfig = catsData[currentScrubberSrc];
      const cat = document.createElement('img');

      cat.src = url + currentScrubberSrc;
      cat.className = PLUGIN_CLASSES.CAT_RUNNING;
      cat.style.cssText = 'position:absolute;right:-15px;left:auto;z-index:2';
      cat.style.setProperty('height', catConfig.styles.height, 'important');

      if (catConfig.styles.topHover) cat.style.top = catConfig.styles.topHover;

      item.append(cat);
    });

    document.querySelectorAll(YT_SELECTORS.HOVER_PROGRESS_LOADED).forEach(item => {
      if (item.querySelector(`.${PLUGIN_CLASSES.NIGHT_SKY}`)) return;

      const sky = document.createElement('img');

      sky.src = url + ASSETS.NIGHT_SKY;
      sky.className = PLUGIN_CLASSES.NIGHT_SKY;
      sky.style.cssText = 'height:10px;top:-4px';
      item.append(sky);
    });
  });

  observer.observe(player, { attributes: false, childList: true, subtree: true });
});

// YouTube Music
function addYoutubeMusicObserver(player) {
  const progressbarPlayed = player.querySelector(YT_SELECTORS.MUSIC_PRIMARY_PROGRESS);
  const progressbarLoaded = player.querySelector(YT_SELECTORS.MUSIC_SECONDARY_PROGRESS);
  const scrubber = player.querySelector(YT_SELECTORS.MUSIC_SLIDER_KNOB);

  progressbarPlayed.parentNode.style.setProperty('overflow', 'visible', 'important');

  const rainbow = document.createElement('img');

  rainbow.src = url + ASSETS.RAINBOW;
  rainbow.className = PLUGIN_CLASSES.MAIN_RAINBOW;
  rainbow.style.cssText = 'width:100%;height:16px;top:-6px';
  progressbarPlayed.append(rainbow);

  const sky = document.createElement('img');

  sky.src = url + ASSETS.NIGHT_SKY;
  sky.className = PLUGIN_CLASSES.NIGHT_SKY;
  sky.style.cssText = 'height:10px;top:-4px';
  progressbarLoaded.append(sky);

  scrubber.classList.add(PLUGIN_CLASSES.SCRUBBER_ATTACHED);
  scrubber.querySelector(YT_SELECTORS.MUSIC_SLIDER_KNOB_INNER).style.setProperty('display', 'none', 'important');

  const catConfig = catsData[currentScrubberSrc];
  const cat = document.createElement('img');

  cat.src = url + currentScrubberSrc;
  cat.className = PLUGIN_CLASSES.CAT_RUNNING;
  cat.style.cssText = 'position:absolute;right:0;left:auto';
  cat.style.setProperty('height', catConfig.styles.height, 'important');
  cat.style.setProperty('top', catConfig.styles.topMusic, 'important');
  scrubber.append(cat);
}

const musicPlayer = document.querySelector(YT_SELECTORS.MUSIC_PROGRESS_BAR);

if (musicPlayer) {
  addYoutubeMusicObserver(musicPlayer);
}

function applyBannerTranslation(banner, lang) {
  const t = getTranslation(lang);
  const textEl = banner.querySelector('.nyan-promo-text');
  const openBtn = banner.querySelector(`#${PLUGIN_IDS.PROMO_OPEN_BTN}`);
  const closeBtn = banner.querySelector(`#${PLUGIN_IDS.PROMO_CLOSE_BTN}`);

  if (textEl) textEl.innerHTML = t.bannerText;

  if (openBtn) openBtn.textContent = t.bannerBtn;

  if (closeBtn) closeBtn.title = t.bannerClose;
}

function injectPromoBanner() {
  if (document.getElementById(PLUGIN_IDS.PROMO_BANNER)) {
    return;
  }

  chrome.storage.sync.get([STORAGE_KEYS.BANNER_DISMISSED], result => {
    if (result[STORAGE_KEYS.BANNER_DISMISSED]) {
      return;
    }

    const targetContainer = document.body;

    if (!targetContainer) {
      return;
    }

    const banner = document.createElement('div');

    banner.id = PLUGIN_IDS.PROMO_BANNER;
    banner.className = PLUGIN_CLASSES.PROMO_BANNER;

    banner.innerHTML = `
            <div class="nyan-promo-text"></div>
            <div class="nyan-promo-actions">
                <button class="nyan-promo-btn" id="${PLUGIN_IDS.PROMO_OPEN_BTN}"></button>
                <button class="nyan-promo-close" id="${PLUGIN_IDS.PROMO_CLOSE_BTN}">&times;</button>
            </div>
        `;

    targetContainer.prepend(banner);

    chrome.storage.sync.get([STORAGE_KEYS.THEME, STORAGE_KEYS.LANGUAGE], prefs => {
      const savedTheme = prefs[STORAGE_KEYS.THEME];
      const isLight = savedTheme ? savedTheme === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches;

      banner.classList.toggle(PLUGIN_CLASSES.LIGHT_THEME, isLight);

      const lang = prefs[STORAGE_KEYS.LANGUAGE] || detectBrowserLanguage();

      applyBannerTranslation(banner, lang);
    });

    document.getElementById(PLUGIN_IDS.PROMO_OPEN_BTN).addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: ACTIONS.OPEN_POPUP });
    });

    document.getElementById(PLUGIN_IDS.PROMO_CLOSE_BTN).addEventListener('click', () => {
      banner.remove();
      chrome.storage.sync.set({ [STORAGE_KEYS.BANNER_DISMISSED]: true });
    });
  });
}

injectPromoBanner();

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
