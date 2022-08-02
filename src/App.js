import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import PageTemplate from "./components/PageTemplate/PageTemplate";
import HomePage from "./components/HomePage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PlannedTrips from "./components/PlannedTrips/PlannedTrips";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import PlanTrip from "./components/PlanTrip/PlanTrip";
import Watching from "./components/Watching/Watching";
import WatchTrip from "./components/WatchTrip/WatchTrip";
import OngoingTrip from "./components/OngoingTrip/OngoingTrip";
import { usePersistRoute } from "./hooks/usePersistRoute";
import Reload from "./common-components/Reload/Reload";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./hooks/useAuth";
// import { useGPSRecorder } from "./hooks/useGPSRecorder";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Get token from local storage
  useAuth();

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
        <Route path="/" element={<PageTemplate />}>
          <Route index element={<Navigate to="/profile" />} />
          <Route path="/planned-trips" element={<PlannedTrips />} />
          <Route path="/watching" element={<Watching />} />
          <Route path="/ongoing-trip" element={<OngoingTrip />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/plan-trip" element={<PlanTrip mode="create" />} />
          <Route
            path="/planned-trips/:tripId"
            element={<PlanTrip mode="edit" />}
          />
          <Route path="/watch/:tripId" element={<WatchTrip />} />
          <Route
            path="/ongoing-trip/:tripId"
            element={<PlanTrip mode="view" />}
          />
          <Route path="/reload" element={<Reload />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
