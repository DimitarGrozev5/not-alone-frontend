import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

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
import { requestActions } from "./redux-store/requestsSlice";
import PlanTrip from "./pages/PlanTrip/PlanTrip";
import Watching from "./pages/Watching/Watching";
import WatchTrip from "./pages/WatchTrip/WatchTrip";
import OngoingTrip from "./pages/OngoingTrip/OngoingTrip";

function App() {
  const dispatch = useDispatch();
  const userService = useUserService();
  const requestsService = useRequestsService();
  const errMsg = useMessages();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Check if access token is in local storage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      userService
        .getUserData(token)
        .then((userData) => dispatch(userActions.updateUserData(userData)))
        .catch((err) => errMsg.alert(err.message));
      requestsService
        .getConnectionRequests()
        .then((requests) => dispatch(requestActions.updateRequests(requests)))
        .catch((err) => errMsg.alert(err.message));
    }
  }, [isLoggedIn, userService, requestsService, errMsg, dispatch]);

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
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
            <Route path="/plan-trip" element={<PlanTrip />} />
            <Route path="/planned-trips/:tripId" element={<PlanTrip edit />} />
            <Route path="/watch/:tripId" element={<WatchTrip />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
