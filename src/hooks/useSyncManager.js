import { useCallback } from "react";
import { useLocation } from "react-router-dom";

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
        let dataStore = localStorage.getItem("sync-store");
        if (dataStore) {
          dataStore = JSON.parse(dataStore);
        } else {
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
        localStorage.setItem("sync-store", JSON.stringify(dataStore));

        // Register Sync Task
        sw.sync.register("sync-outgoing-request");

        return true;
      }
      return false;
    },
    [id]
  );

  return { getSyncReg, registerSyncTask };
};
