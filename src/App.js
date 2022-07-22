import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

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

function App() {
  const navigate = useRef(useNavigate()).current;
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

  // Save the last route, whenever it changes
  // TODO: Also save the hystory to Local storage
  const currentPath = useLocation().pathname;
  useEffect(() => {
    localStorage.setItem("last-route", currentPath);
  }, [currentPath, navigate]);

  // Navigate to last route, taken from Local Storage
  useEffect(() => {
    const lastRoute = localStorage.getItem("last-route");
    if (lastRoute) {
      navigate(lastRoute);
    }
  }, [navigate]);

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
            <Route path="/plan-trip" element={<PlanTrip mode="create" />} />
            <Route
              path="/planned-trips/:tripId"
              element={<PlanTrip mode="edit" />}
            />
            <Route
              path="/watching/:tripId"
              element={<PlanTrip mode="view" />}
            />
            <Route path="/watch/:tripId" element={<WatchTrip />} />
            <Route
              path="/ongoing-trip/:tripId"
              element={<PlanTrip mode="view" />}
            />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
