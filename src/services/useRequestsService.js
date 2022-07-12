import { useRef } from "react";
import { useDispatch } from "react-redux";

export const useRequestsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    getConnectionRequests: async () => {
      return {
        requestsForConnectionSend: [
          { id: 3, phone: "0881231234", name: "Пешо Някойси" },
        ],
        requestsForConnectionReceived: [
          { id: 1, phone: "0881234321", name: "Фончо Две" },
          { id: 2, phone: "0883214321", name: "Фончо Ино" },
        ],
      };
    },
    acceptRequest: async (id) => {
      return true;
    },
    requestConnection: async (userId) => {
      return {};
    },
  });

  return methods.current;
};
