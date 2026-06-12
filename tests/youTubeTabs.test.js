import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { YOUTUBE_URL_PATTERNS } from '../src/js/consts.js';
import { notifyYouTubeTabs, reloadYouTubeTabs } from '../src/js/background/services/YouTubeTabs.js';
import { createChromeStub } from './helpers/chromeStub.js';

let stub;

afterEach(() => {
  delete globalThis.chrome;
});

describe('notifyYouTubeTabs', () => {
  beforeEach(() => {
    stub = createChromeStub({ tabs: [{ id: 1 }, { id: 2 }] });
    globalThis.chrome = stub.chrome;
  });

  it('queries tabs filtered by YOUTUBE_URL_PATTERNS', async () => {
    await notifyYouTubeTabs({ action: 'PING' });

    expect(stub.queryCalls).toEqual([{ url: YOUTUBE_URL_PATTERNS }]);
  });

  it('sends the message to every tab that has an id', async () => {
    await notifyYouTubeTabs({ action: 'PING', payload: 42 });

    expect(stub.sentMessages).toEqual([
      { id: 1, msg: { action: 'PING', payload: 42 } },
      { id: 2, msg: { action: 'PING', payload: 42 } },
    ]);
  });

  it('skips tabs without an id', async () => {
    stub = createChromeStub({ tabs: [{ id: 1 }, {}, { id: 3 }] });
    globalThis.chrome = stub.chrome;

    await notifyYouTubeTabs({ action: 'PING' });

    expect(stub.sentMessages.map(m => m.id)).toEqual([1, 3]);
  });

  it('swallows sendMessage rejections (tab without content script)', async () => {
    stub = createChromeStub({ tabs: [{ id: 1 }, { id: 2 }], failingTabIds: [1] });
    globalThis.chrome = stub.chrome;

    await expect(notifyYouTubeTabs({ action: 'PING' })).resolves.toBeUndefined();

    expect(stub.sentMessages.map(m => m.id)).toEqual([1, 2]);
  });
});

describe('reloadYouTubeTabs', () => {
  beforeEach(() => {
    stub = createChromeStub({ tabs: [{ id: 11 }, { id: 22 }] });
    globalThis.chrome = stub.chrome;
  });

  it('queries tabs filtered by YOUTUBE_URL_PATTERNS', async () => {
    await reloadYouTubeTabs();

    expect(stub.queryCalls).toEqual([{ url: YOUTUBE_URL_PATTERNS }]);
  });

  it('reloads every tab that has an id', async () => {
    await reloadYouTubeTabs();

    expect(stub.reloadedTabIds).toEqual([11, 22]);
  });

  it('skips tabs without an id', async () => {
    stub = createChromeStub({ tabs: [{ id: 11 }, {}, { id: 33 }] });
    globalThis.chrome = stub.chrome;

    await reloadYouTubeTabs();

    expect(stub.reloadedTabIds).toEqual([11, 33]);
  });
});
