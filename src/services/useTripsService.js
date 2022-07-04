import { useRef } from "react";
import { useDispatch } from "react-redux";
import { stopTypes } from "../data-types/trip-data";

export const useTripsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    postNewTrip: async (data) => {
      return true;
    },
    getAllTrips: async () => {
      return [
        {
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
            
          ],
        },
      ];
    },
  });

  return methods.current;
};
