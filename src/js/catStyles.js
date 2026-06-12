import { CUSTOM_CAT_SENTINEL, catsData } from './consts.js';

export const CUSTOM_FALLBACK_STYLES = { height: '28px', top: '-13px', topHover: '-16px', topMusic: '-1px' };

/**
 * Resolve the inline styles for a cat image.
 * Pure function: user overrides win, then per-cat defaults, then the
 * custom-upload fallback.
 *
 * @param {string} src - cat filename, custom sentinel, or data URL
 * @param {Object<string, {height: number, top: number}>} overrides - user style overrides keyed by src
 * @returns {{height: string, top: string, topHover: string, topMusic: string}}
 */
export function resolveCatStyles(src, overrides = {}) {
  const override = overrides[src];

  if (override) {
    const { height, top } = override;

    return {
      height: `${height}px`,
      top: `${top}px`,
      topHover: `${top - 3}px`,
      topMusic: `${top + 12}px`,
    };
  }

  if (src === CUSTOM_CAT_SENTINEL) return CUSTOM_FALLBACK_STYLES;

  return catsData[src]?.styles || CUSTOM_FALLBACK_STYLES;
}
