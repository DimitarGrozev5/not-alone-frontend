import { useRef } from "react";
import { useDispatch } from "react-redux";
import { requestStatus, stopTypes, tripStatus } from "../data-types/trip-data";

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

const DUMMY_ONGOING = [
  {
    id: 1,
    user: {
      id: 0,
      name: "Драган",
      phone: "0881231234",
    },
    name: "Купен 2023",
    stops: [
      { id: -1, type: stopTypes.TEXT_DESCRIPTION, text: "Варна", duration: 0 },
      {
        id: 0,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 1,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Амбарица",
        duration: 14400000,
      },
      {
        id: 2,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Голм Купен",
        duration: 14400000,
      },
      {
        id: 3,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 4,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Варна",
        duration: 14400000,
      },
    ],
    tripStatus: {
      status: tripStatus.ONGOING,
      nextStop: 1,
      dueBy: +new Date() + 3600000,
    },
  },
  {
    id: 2,
    user: {
      id: 0,
      name: "Петкан",
      phone: "0881231234",
    },
    name: "Амбарица 2022",
    stops: [
      { type: stopTypes.TEXT_DESCRIPTION, text: "Варна", duration: 0 },
      {
        id: 0,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 1,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Амбарица",
        duration: 14400000,
      },
      {
        id: 2,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Голм Купен",
        duration: 14400000,
      },
      {
        id: 3,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 4,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Варна",
        duration: 14400000,
      },
    ],
    tripStatus: {
      status: tripStatus.LATE,
      nextStop: 2,
      dueBy: +new Date() - 3600000,
    },
  },
  {
    id: 3,
    name: "Амбарица 2022",
    user: {
      id: 0,
      name: "Сульо",
      phone: "0881231234",
    },
    stops: [
      { type: stopTypes.TEXT_DESCRIPTION, text: "Варна", duration: 0 },
      {
        id: 0,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 1,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Амбарица",
        duration: 14400000,
      },
      {
        id: 2,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Голм Купен",
        duration: 14400000,
      },
      {
        id: 3,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 4,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Варна",
        duration: 14400000,
      },
    ],
    tripStatus: {
      status: tripStatus.VERY_LATE,
      nextStop: 3,
      dueBy: +new Date() - 7200000,
    },
  },
  {
    id: 4,
    name: "Амбарица 2022",
    user: {
      id: 0,
      name: "Пульо",
      phone: "0881231234",
    },
    stops: [
      { type: stopTypes.TEXT_DESCRIPTION, text: "Варна", duration: 0 },
      {
        id: 0,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 1,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Амбарица",
        duration: 14400000,
      },
      {
        id: 2,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Голм Купен",
        duration: 14400000,
      },
      {
        id: 3,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Сопот",
        duration: 14400000,
      },
      {
        id: 4,
        type: stopTypes.TEXT_DESCRIPTION,
        text: "Варна",
        duration: 14400000,
      },
    ],
    tripStatus: {
      status: tripStatus.PAUSED,
      nextStop: 4,
    },
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
    getActiveTrip: async () => {
      // If there is no active trip, return all trips
      return DUMMY_TRIPS;

      // If there is an active trip, return it
      return DUMMY_ONGOING[0];
    },
    startTrip: async (id) => {
      return true;
    },
  });

  return methods.current;
};
