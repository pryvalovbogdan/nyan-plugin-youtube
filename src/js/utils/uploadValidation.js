import { MAX_UPLOAD_BYTES } from '../consts.js';

export const ALLOWED_UPLOAD_TYPES = ['image/gif', 'image/png', 'image/webp', 'image/apng', 'image/jpeg'];

/**
 * Validate a user-selected file for the custom cat uploader.
 *
 * @param {{type: string, size: number}} file
 * @returns {null | 'uploadErrorType' | 'uploadErrorSize'} translation key of the error, or null if valid
 */
export function validateUploadFile(file) {
  if (!file || !ALLOWED_UPLOAD_TYPES.includes(file.type)) return 'uploadErrorType';

  if (file.size > MAX_UPLOAD_BYTES) return 'uploadErrorSize';

  return null;
}
