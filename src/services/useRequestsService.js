import { useRef } from "react";
import { useDispatch } from "react-redux";
import { baseUrl } from "../constants/baseUrl";
import { requestTypes } from "../data-types/trip-data";

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
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // Send Request for connection
      const response = await fetch(baseUrl + `requests/${id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }

      return true;
    },
    requestConnection: async (toId) => {
      // Get token
      const userData = JSON.parse(localStorage.getItem("jwt"));

      // Send Request for connection
      const response = await fetch(baseUrl + "requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userData.token,
        },
        body: JSON.stringify({
          from: userData.userId,
          to: toId,
          type: requestTypes.CONNECTION,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }

      return true;
    },
  });

  return methods.current;
};
