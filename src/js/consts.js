export const ACTIONS = {
  CHANGE_CAT_IMAGE: 'CHANGE_CAT_IMAGE',
  OPEN_POPUP: 'OPEN_POPUP',
  UPDATE_CAT_STYLE: 'UPDATE_CAT_STYLE',
  UPDATE_CUSTOM_CAT_STYLES: 'UPDATE_CUSTOM_CAT_STYLES',
  UPLOAD_CUSTOM_CAT: 'UPLOAD_CUSTOM_CAT',
  SELECT_CAT: 'SELECT_CAT',
  GET_STATE: 'GET_STATE',
  CAT_SELECTED_IN_POPUP: 'CAT_SELECTED_IN_POPUP',
};

export const STORAGE_KEYS = {
  SELECTED_CAT: 'selectedCat',
  THEME: 'theme',
  LANGUAGE: 'language',
  BANNER_DISMISSED: 'bannerDismissed',
  CAT_STYLE_OVERRIDES: 'catStyleOverrides',
  CUSTOM_USER_CAT: 'customUserCat',
  HIDE_RAINBOW: 'hideRainbow',
  HIDE_NIGHT_SKY: 'hideNightSky',
};

export const CUSTOM_CAT_SENTINEL = '__custom__';

export const PLUGIN_CLASSES = {
  CAT_RUNNING: 'nyan-running',
  RAINBOW: 'rainbow',
  NIGHT_SKY: 'night-sky',
  MAIN_RAINBOW: 'main-rainbow',
  MAIN_RAINBOW_WATCHED: 'main-rainbow-watched-segment',
  SCRUBBER_ATTACHED: 'nyanScrubberAttached',
  SCRUBBER_DOT: 'nyan-scrubber-dot',
  MINI_PLAYER_ATTACHED: 'plugin-attached',
  DOT_HIDDEN: 'displayedNone',
  PROMO_BANNER: 'nyan-promo-banner',
  LIGHT_THEME: 'light-theme',
  CAT_GRID_ITEM: 'cat-grid-item',
  BODY: 'body',
  HIDE_RAINBOW: 'nyan-hide-rainbow',
  HIDE_NIGHT_SKY: 'nyan-hide-night-sky',
};

export const PLUGIN_IDS = {
  PROMO_BANNER: 'nyanPromoBanner',
  PROMO_OPEN_BTN: 'nyanPromoOpenBtn',
  PROMO_CLOSE_BTN: 'nyanPromoCloseBtn',
};

export const POPUP_IDS = {
  CAT_GRID: 'catGrid',
  THEME_CHECKBOX: 'themeCheckbox',
  LANGUAGE_SELECT: 'languageSelect',
  UPLOAD_ERROR: 'uploadError',
  HIDE_RAINBOW_CHECKBOX: 'hideRainbowCheckbox',
  HIDE_NIGHT_SKY_CHECKBOX: 'hideNightSkyCheckbox',
};

// Maximum size for user-uploaded custom cat images (4 MB).
// Base64 encoding inflates this ~33% before it hits chrome.storage.local.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Build-time flag. Always defined via esbuild --define or vitest config.
// Written as a direct ref (not behind `typeof`) so esbuild can constant-fold
// and dead-code-eliminate the unused branch.
export const DEBUG = __NYAN_DEBUG__;
// __SAFARI__ is used directly at call sites (not re-exported) for the same
// DCE reason — esbuild only folds across import boundaries inconsistently.

export const debugLog = (...args) => {
  if (DEBUG) console.log('[nyan]', ...args);
};

export const YT_SELECTORS = {
  SCRUBBER_BUTTON: '.ytp-scrubber-button',
  SCRUBBER_CONTAINER: '.ytp-scrubber-container',
  CHAPTERS_CONTAINER: '.ytp-chapters-container',
  PLAY_PROGRESS: '.ytp-play-progress',
  LOAD_PROGRESS: '.ytp-load-progress',
  VIDEO_PLAYER: '.html5-video-player',
  MINI_PLAYER_UI: '.ytp-miniplayer-ui',
  RESUME_PROGRESS_BAR: '.ytd-thumbnail-overlay-resume-playback-renderer',
  WATCHED_PROGRESS_BAR: '.ytThumbnailOverlayProgressBarHostWatchedProgressBar',
  HOVER_PROGRESS_PLAYED: '.ytProgressBarLineProgressBarPlayed',
  HOVER_PROGRESS_LOADED: '.ytProgressBarLineProgressBarLoaded',
  HOVER_PLAYHEAD_DOT: '.ytProgressBarPlayheadProgressBarPlayheadDot',
  CONTENT: '#content',
  PRIMARY: '#primary',
  PLAYER_CONTROLS: '#player-controls',
  MUSIC_PROGRESS_BAR: '#progress-bar',
  MUSIC_PRIMARY_PROGRESS: '#primaryProgress',
  MUSIC_SECONDARY_PROGRESS: '#secondaryProgress',
  MUSIC_SLIDER_KNOB: '#sliderKnob',
  MUSIC_SLIDER_KNOB_INNER: '.slider-knob-inner.tp-yt-paper-slider',
  FILL_PLAYED_BAR: '.ytChapteredProgressBarChapteredPlayerBarFill',
  YT_NAVIGATE_FINISH: 'yt-navigate-finish',
  SHORTS_CONTAINER: '#shorts-container',
};

export const MOBILE_SELECTORS = {
  SCRUBBER_BUTTON: '.ytProgressBarPlayheadProgressBarPlayheadDot',
  SCRUBBER_CONTAINER: '.ytProgressBarPlayheadHost',
  PLAY_PROGRESS: '.ytProgressBarLineProgressBarPlayed',
  LOAD_PROGRESS: '.ytProgressBarLineProgressBarLoaded',
  CONTENT: '#player-control-container',
  PLAYER_CONTROLS: '.player-controls-content',
  PLAY_PROGRESS_BAR_SEGMENTAL: '.ytChapteredProgressBarChapteredPlayerBarChapterSeen',
  LOAD_PROGRESS_BAR_SEGMENTAL: '.ytChapteredProgressBarChapteredPlayerBarLoaded',
  PROGRESS_BAR_SEGMENTAL: '.ytChapteredProgressBarChapteredPlayerBarChapter',
};

export const YOUTUBE_URL_PATTERNS = ['*://*.youtube.com/*', '*://music.youtube.com/*', '*://m.youtube.com/*'];

export const EXTENSION_VERSION = '1.1.2';

export const WEB_BRIDGE_MESSAGES = {
  EXTENSION_INSTALLED: 'MY_EXTENSION_INSTALLED',
  CHECK_EXTENSION_PRESENT: 'CHECK_EXTENSION_PRESENT',
};

export const WEB_BRIDGE_TARGETS = {
  CONTENT_SCRIPT: 'SAFARI_EXTENSION_CONTENT_SCRIPT',
  WEB_PAGE: 'WEB_PAGE',
};

export const CUSTOM_EVENTS = {
  CAT_SELECTED: 'nyan:cat-selected',
};

export const ASSETS = {
  RAINBOW: 'rainbow.png',
  NIGHT_SKY: 'night-sky.gif',
};

export const CAT_SECTIONS = [
  { id: 'cats', icon: 'orange-cat-dancing.gif', titleKey: 'sectionCats' },
  { id: 'dogs', icon: 'pug-running.gif', titleKey: 'sectionDogs' },
  { id: 'friends', icon: 'purple-bat.gif', titleKey: 'sectionFriends' },
];

export const catsData = {
  'black.gif': {
    src: 'black.gif',
    section: 'cats',
    styles: { height: '34px', top: '-13px', topHover: '-16px', topMusic: '-1px' },
  },
  'catty.gif': {
    src: 'catty.gif',
    section: 'cats',
    styles: { height: '20px', top: '-5px', topHover: '-8px', topMusic: '5px' },
  },
  'glitch-cat.gif': {
    src: 'glitch-cat.gif',
    section: 'cats',
    styles: { height: '28px', top: '-13px', topHover: '-18px', topMusic: '-5px' },
  },
  'cute-cat.gif': {
    src: 'cute-cat.gif',
    section: 'cats',
    styles: { height: '45px', top: '-23px', topHover: '-25px', topMusic: '-13px' },
  },
  'cute-kawaii.gif': {
    src: 'cute-kawaii.gif',
    section: 'cats',
    styles: { height: '56px', top: '-42px', topHover: '-48px', topMusic: '-33px' },
  },
  'gatito.gif': {
    src: 'gatito.gif',
    section: 'cats',
    styles: { height: '40px', top: '-28px', topHover: '-30px', topMusic: '-18px' },
  },
  'kitty-wigglez.gif': {
    src: 'kitty-wigglez.gif',
    section: 'cats',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-11px' },
  },
  'orange-cat-orange.gif': {
    src: 'orange-cat-orange.gif',
    section: 'cats',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-5px' },
  },
  'pixel-cat.gif': {
    src: 'pixel-cat.gif',
    section: 'cats',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-7px' },
  },
  'cat-garfield.gif': {
    src: 'cat-garfield.gif',
    section: 'cats',
    styles: { height: '42px', top: '-25px', topHover: '-28px', topMusic: '-14px' },
  },
  'white-cat.gif': {
    src: 'white-cat.gif',
    section: 'cats',
    styles: { height: '37px', top: '-17px', topHover: '-20px', topMusic: '-7px' },
  },
  'orange-cat-dancing.gif': {
    src: 'orange-cat-dancing.gif',
    section: 'cats',
    styles: { height: '40px', top: '-23px', topHover: '-25px', topMusic: '-15px' },
  },
  'rolling-cat.gif': {
    src: 'rolling-cat.gif',
    section: 'cats',
    styles: { height: '30px', top: '-16px', topHover: '-19px', topMusic: '-5px' },
  },
  'cat-cats.gif': {
    src: 'cat-cats.gif',
    section: 'cats',
    styles: { height: '40px', top: '-24px', topHover: '-27px', topMusic: '-13px' },
  },
  'cat-cute.gif': {
    src: 'cat-cute.gif',
    section: 'cats',
    styles: { height: '34px', top: '-19px', topHover: '-22px', topMusic: '-8px' },
  },
  'cat-in-a-scarf.gif': {
    src: 'cat-in-a-scarf.gif',
    section: 'cats',
    styles: { height: '38px', top: '-22px', topHover: '-25px', topMusic: '-11px' },
  },
  'cat-walking.gif': {
    src: 'cat-walking.gif',
    section: 'cats',
    styles: { height: '34px', top: '-19px', topHover: '-22px', topMusic: '-8px' },
  },
  'cute-cat-cartoon.gif': {
    src: 'cute-cat-cartoon.gif',
    section: 'cats',
    styles: { height: '38px', top: '-21px', topHover: '-24px', topMusic: '-10px' },
  },
  'happy-cat.gif': {
    src: 'happy-cat.gif',
    section: 'cats',
    styles: { height: '40px', top: '-24px', topHover: '-27px', topMusic: '-13px' },
  },
  'kitty-scratch.gif': {
    src: 'kitty-scratch.gif',
    section: 'cats',
    styles: { height: '38px', top: '-23px', topHover: '-26px', topMusic: '-12px' },
  },
  'shadow-cat.gif': {
    src: 'shadow-cat.gif',
    section: 'cats',
    styles: { height: '36px', top: '-20px', topHover: '-23px', topMusic: '-9px' },
  },
  'pixel-corgi.gif': {
    src: 'pixel-corgi.gif',
    section: 'dogs',
    styles: { height: '40px', top: '-22px', topHover: '-25px', topMusic: '-11px' },
  },
  'puppy-love.gif': {
    src: 'puppy-love.gif',
    section: 'dogs',
    styles: { height: '38px', top: '-21px', topHover: '-24px', topMusic: '-10px' },
  },
  'pug-running.gif': {
    src: 'pug-running.gif',
    section: 'dogs',
    styles: { height: '40px', top: '-22px', topHover: '-25px', topMusic: '-11px' },
  },
  'fox-music.gif': {
    src: 'fox-music.gif',
    section: 'friends',
    styles: { height: '26px', top: '-14px', topHover: '-17px', topMusic: '-3px' },
  },
  'fawn-run.gif': {
    src: 'fawn-run.gif',
    section: 'friends',
    styles: { height: '38px', top: '-21px', topHover: '-24px', topMusic: '-10px' },
  },
  'purple-bat.gif': {
    src: 'purple-bat.gif',
    section: 'friends',
    styles: { height: '38px', top: '-21px', topHover: '-24px', topMusic: '-10px' },
  },
  'rainbow-bird.gif': {
    src: 'rainbow-bird.gif',
    section: 'friends',
    styles: { height: '40px', top: '-22px', topHover: '-25px', topMusic: '-11px' },
  },
  'ramen-shark.gif': {
    src: 'ramen-shark.gif',
    section: 'friends',
    styles: { height: '36px', top: '-20px', topHover: '-23px', topMusic: '-9px' },
  },
};
