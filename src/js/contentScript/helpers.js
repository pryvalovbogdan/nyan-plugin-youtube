import {
  ACTIONS,
  ASSETS,
  CUSTOM_CAT_SENTINEL,
  MOBILE_SELECTORS,
  PLUGIN_CLASSES,
  PLUGIN_IDS,
  STORAGE_KEYS,
  YT_SELECTORS,
  debugLog,
} from '../consts.js';
import { resolveCatStyles } from '../utils/catStyles.js';
import { detectBrowserLanguage, getTranslation } from '../utils/i18n.js';

export const url = chrome.runtime.getURL('assets/');
const MAX_ITERATIONS = 6;

export const isMobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream;
export const activeSelectors = isMobileSafari
  ? {
      ...YT_SELECTORS,
      ...MOBILE_SELECTORS,
    }
  : YT_SELECTORS;

// Shared module state. Owned here so every helper sees the same value; the
// entry file mutates via the exported setters below.
let currentScrubberSrc = 'catty.gif';
let customCatDataUrl = null;
let catStyleOverrides = {};

export const getCurrentScrubberSrc = () => currentScrubberSrc;

export function setCurrentScrubberSrc(src) {
  currentScrubberSrc = src;
}

export function setCustomCatDataUrl(dataUrl) {
  customCatDataUrl = dataUrl;
}

export function setCatStyleOverrides(overrides) {
  catStyleOverrides = overrides;
}

export function updateCatStyleOverride(key, styles) {
  if (styles) {
    catStyleOverrides[key] = styles;
  } else {
    delete catStyleOverrides[key];
  }
}

export const getCatStyles = src => resolveCatStyles(src, catStyleOverrides);

export function getCatSrcUrl(src) {
  if (src === CUSTOM_CAT_SENTINEL || src.startsWith('data:image/png;base64')) {
    return customCatDataUrl || '';
  }

  return url + src;
}

export function waitForElement(selector, callback) {
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

// Collapse N mutations within a single animation frame into one callback fire.
// Sub-frame delay, no user-visible difference. YouTube mutates `#content` and
// `<body>` dozens of times per scroll tick — without this, the callback's
// querySelectorAll sweep runs each time.
export function rafCoalesce(fn) {
  let queued = false;
  let lastMutations = null;

  return mutations => {
    lastMutations = mutations;

    if (queued) return;

    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const m = lastMutations;

      lastMutations = null;
      fn(m);
    });
  };
}

export function updateActiveCatElements(srcName) {
  const styles = getCatStyles(srcName);
  const isYouTubeMusic = window.location.hostname === 'music.youtube.com';

  document.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).forEach(catImg => {
    catImg.src = getCatSrcUrl(srcName);

    catImg.style.setProperty('height', styles.height, 'important');
    catImg.style.top = isYouTubeMusic ? styles.topMusic : styles.top;
  });
}

export function applyCustomCat(dataUrl) {
  customCatDataUrl = dataUrl;
  currentScrubberSrc = CUSTOM_CAT_SENTINEL;
  updateActiveCatElements(currentScrubberSrc);
}

export function toggleToolBars(parent = document, isChapter = false) {
  parent.querySelectorAll(activeSelectors.PLAY_PROGRESS).forEach(item => {
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

export function toggleCurrentVideo(component, scrubbers) {
  if (component && component.style) component.style.display = 'none';

  const targets = scrubbers || document.querySelectorAll(activeSelectors.SCRUBBER_CONTAINER);

  targets.forEach(item => {
    if (item.querySelectorAll(`.${PLUGIN_CLASSES.CAT_RUNNING}`).length) return;

    // Desktop optimization fallback
    if (!isMobileSafari) {
      const miniPlayer = document.querySelector(activeSelectors.VIDEO_PLAYER);

      if (miniPlayer) miniPlayer.style.setProperty('overflow', 'visible', 'important');
    }

    const styles = getCatStyles(currentScrubberSrc);
    const image = document.createElement('img');

    image.src = getCatSrcUrl(currentScrubberSrc);
    image.className = PLUGIN_CLASSES.CAT_RUNNING;
    image.style.setProperty('height', styles.height, 'important');

    if (styles.topHover) image.style.top = styles.topHover;

    item.append(image);
  });

  toggleToolBars();
}

// Nodes that already have a MutationObserver attached. Prevents stacking
// duplicate observers on the same chapter containers across mutation passes.
const observedNodes = new WeakSet();

export function addObserver(node, config = { attributes: false, childList: true, subtree: false }) {
  if (observedNodes.has(node)) return;

  observedNodes.add(node);

  const observer = new MutationObserver(() => toggleToolBars(node, true));

  observer.observe(node, config);
}

export const togglePreview = () => {
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

    const styles = getCatStyles(currentScrubberSrc);
    const cat = document.createElement('img');

    cat.src = getCatSrcUrl(currentScrubberSrc);
    cat.className = PLUGIN_CLASSES.CAT_RUNNING;
    cat.style.cssText = 'position:absolute;right:-15px;left:auto;z-index:2';
    cat.style.setProperty('height', styles.height, 'important');

    if (styles.topHover) cat.style.top = styles.topHover;

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
};

export function addYoutubeMusicObserver(player) {
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

  const styles = getCatStyles(currentScrubberSrc);
  const cat = document.createElement('img');

  cat.src = getCatSrcUrl(currentScrubberSrc);
  cat.className = PLUGIN_CLASSES.CAT_RUNNING;
  cat.style.cssText = 'position:absolute;right:0;left:auto';
  cat.style.setProperty('height', styles.height, 'important');
  cat.style.setProperty('top', styles.topMusic, 'important');
  scrubber.append(cat);
}

const HEALTH_CHECK_SELECTORS = ['SCRUBBER_BUTTON', 'SCRUBBER_CONTAINER', 'PLAY_PROGRESS', 'LOAD_PROGRESS', 'VIDEO_PLAYER'];

// Startup health check: warns (debug builds) when YouTube renames the class
// names this extension depends on, so breakage is caught before user reports.
export function runSelectorHealthCheck() {
  if (!window.location.pathname.startsWith('/watch')) return;

  const missing = HEALTH_CHECK_SELECTORS.filter(key => !document.querySelector(YT_SELECTORS[key]));

  if (missing.length) {
    debugLog('Selector health check failed. Missing:', missing.map(key => YT_SELECTORS[key]).join(', '));
  } else {
    debugLog('Selector health check passed.');
  }
}

export function applyBannerTranslation(banner, lang) {
  const t = getTranslation(lang);
  const textEl = banner.querySelector('.nyan-promo-text');
  const openBtn = banner.querySelector(`#${PLUGIN_IDS.PROMO_OPEN_BTN}`);
  const closeBtn = banner.querySelector(`#${PLUGIN_IDS.PROMO_CLOSE_BTN}`);

  if (textEl) textEl.innerHTML = t.bannerText;

  if (openBtn) openBtn.textContent = t.bannerBtn;

  if (closeBtn) closeBtn.title = t.bannerClose;
}

export function injectPromoBanner() {
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
