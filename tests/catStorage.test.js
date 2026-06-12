import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { STORAGE_KEYS } from '../src/js/consts.js';
import {
  getCustomUserCat,
  getFullState,
  getSelectedCat,
  getStyleOverrides,
  setCustomUserCat,
  setSelectedCat,
  setStyleOverrides,
} from '../src/js/background/services/CatStorage.js';
import { createChromeStub } from './helpers/chromeStub.js';

let stub;

beforeEach(() => {
  stub = createChromeStub();
  globalThis.chrome = stub.chrome;
});

afterEach(() => {
  delete globalThis.chrome;
});

describe('CatStorage', () => {
  it('getSelectedCat returns the stored value from sync storage', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'catty.gif';

    expect(await getSelectedCat()).toBe('catty.gif');
  });

  it('getSelectedCat returns null when nothing is stored', async () => {
    expect(await getSelectedCat()).toBeNull();
  });

  it('setSelectedCat writes to sync storage', async () => {
    await setSelectedCat('black.gif');

    expect(stub.syncStore[STORAGE_KEYS.SELECTED_CAT]).toBe('black.gif');
  });

  it('getCustomUserCat returns the stored value from local storage', async () => {
    stub.localStore[STORAGE_KEYS.CUSTOM_USER_CAT] = 'data:image/gif;base64,XYZ';

    expect(await getCustomUserCat()).toBe('data:image/gif;base64,XYZ');
  });

  it('getCustomUserCat returns null when nothing is stored', async () => {
    expect(await getCustomUserCat()).toBeNull();
  });

  it('setCustomUserCat writes to local storage', async () => {
    await setCustomUserCat('data:image/png;base64,ABC');

    expect(stub.localStore[STORAGE_KEYS.CUSTOM_USER_CAT]).toBe('data:image/png;base64,ABC');
  });

  it('getStyleOverrides defaults to an empty object', async () => {
    expect(await getStyleOverrides()).toEqual({});
  });

  it('setStyleOverrides persists the given object', async () => {
    const overrides = { 'catty.gif': { height: 40, top: -10 } };

    await setStyleOverrides(overrides);

    expect(stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES]).toEqual(overrides);
  });

  it('getFullState composes selected cat, custom cat, and the override for the selected cat', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'catty.gif';
    stub.localStore[STORAGE_KEYS.CUSTOM_USER_CAT] = 'data:image/gif;base64,XYZ';
    stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES] = {
      'catty.gif': { height: 40, top: -10 },
      'black.gif': { height: 50, top: -20 },
    };

    expect(await getFullState()).toEqual({
      selectedCat: 'catty.gif',
      customUserCat: 'data:image/gif;base64,XYZ',
      customCatStyles: { height: 40, top: -10 },
    });
  });

  it('getFullState returns null customCatStyles when no cat is selected', async () => {
    stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES] = { 'catty.gif': { height: 40, top: -10 } };

    expect(await getFullState()).toEqual({
      selectedCat: null,
      customUserCat: null,
      customCatStyles: null,
    });
  });

  it('getFullState returns null customCatStyles when selected cat has no override', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'black.gif';
    stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES] = { 'catty.gif': { height: 40, top: -10 } };

    const state = await getFullState();

    expect(state.customCatStyles).toBeNull();
  });
});
