import { describe, expect, it } from 'vitest';

import { CUSTOM_FALLBACK_STYLES, resolveCatStyles } from '../src/js/catStyles.js';
import { CUSTOM_CAT_SENTINEL, catsData } from '../src/js/consts.js';

describe('resolveCatStyles', () => {
  it('returns per-cat default styles for a known cat', () => {
    const knownCat = Object.keys(catsData)[0];

    expect(resolveCatStyles(knownCat)).toEqual(catsData[knownCat].styles);
  });

  it('returns the custom fallback for the custom sentinel', () => {
    expect(resolveCatStyles(CUSTOM_CAT_SENTINEL)).toEqual(CUSTOM_FALLBACK_STYLES);
  });

  it('returns the custom fallback for an unknown src', () => {
    expect(resolveCatStyles('does-not-exist.gif')).toEqual(CUSTOM_FALLBACK_STYLES);
  });

  it('applies user overrides and derives hover/music offsets', () => {
    const styles = resolveCatStyles('catty.gif', { 'catty.gif': { height: 40, top: -10 } });

    expect(styles).toEqual({ height: '40px', top: '-10px', topHover: '-13px', topMusic: '2px' });
  });

  it('prefers overrides over per-cat defaults', () => {
    const knownCat = Object.keys(catsData)[0];
    const styles = resolveCatStyles(knownCat, { [knownCat]: { height: 99, top: 0 } });

    expect(styles.height).toBe('99px');
  });
});
