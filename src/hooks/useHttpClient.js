import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../redux-store/userSlice";
import { useSyncManager } from "./useSyncManager";

export const useHttpClient = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const { registerSyncTask } = useSyncManager();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (
      url,
      {
        body = null,
        method,
        headers,
        auth = true,
        notJSON,
        trySync = false,
      } = {}
    ) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      // Setup config object for fetch request
      const config = {};
      const headersObj = {};

      // Set http method
      config.method = "GET";
      if (method) {
        config.method = method;
      }
      if (!method && body && !notJSON) {
        config.method = "POST";
      }

      // Convert body to json and attach it
      if (body) {
        config.body = notJSON ? body : JSON.stringify(body);
      }

      // Set Content-Type to json
      if (!headers?.["Content-Type"] && body && !notJSON) {
        headersObj["Content-Type"] = "application/json";
      }

      // Add Authorization token
      if (auth !== false) {
        headersObj["Authorization"] = "Bearer " + token;
      }

      // Merge provided headers and preconfigured headers
      config.headers = { ...headersObj, ...headers };

      // Attach httpAbort controller
      config.signal = httpAbortCtrl.signal;

      try {
        if (trySync) {
          // Try to use the Sync API
          const syncResult = await registerSyncTask(
            trySync.tag,
            [
              process.env.REACT_APP_BACKEND_API + url,
              {
                method: config.method,
                body: config.body,
                headers: config.headers,
              },
            ],
            trySync.replace
          );

          // If the API is available and the sync task is registered, exit the function
          if (syncResult) {
            // Add a timeout so the loading spinner shows for a bit longer
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
            return true;
          }
        }

        // Fetch data
        const response = await fetch(
          process.env.REACT_APP_BACKEND_API + url,
          config
        );

        // Convert to json
        const responseData = await response.json();

        // Remove http abort controller from list of active controllers
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          // Auto logout if the status code is 401 - Unauthorized
          if (response.status === 401) {
            localStorage.removeItem("jwt");
            dispatch(userActions.logout());
          }

          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        err.name !== "TypeError" && setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [token, dispatch, registerSyncTask]
  );

  useEffect(
    () => () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    },
    []
  );

  const clearError = () => setError(null);

  return { isLoading, error, sendRequest, clearError, setError };
};
