import { useCallback, useEffect, useState } from "react";
import { useHttpClient } from "./useHttpClient";

export const useLoadPageData = (
  loadUrl,
  { auth = true, getCache = false } = {}
) => {
  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  // const [source, setSource] = useState("");

  const [data, setData] = useState(null);
  useEffect(() => {
    if (!data) {
      (async () => {
        try {
          const d = await sendRequest(loadUrl, { auth });
          setData(d);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [data, loadUrl, auth, sendRequest]);

  const reloadData = useCallback(() => setData(null), []);

  return {
    data,
    reloadData,
    isLoading,
    error,
    sendRequest,
    clearError,
    setError,
  };
};
