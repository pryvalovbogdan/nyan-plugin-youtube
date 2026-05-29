export const ACTIONS = {
  CHANGE_CAT_IMAGE: 'CHANGE_CAT_IMAGE',
  OPEN_POPUP: 'OPEN_POPUP',
  UPDATE_CUSTOM_CAT_STYLES: 'UPDATE_CUSTOM_CAT_STYLES',
};

export const STORAGE_KEYS = {
  SELECTED_CAT: 'selectedCat',
  THEME: 'theme',
  LANGUAGE: 'language',
  BANNER_DISMISSED: 'bannerDismissed',
  CUSTOM_CAT_STYLES: 'customCatStyles',
};

export const CUSTOM_CAT_SENTINEL = '__custom__';

export const PLUGIN_CLASSES = {
  CAT_RUNNING: 'nyan-running',
  RAINBOW: 'rainbow',
  NIGHT_SKY: 'night-sky',
  MAIN_RAINBOW: 'main-rainbow',
  MAIN_RAINBOW_WATCHED: 'main-rainbow-watched-segment',
  SCRUBBER_ATTACHED: 'nyanScrubberAttached',
  MINI_PLAYER_ATTACHED: 'plugin-attached',
  DOT_HIDDEN: 'displayedNone',
  PROMO_BANNER: 'nyan-promo-banner',
  LIGHT_THEME: 'light-theme',
  CAT_GRID_ITEM: 'cat-grid-item',
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
};

export const ASSETS = {
  RAINBOW: 'rainbow.png',
  NIGHT_SKY: 'night-sky.gif',
};

export const catsData = {
  'black.gif': { src: 'black.gif', styles: { height: '34px', top: '-13px', topHover: '-16px', topMusic: '-1px' } },
  'catty.gif': { src: 'catty.gif', styles: { height: '20px', top: '-5px', topHover: '-8px', topMusic: '5px' } },
  'glitch-cat.gif': {
    src: 'glitch-cat.gif',
    styles: { height: '28px', top: '-13px', topHover: '-18px', topMusic: '-5px' },
  },
  'cute-cat.gif': {
    src: 'cute-cat.gif',
    styles: { height: '45px', top: '-23px', topHover: '-25px', topMusic: '-13px' },
  },
  'cute-kawaii.gif': {
    src: 'cute-kawaii.gif',
    styles: { height: '56px', top: '-42px', topHover: '-48px', topMusic: '-33px' },
  },
  'gatito.gif': { src: 'gatito.gif', styles: { height: '40px', top: '-28px', topHover: '-30px', topMusic: '-18px' } },
  'kitty-wigglez.gif': {
    src: 'kitty-wigglez.gif',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-11px' },
  },
  'orange-cat-orange.gif': {
    src: 'orange-cat-orange.gif',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-5px' },
  },
  'pixel-cat.gif': {
    src: 'pixel-cat.gif',
    styles: { height: '32px', top: '-17px', topHover: '-20px', topMusic: '-7px' },
  },
  'cat-garfield.gif': {
    src: 'cat-garfield.gif',
    styles: { height: '42px', top: '-25px', topHover: '-28px', topMusic: '-14px' },
  },
  'white-cat.gif': {
    src: 'white-cat.gif',
    styles: { height: '37px', top: '-17px', topHover: '-20px', topMusic: '-7px' },
  },
  'orange-cat-dancing.gif': {
    src: 'orange-cat-dancing.gif',
    styles: { height: '40px', top: '-23px', topHover: '-25px', topMusic: '-15px' },
  },
};
