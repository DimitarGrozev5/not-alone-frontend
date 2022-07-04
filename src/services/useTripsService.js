import { useRef } from "react";
import { useDispatch } from "react-redux";
import { requestStatus, stopTypes } from "../data-types/trip-data";

export const useTripsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    postNewTrip: async (data) => {
      return true;
    },
    getAllTrips: async () => {
      return [
        {
          id: 0,
          name: "Амбарица 2022",
          stops: [
            { type: stopTypes.TEXT_DESCRIPTION, text: "Варна", duration: 0 },
            {
              type: stopTypes.TEXT_DESCRIPTION,
              text: "Сопот",
              duration: 14400000,
            },
            {
              type: stopTypes.TEXT_DESCRIPTION,
              text: "Амбарица",
              duration: 14400000,
            },
            {
              type: stopTypes.TEXT_DESCRIPTION,
              text: "Голм Купен",
              duration: 14400000,
            },
            {
              type: stopTypes.TEXT_DESCRIPTION,
              text: "Сопот",
              duration: 14400000,
            },
            {
              type: stopTypes.TEXT_DESCRIPTION,
              text: "Варна",
              duration: 14400000,
            },
          ],
          watchers: [
            {
              name: "Бай Иван",
              phone: "0881231234",
              status: requestStatus.ACCEPTED,
            },
            {
              name: "Ганьо",
              phone: "0881234321",
              status: requestStatus.PENDING,
            },
            {
              phone: "0883211234",
              status: requestStatus.PENDING,
            },
          ],
        },
      ];
    },
  });

  return methods.current;
};
