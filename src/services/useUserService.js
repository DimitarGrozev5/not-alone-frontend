import { useDispatch } from "react-redux";
import { userActions } from "../redux-store/userSlice";
import { sanitizePhone } from "../utils/data-sanitizition";
import { LoadStatus } from "../data-types/LoadStatus";
import { useRef } from "react";
import { baseUrl } from "../constants/baseUrl";

const useUserService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    register: async ({ email, name, phone, password }) => {
      const response = await fetch(baseUrl + "users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, phone, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // {
      //   userId,
      //   email,
      //   token,
      // }

      // Save token to local storage
      localStorage.setItem("jwt", JSON.stringify(responseData));

      dispatch(userActions.updateAccessToken(responseData.token));
    },
    login: async ({ email, password }) => {
      const response = await fetch(baseUrl + "users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // {
      //   userId,
      //   email,
      //   token,
      // }

      // Save token to local storage
      localStorage.setItem("jwt", JSON.stringify(responseData));

      dispatch(userActions.updateAccessToken(responseData.token));
    },
    logout: async () => {
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // Send Logout request
      const response = await fetch(baseUrl + "users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userData.token }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }

      // Remove token from local storage and Redux
      localStorage.removeItem("jwt");
      dispatch(userActions.logout());
    },

    getUserData: async () => {
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // Send Logout request
      const response = await fetch(baseUrl + "users/" + userData.userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      return responseData;
    },
    findUnknownUsers: async (query) => {
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // const pf = sanitizePhone(query);

      // Send Logout request
      const response = await fetch(
        baseUrl + "users?query=" + encodeURIComponent(query),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      return responseData.notConnected;
    },
    findAllUsers: async (query) => {
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // const pf = sanitizePhone(query);

      // Send Logout request
      const response = await fetch(
        baseUrl + "users?query=" + encodeURIComponent(query),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userData.token,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      return responseData;
    },
  });
  return methods.current;
};

export default useUserService;
