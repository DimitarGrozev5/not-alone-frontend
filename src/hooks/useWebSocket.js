import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useLoad } from "../common-components/Reload/useLoad";
import { notificationActions } from "../redux-store/notificationsSlice";

export const useWebSocket = () => {
  const load = useLoad();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Setup state for redirecting on update event
  const [reloadPaths, setReloadPaths] = useState([]);
  const currentPath = useLocation().pathname;

  // When the current path matches the Update Action paths, force a reload
  useEffect(() => {
    if (reloadPaths.includes(currentPath)) {
      setReloadPaths([]);
      load(currentPath);
    } else if (reloadPaths.length) {
      setReloadPaths([]);
    }
  }, [currentPath, load, reloadPaths]);

  // Setup WebSocket connection for receiving notifications
  useEffect(() => {
    // If the user is not logged in, exit
    if (!isLoggedIn) {
      return;
    }

    // Start Websocket
    const ws = new WebSocket("ws://localhost:8999");

    // When the connection opens, send user credentials
    ws.onopen = function (event) {
      ws.send(JSON.stringify({ token: isLoggedIn }));
    };

    // When an Event is received, categorize it and performe the proper action
    ws.onmessage = function (event) {
      let data = {};
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        console.log(err);
      }

      switch (data.type) {
        case "NOTIFICATION":
          dispatch(notificationActions.addNotification(data.payload));
          break;

        case "ALERT":
          dispatch(notificationActions.addAlert(data.payload));
          break;

        case "UPDATE":
          switch (data.payload.type) {
            case "WATCHED_ACTIVE_TRIP_UPDATE":
            case "WATCHED_TRIP_UPDATE":
              setReloadPaths([`/watch/${data.payload.targetId}`, "/watching"]);
              break;

            case "TRIP_UPDATE":
              setReloadPaths(["/ongoing-trip"]);
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }
    };

    // When the App dismounts, close the Websocket connection
    return () => ws.close();
  }, [isLoggedIn, dispatch]);
};
