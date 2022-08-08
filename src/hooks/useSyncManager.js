import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import localForage from "localforage";

const id_ = (loc) => (tag) => `${loc}.${tag}`;

export const useSyncManager = () => {
  const location = useLocation();
  const id = id_(location.pathname);

  const getSyncReg = useCallback(
    async (fetchTag) => {
      // Open data store
      const dataStore = localStorage.getItem("sync-store");
      if (!dataStore) {
        return false;
      }

      return !!dataStore[id(fetchTag)];
    },
    [id]
  );

  const registerSyncTask = useCallback(
    async (fetchTag, fetchConfig, replace = false) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        // Open data store
        let dataStore = await localForage.getItem("sync-store");
        if (!dataStore) {
          dataStore = {};
        }

        // Get service worker
        const sw = await navigator.serviceWorker.ready;

        let data = [fetchConfig];
        // Get the item if replace flag is false
        if (!replace) {
          const syncData = dataStore[id(fetchTag)];
          if (syncData) {
            data = [...syncData, fetchConfig];
          }
        }

        // Add fetch data to key
        dataStore[id(fetchTag)] = data;

        // Save data store to localeStorage
        await localForage.setItem("sync-store", dataStore);

        // Register Sync Task
        await sw.sync.register("sync-outgoing-request");

        return true;
      }
      return false;
    },
    [id]
  );

  return { getSyncReg, registerSyncTask };
};
