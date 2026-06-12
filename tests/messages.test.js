import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ACTIONS, CUSTOM_CAT_SENTINEL, STORAGE_KEYS } from '../src/js/consts.js';
import Messages from '../src/js/background/services/Messages.js';
import { createChromeStub } from './helpers/chromeStub.js';

let stub;

// Promise-ify the sendResponse callback so each test can await the result.
const invoke = (action, request = {}) =>
  new Promise(resolve => {
    const returned = Messages[action](request, {}, resolve);

    // Every handler that responds async must return true (Chrome MV3 idiom).
    expect(returned).toBe(true);
  });

beforeEach(() => {
  stub = createChromeStub({ tabs: [{ id: 1 }] });
  globalThis.chrome = stub.chrome;
});

afterEach(() => {
  delete globalThis.chrome;
});

describe('Messages[GET_STATE]', () => {
  it('responds with the composed full state', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'catty.gif';
    stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES] = { 'catty.gif': { height: 40, top: -10 } };

    const response = await invoke(ACTIONS.GET_STATE);

    expect(response).toEqual({
      selectedCat: 'catty.gif',
      customUserCat: null,
      customCatStyles: { height: 40, top: -10 },
    });
  });
});

describe('Messages[UPDATE_CUSTOM_CAT_STYLES]', () => {
  it('persists the overrides and broadcasts UPDATE_CAT_STYLE', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'catty.gif';
    const styles = { height: 40, top: -10 };

    const response = await invoke(ACTIONS.UPDATE_CUSTOM_CAT_STYLES, { styles });

    expect(response).toEqual({ ok: true });
    expect(stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES]).toEqual({ 'catty.gif': styles });
    expect(stub.sentMessages).toEqual([
      { id: 1, msg: { action: ACTIONS.UPDATE_CAT_STYLE, catSrc: 'catty.gif', styles } },
    ]);
  });

  it('merges new override into existing overrides without losing other cats', async () => {
    stub.syncStore[STORAGE_KEYS.SELECTED_CAT] = 'catty.gif';
    stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES] = { 'black.gif': { height: 99, top: -1 } };

    await invoke(ACTIONS.UPDATE_CUSTOM_CAT_STYLES, { styles: { height: 40, top: -10 } });

    expect(stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES]).toEqual({
      'black.gif': { height: 99, top: -1 },
      'catty.gif': { height: 40, top: -10 },
    });
  });

  it('responds { ok: false } and returns false when styles are missing', () => {
    const sendResponse = vi.fn();
    const returned = Messages[ACTIONS.UPDATE_CUSTOM_CAT_STYLES]({}, {}, sendResponse);

    expect(returned).toBe(false);
    expect(sendResponse).toHaveBeenCalledWith({ ok: false });
  });

  it('responds { ok: false } when no cat is selected', async () => {
    const response = await invoke(ACTIONS.UPDATE_CUSTOM_CAT_STYLES, { styles: { height: 40, top: -10 } });

    expect(response).toEqual({ ok: false });
    expect(stub.localStore[STORAGE_KEYS.CAT_STYLE_OVERRIDES]).toBeUndefined();
    expect(stub.sentMessages).toEqual([]);
  });
});

describe('Messages[SELECT_CAT]', () => {
  it('writes the selected cat and broadcasts CHANGE_CAT_IMAGE', async () => {
    const response = await invoke(ACTIONS.SELECT_CAT, { src: 'black.gif' });

    expect(response).toEqual({ ok: true });
    expect(stub.syncStore[STORAGE_KEYS.SELECTED_CAT]).toBe('black.gif');
    expect(stub.sentMessages).toEqual([
      { id: 1, msg: { action: ACTIONS.CHANGE_CAT_IMAGE, src: 'black.gif', isCustom: false } },
    ]);
  });

  it('flags isCustom: true when src is the custom sentinel', async () => {
    await invoke(ACTIONS.SELECT_CAT, { src: CUSTOM_CAT_SENTINEL });

    expect(stub.sentMessages[0].msg.isCustom).toBe(true);
  });

  it('responds { ok: false } and returns false when src is missing', () => {
    const sendResponse = vi.fn();
    const returned = Messages[ACTIONS.SELECT_CAT]({}, {}, sendResponse);

    expect(returned).toBe(false);
    expect(sendResponse).toHaveBeenCalledWith({ ok: false });
  });
});

describe('Messages[UPLOAD_CUSTOM_CAT]', () => {
  it('persists the upload, sets the sentinel, and broadcasts CHANGE_CAT_IMAGE', async () => {
    const base64 = 'data:image/gif;base64,XYZ';

    const response = await invoke(ACTIONS.UPLOAD_CUSTOM_CAT, { base64 });

    expect(response).toEqual({ ok: true });
    expect(stub.localStore[STORAGE_KEYS.CUSTOM_USER_CAT]).toBe(base64);
    expect(stub.syncStore[STORAGE_KEYS.SELECTED_CAT]).toBe(CUSTOM_CAT_SENTINEL);
    expect(stub.sentMessages).toEqual([
      { id: 1, msg: { action: ACTIONS.CHANGE_CAT_IMAGE, src: CUSTOM_CAT_SENTINEL, isCustom: true } },
    ]);
  });

  it('responds { ok: false } and returns false when base64 is missing', () => {
    const sendResponse = vi.fn();
    const returned = Messages[ACTIONS.UPLOAD_CUSTOM_CAT]({}, {}, sendResponse);

    expect(returned).toBe(false);
    expect(sendResponse).toHaveBeenCalledWith({ ok: false });
  });
});
