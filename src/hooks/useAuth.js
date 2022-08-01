import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import { userActions } from "../redux-store/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Check if access token is in local storage
  useEffect(() => {
    let userData = null;
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        return;
      }
      userData = JSON.parse(jwt);

      // Logout if token is expired
      const exp = jwt_decode(userData.token).exp;
      if (exp * 1000 < +new Date()) {
        throw new Error("Expired token");
      }
    } catch (err) {
      console.log(err);
      localStorage.removeItem("jwt");
      dispatch(userActions.updateAccessToken(null));
    }

    // Set token
    if (userData) {
      dispatch(userActions.updateAccessToken(userData.token));
    }
  }, [isLoggedIn, dispatch]);
};
