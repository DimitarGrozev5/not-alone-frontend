import { useRef } from "react";
import { useDispatch } from "react-redux";
import { requestStatus, stopTypes } from "../data-types/trip-data";

const DUMMY_TRIPS = [
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

export const useTripsService = () => {
  // eslint-disable-next-line
  const dispatch = useDispatch();
  const methods = useRef({
    postNewTrip: async (data) => {
      return true;
    },
    getAllTrips: async () => {
      return DUMMY_TRIPS;
    },
    getTripById: async (id) => {
      return DUMMY_TRIPS[id];
    },
    updateTrip: async (id) => {
      return true;
    },
    updateTrip: async (id, data) => {
      return true;
    },
    getActiveTrip: async () => {
      // If there is no active trip, return all trips
      // return DUMMY_TRIPS;

      // If there is an active trip, return it
      return { id: 0, name: "Амбарица 2022" };
    },
    startTrip: async (id) => {
      return true;
    },
  });

  return methods.current;
};
