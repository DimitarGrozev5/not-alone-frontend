import { useRef } from "react";
import { tripStatus, stopTypes, requestTypes } from "../data-types/trip-data";

const DUMMY_WATCH = {
  watching: [
    {
      id: 0,
      user: {
        id: 0,
        name: "Митко",
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
      tripStatus: { status: tripStatus.PENDING },
    },
    {
      id: 1,
      user: {
        id: 0,
        name: "Драган",
        phone: "0881231234",
      },
      name: "Купен 2023",
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
  ],
  requests: [
    {
      id: 0,
      name: "Хасан",
      phone: "0881231234",
      type: requestTypes.OVERWATCH,
    },
    {
      id: 1,
      name: "Мюмюн",
      phone: "0881231234",
      type: requestTypes.OVERWATCH_AND_CONNECTION,
    },
  ],
};

export const useWatchingService = () => {
  return useRef({
    confirmWatch: async (id) => true,
    denyWatch: async (id) => true,
    getOneTrip: async (id) => {
      return DUMMY_WATCH.watching[id];
    },
    getAllWatchingAndRequests: async () => {
      return DUMMY_WATCH;
    },
  }).current;
};
