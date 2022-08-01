import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../redux-store/userSlice";

export const useHttpClient = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [cached, setCached] = useState(false);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (
      url,
      body = null,
      { method, headers, auth, notJSON, getCache } = {}
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
      if (auth) {
        headersObj["Authorization"] = "Bearer " + token;
      }

      // Merge provided headers and preconfigured headers
      config.headers = { ...headersObj, ...headers };

      // Attach httpAbort controller
      config.signal = httpAbortCtrl.signal;

      try {
        // Get data from cache
        if ("caches" in window && getCache) {
          caches
            .match(process.env.REACT_APP_BACKEND_API + url)
            .then((response) => {
              if (response) {
                return response.json();
              }
            })
            .then((response) => {
              setCached(response);
            });
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
        setCached(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [token, dispatch]
  );

  useEffect(
    () => () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    },
    []
  );

  const clearError = () => setError(null);

  return { isLoading, cached, error, sendRequest, clearError, setError };
};
