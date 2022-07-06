import { useRef } from "react";
import { tripStatus, stopTypes } from "../data-types/trip-data";

export const useWatchingService = () => {
  return useRef({
    getAllWatchingAndRequests: async () => {
      return {
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
        requests: [],
      };
    },
  }).current;
};
