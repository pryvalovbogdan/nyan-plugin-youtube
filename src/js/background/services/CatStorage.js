import { STORAGE_KEYS } from '../../consts.js';

export const getSelectedCat = async () => {
  const data = await chrome.storage.sync.get([STORAGE_KEYS.SELECTED_CAT]);

  return data[STORAGE_KEYS.SELECTED_CAT] ?? null;
};

export const setSelectedCat = src => chrome.storage.sync.set({ [STORAGE_KEYS.SELECTED_CAT]: src });

export const getCustomUserCat = async () => {
  const data = await chrome.storage.local.get([STORAGE_KEYS.CUSTOM_USER_CAT]);

  return data[STORAGE_KEYS.CUSTOM_USER_CAT] ?? null;
};

export const setCustomUserCat = base64 => chrome.storage.local.set({ [STORAGE_KEYS.CUSTOM_USER_CAT]: base64 });

export const getStyleOverrides = async () => {
  const data = await chrome.storage.local.get([STORAGE_KEYS.CAT_STYLE_OVERRIDES]);

  return data[STORAGE_KEYS.CAT_STYLE_OVERRIDES] ?? {};
};

export const setStyleOverrides = overrides =>
  chrome.storage.local.set({ [STORAGE_KEYS.CAT_STYLE_OVERRIDES]: overrides });

export const getFullState = async () => {
  const [selectedCat, customUserCat, overrides] = await Promise.all([
    getSelectedCat(),
    getCustomUserCat(),
    getStyleOverrides(),
  ]);

  return {
    selectedCat,
    customUserCat,
    customCatStyles: selectedCat ? (overrides[selectedCat] ?? null) : null,
  };
};
