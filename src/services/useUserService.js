import { useDispatch } from "react-redux";
import { userActions } from "../redux-store/userSlice";
import { sanitizePhone } from "../utils/data-sanitizition";
import { LoadStatus } from "../data-types/LoadStatus";
import { useRef } from "react";

const useUserService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
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
            phone: "088 123 1235",
          },
        ],
      };
    },
    findUserByPhone: async (phoneFragment) => {
      const pf = sanitizePhone(phoneFragment);

      const DUMMY_PHONES = [
        { id: 0, phone: "0881231234", name: "Пешо Някойси" },
        { id: 1, phone: "0881234321", name: "Фончо Две" },
        { id: 2, phone: "0883214321", name: "Фончо Ино" },
      ];

      const results = DUMMY_PHONES.filter((p) => p.phone.startsWith(pf)).slice(
        0,
        5
      );

      const wrapedResults = results.length
        ? new LoadStatus.Loaded(results)
        : new LoadStatus.Empty();

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.3) {
            resolve(new LoadStatus.Error("Не могат да се заредят подсказки"));
          }
          resolve(wrapedResults);
        }, Math.random() * 1000);
      });
    },
    requestConnection: async (userId) => {
      return Math.random() < 0.2
        ? new LoadStatus.Error("Няма човек с този телефон")
        : new LoadStatus.Loaded("Заявката е изпратена");
    },
  });
  return methods.current;
};

export default useUserService;
