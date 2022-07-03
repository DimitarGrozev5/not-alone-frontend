import { useDispatch } from "react-redux";
import { userActions } from "../redux-store/userSlice";

const useUserService = () => {
  const dispatch = useDispatch();
  return {
    register: async ({ email, name, phone, password }) => {
      // TODO: Send request to api and get back a JWT
      // For the moment return a dummy value
      const token = "adsadadasdsadsadsadsadasdsadad";

      // Save token to local storage
      localStorage.setItem("jwt", token);

      dispatch(userActions.updateAccessToken(token));
    },
    login: async ({ email, password }) => {
      // TODO: Send request to api and get back a JWT
      // For the moment return a dummy value
      const token = "adsadadasdsadsadsadsadasdsadad";

      // Save token to local storage
      localStorage.setItem("jwt", token);

      dispatch(userActions.updateAccessToken(token));
    },
    logout: async () => {
      localStorage.removeItem("jwt");
      dispatch(userActions.logout());
    },

    getUserData: async (jwt) => {
      // TODO: Send request to fetch user data
      // For the moment return dummy value
      return {
        isLoggedIn: jwt,
        userData: {
          email: "test@example.com",
          name: "Иван Иванов",
          phone: "088 123 1234",
        },
        connections: [
          {
            name: "Петър Петров",
            phone: "088 123 1234",
          },
          {
            name: "Баче Кико",
            phone: "088 123 1234",
          },
        ],
      };
    },
  };
};

export default useUserService;
