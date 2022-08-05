import { useCallback, useEffect, useState } from "react";
import { useHttpClient } from "./useHttpClient";

export const useLoadPageData = (
  loadUrl,
  { auth = true, getCache = false, loadIfTrue = true } = {}
) => {
  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  const [dataSource, setDataSource] = useState("");

  const [data, setData] = useState(null);
  useEffect(() => {
    if (!data && loadIfTrue) {
      (async () => {
        try {
          let networkLoaded = false;
          // Get data from cache
          if ("caches" in window && getCache) {
            caches
              .match(process.env.REACT_APP_BACKEND_API + loadUrl)
              .then((response) => {
                if (response && response.ok) {
                  return response.json();
                }
                setDataSource("no-data");
                throw new Error();
              })
              .then((response) => {
                if (!networkLoaded) {
                  setData(response);
                  setDataSource("cache");
                }
              })
              .catch();
          }

          // Get data from network
          const d = await sendRequest(loadUrl, { auth });
          networkLoaded = true;
          setData(d);
          setDataSource("network");
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [data, loadUrl, auth, getCache, loadIfTrue, sendRequest]);

  const reloadData = useCallback(() => setData(null), []);

  return {
    data,
    reloadData,
    dataSource,
    offline: dataSource !== "network",
    isLoading,
    error,
    sendRequest,
    clearError,
    setError,
  };
};
