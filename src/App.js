import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import PageTemplate from "./pages/PageTemplate";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { userActions } from "./redux-store/userSlice";
import HomeHub from "./pages/HomeHub/HomeHub";
import useUserService from "./services/useUserService";
import useErrorMessage from "./services/useErrorMessage";

function App() {
  const dispatch = useDispatch();
  const userService = useUserService();
  const errMsg = useErrorMessage();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  console.log(isLoggedIn);

  // Check if access token is in local storage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      userService
        .getUserData(token)
        .then((userData) => dispatch(userActions.updateUserData(userData)))
        .catch((err) => errMsg.alert(err));
    }
  }, [isLoggedIn/* , userService, errMsg, dispatch */]);

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
          <Route index element={<HomeHub />} />
          <Route path="*" element={<Navigate to="/" />} />
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
