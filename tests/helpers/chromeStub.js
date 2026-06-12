export function createChromeStub({ sync = {}, local = {}, tabs = [], failingTabIds = [] } = {}) {
  const syncStore = { ...sync };
  const localStore = { ...local };
  const sentMessages = [];
  const reloadedTabIds = [];
  const queryCalls = [];

  const makeStorageArea = store => ({
    get: keys => {
      const out = {};
      const arr = Array.isArray(keys) ? keys : [keys];

      arr.forEach(k => {
        if (k in store) out[k] = store[k];
      });

      return Promise.resolve(out);
    },
    set: data => {
      Object.assign(store, data);

      return Promise.resolve();
    },
  });

  return {
    chrome: {
      storage: {
        sync: makeStorageArea(syncStore),
        local: makeStorageArea(localStore),
      },
      tabs: {
        query: filter => {
          queryCalls.push(filter);

          return Promise.resolve(tabs);
        },
        sendMessage: (id, msg) => {
          sentMessages.push({ id, msg });

          if (failingTabIds.includes(id)) {
            return Promise.reject(new Error('no receiver'));
          }

          return Promise.resolve();
        },
        reload: id => {
          reloadedTabIds.push(id);

          return Promise.resolve();
        },
      },
    },
    syncStore,
    localStore,
    sentMessages,
    reloadedTabIds,
    queryCalls,
  };
}
