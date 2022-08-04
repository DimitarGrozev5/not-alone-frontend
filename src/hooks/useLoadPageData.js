import { useCallback, useEffect, useState } from "react";
import { useHttpClient } from "./useHttpClient";

export const useLoadPageData = (
  loadUrl,
  { auth = true, getCache = false } = {}
) => {
  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  const [source, setSource] = useState("");

  const [data, setData] = useState(null);
  useEffect(() => {
    if (!data) {
      (async () => {
        try {
          let networkLoaded = false;
          // Get data from cache
          if ("caches" in window && getCache) {
            caches
              .match(process.env.REACT_APP_BACKEND_API + loadUrl)
              .then((response) => {
                if (response) {
                  return response.json();
                }
                setSource("no-data");
              })
              .then((response) => {
                if (!networkLoaded) {
                  setData(response);
                  setSource("cache");
                }
              });
          }

          // Get data from network
          const d = await sendRequest(loadUrl, { auth });
          networkLoaded = true;
          setData(d);
          setSource("network");
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [data, loadUrl, auth, getCache, sendRequest]);

  const reloadData = useCallback(() => setData(null), []);

  return {
    data,
    reloadData,
    source,
    isLoading,
    error,
    sendRequest,
    clearError,
    setError,
  };
};
