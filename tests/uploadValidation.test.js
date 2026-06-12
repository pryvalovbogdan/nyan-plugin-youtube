import { describe, expect, it } from 'vitest';

import { MAX_UPLOAD_BYTES } from '../src/js/consts.js';
import { LANGUAGE_NAMES, TRANSLATIONS, getTranslation } from '../src/js/utils/i18n.js';
import { ALLOWED_UPLOAD_TYPES, validateUploadFile } from '../src/js/utils/uploadValidation.js';

describe('validateUploadFile', () => {
  it('accepts a small gif', () => {
    expect(validateUploadFile({ type: 'image/gif', size: 1024 })).toBeNull();
  });

  it.each(ALLOWED_UPLOAD_TYPES)('accepts %s', type => {
    expect(validateUploadFile({ type, size: 1024 })).toBeNull();
  });

  it('rejects non-image types', () => {
    expect(validateUploadFile({ type: 'video/mp4', size: 1024 })).toBe('uploadErrorType');
    expect(validateUploadFile({ type: 'text/html', size: 10 })).toBe('uploadErrorType');
    expect(validateUploadFile({ type: 'image/svg+xml', size: 10 })).toBe('uploadErrorType');
  });

  it('rejects oversized files', () => {
    expect(validateUploadFile({ type: 'image/gif', size: MAX_UPLOAD_BYTES + 1 })).toBe('uploadErrorSize');
  });

  it('accepts a file exactly at the limit', () => {
    expect(validateUploadFile({ type: 'image/png', size: MAX_UPLOAD_BYTES })).toBeNull();
  });

  it('rejects missing file', () => {
    expect(validateUploadFile(null)).toBe('uploadErrorType');
  });
});

describe('i18n', () => {
  it('falls back to English for unknown languages', () => {
    expect(getTranslation('xx')).toBe(TRANSLATIONS.en);
  });

  it('exposes a language name for every translation', () => {
    expect(Object.keys(LANGUAGE_NAMES).sort()).toEqual(Object.keys(TRANSLATIONS).sort());
  });

  it('every language has every key English has (no missing strings)', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();

    for (const [lang, dict] of Object.entries(TRANSLATIONS)) {
      expect(Object.keys(dict).sort(), `language: ${lang}`).toEqual(enKeys);
    }
  });
});
