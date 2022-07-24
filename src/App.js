/*
TODO:
Remove Services

Use window focus to decide when to record gps data
Use battery api to send battery information to the backend
Push notifications to remind user to open the app and save the gps location
Use Web connection api to send information about user connectivity
Use background sync
Cash static assets
Cash dynamic assets
Add maping functionality
*/

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import PageTemplate from "./components/PageTemplate/PageTemplate";
import HomePage from "./components/HomePage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { userActions } from "./redux-store/userSlice";
import PlannedTrips from "./components/PlannedTrips/PlannedTrips";
import useUserService from "./services/useUserService";
import useMessages from "./services/useMessages";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import { useRequestsService } from "./services/useRequestsService";
import PlanTrip from "./components/PlanTrip/PlanTrip";
import Watching from "./components/Watching/Watching";
import WatchTrip from "./components/WatchTrip/WatchTrip";
import OngoingTrip from "./components/OngoingTrip/OngoingTrip";
import { usePersistRoute } from "./hooks/usePersistRoute";
import Reload from "./common-components/Reload/Reload";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const dispatch = useDispatch();
  const userService = useUserService();
  const requestsService = useRequestsService();
  const errMsg = useMessages();

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

  // Start WebSocket listener
  useWebSocket();

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
        </>
      )}
    </Routes>
  );
}

export default App;
