/*
TODO:
Add a desctop layout
Add a /redirect/:to route to handle page reloads
Use window focus to decide when to record gps data
Use battery api to send battery information to the backend
Push notifications to remind user to open the app and save the gps location
Use Web connection api to send information about user connectivity
Use background sync
Cash static assets
Cash dynamic assets
Add maping functionality
*/

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import "./App.css";
import PageTemplate from "./pages/PageTemplate/PageTemplate";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { userActions } from "./redux-store/userSlice";
import PlannedTrips from "./pages/PlannedTrips/PlannedTrips";
import useUserService from "./services/useUserService";
import useMessages from "./services/useMessages";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoggedInTemplate from "./pages/LogedInTemplate/LoggedInTemplate";
import { useRequestsService } from "./services/useRequestsService";
import PlanTrip from "./pages/PlanTrip/PlanTrip";
import Watching from "./pages/Watching/Watching";
import WatchTrip from "./pages/WatchTrip/WatchTrip";
import OngoingTrip from "./pages/OngoingTrip/OngoingTrip";
import { usePersistRoute } from "./hooks/usePersistRoute";
import { notificationActions } from "./redux-store/notificationsSlice";
import Reload from "./components/Reload/Reload";
import { useLoad } from "./components/Reload/useLoad";

function App() {
  const dispatch = useDispatch();
  const userService = useUserService();
  const requestsService = useRequestsService();
  const errMsg = useMessages();
  const load = useLoad();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Check if access token is in local storage
  useEffect(() => {
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem("jwt"));
    } catch (err) {
      localStorage.removeItem("jwt");
    }
    // Get token
    if (userData) {
      dispatch(userActions.updateAccessToken(userData.token));
    }
  }, [isLoggedIn, userService, requestsService, errMsg, dispatch]);

  // Save current route to LocalStorage and retreive it on first load
  usePersistRoute();

  // Setup WebSocket connection for receiving notifications
  const [reloadPaths, setReloadPaths] = useState([]);
  const currentPath = useLocation().pathname;
  useEffect(() => {
    // console.log(reloadPaths);
    if (reloadPaths.includes(currentPath)) {
      setReloadPaths([]);
      load(currentPath);
    } else if (reloadPaths.length) {
      setReloadPaths([]);
    }
  }, [currentPath, load, reloadPaths]);
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const ws = new WebSocket("ws://localhost:8999");

    ws.onopen = function (event) {
      // When the connection opens, send user credentials
      ws.send(JSON.stringify({ token: isLoggedIn }));
    };

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

    return () => ws.close();
  }, [isLoggedIn, dispatch]);

  return (
    <Routes>
      {!isLoggedIn && (
        <Route path="/" element={<PageTemplate />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
      {isLoggedIn && (
        <>
          <Route path="/" element={<PageTemplate />}>
            <Route path="/" element={<LoggedInTemplate />}>
              <Route index element={<Navigate to="/planned-trips" />} />
              <Route path="/planned-trips" element={<PlannedTrips />} />
              <Route path="/watching" element={<Watching />} />
              <Route path="/ongoing-trip" element={<OngoingTrip />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/plan-trip" element={<PlanTrip mode="create" />} />
              <Route
                path="/planned-trips/:tripId"
                element={<PlanTrip mode="edit" />}
              />
              {/* <Route
              path="/watching/:tripId"
              element={<PlanTrip mode="view" />}
            /> */}
              <Route path="/watch/:tripId" element={<WatchTrip />} />
              <Route
                path="/ongoing-trip/:tripId"
                element={<PlanTrip mode="view" />}
              />
              <Route path="/reload" element={<Reload />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
