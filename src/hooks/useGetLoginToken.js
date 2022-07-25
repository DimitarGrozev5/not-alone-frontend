import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../redux-store/userSlice";

export const useGetLoginToken = () => {
  const dispatch = useDispatch();

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
  }, [isLoggedIn, dispatch]);
};
