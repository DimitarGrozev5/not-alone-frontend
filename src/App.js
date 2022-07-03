import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import PageTemplate from "./pages/PageTemplate/PageTemplate";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { userActions } from "./redux-store/userSlice";
import HomeHub from "./pages/HomeHub/HomeHub";
import useUserService from "./services/useUserService";
import useMessages from "./services/useMessages";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoggedInTemplate from "./pages/LogedInTemplate/LoggedInTemplate";
import { useRequestsService } from "./services/useRequestsService";
import { requestActions } from "./redux-store/requestsSlice";

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
  }, [isLoggedIn, userService, errMsg, dispatch]);

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
          <Route path="/" element={<LoggedInTemplate />}>
            <Route index element={<Navigate to="/planned-trips" />} />
            <Route path="/planned-trips" element={<HomeHub />} />
            <Route path="/watching" element={<HomeHub />} />
            <Route path="/ongoing-trip" element={<HomeHub />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Route>
      )}
    </Routes>
  );
}

export default App;

/* <Routes>
      {isLogged && (
        <Route path="/trainer" element={<PageTemplate />}>
          <Route index element={<Navigate to="trainer" />} />
          <Route path="login" element={<Navigate to="/" />} />
          <Route path="trainer" element={<TrainerHub />}></Route>
          <Route path="trainer/add-workout" element={<AddWorkout />} />
          <Route path="trainer/:workout" element={<DoWorkout />} />
          <Route path="*" element={<Navigate to="trainer" />} />
        </Route>
      )}
      {!isLogged && (
        <Route path="/trainer" element={<PageTemplate />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      )}
  </Routes> */
