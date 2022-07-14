import { useReducer, useRef } from "react";
import produce from "immer";
import { nanoid } from "nanoid";

const txtStop = "StopTextDescription";

// Reducer that uses immer produce to update the trip state
const tripReducer = (state, action) =>
  produce(state, (draft) => {
    let i;
    switch (action.type) {
      case "CHANGE_NAME":
        draft.name = action.payload;
        break;

      case "CHANGE_FIRST_STOP":
        draft.stops[0].data.stopName = action.payload;
        break;

      case "APPEND_STOP":
        draft.stops.push({
          id: nanoid(),
          type: txtStop,
          data: {
            stopName: "",
          },
          duration: 0,
        });
        break;

      case "DELETE_STOP":
        i = draft.stops.findIndex((s) => s.id === action.payload);
        draft.stops.splice(i, 1);
        break;

      case "CHANGE_STOP_TEXT":
        draft.stops.find((s) => s.id === action.payload.id).data.stopName =
          action.payload.value;
        break;

      case "CHANGE_STOP_DURATION":
        const t = action.payload.value;
        draft.stops.find((s) => s.id === action.payload.id).duration =
          t < 0 ? 0 : t;
        break;

      case "ADD_WATCHER":
        // Add watcher only if it's not in the list
        i = draft.watchers.new.find((w) => w.data.id === action.payload.id);
        if (!i) {
          draft.watchers.new.push({
            id: nanoid(),
            data: action.payload,
          });
        }
        break;
      case "REMOVE_WATCHER":
        i = draft.stops.findIndex((s) => s.id === action.payload);
        draft.stops.splice(i, 1);
        break;

      default:
        break;
    }
  });

// Hook code
export const useManageTrip = () => {
  // Setup reducer and initial state
  const [trip, dispatch] = useReducer(tripReducer, {
    name: "",
    stops: [
      {
        id: nanoid(),
        type: txtStop,
        data: { stopName: "" },
        duration: 0,
      },
    ],
    watchers: {
      confirmed: [
        { id: nanoid(), name: "Пешо1", phone: "0885131547" },
        { id: nanoid(), name: "Пешо2", phone: "0885131548" },
        { id: nanoid(), name: "Пешо3", phone: "0885131549" },
      ],
      pending: [
        { id: nanoid(), name: "Стамат", phone: "0885131541" },
        { id: nanoid(), name: "Генади", phone: "0885131542" },
        { id: nanoid(), phone: "0885131543" },
      ],
      new: [
        // { id: nanoid(), name: "Стамат1", phone: "0885131544" },
        // { id: nanoid(), phone: "0885131545" },
      ],
    },
  });

  // Action creators
  const actions = useRef({
    changeName: (value) => dispatch({ type: "CHANGE_NAME", payload: value }),
    stops: {
      changeFirstStop: (value) =>
        dispatch({ type: "CHANGE_FIRST_STOP", payload: value }),

      appendStop: () => dispatch({ type: "APPEND_STOP" }),
      deleteStop: (id) => () => dispatch({ type: "DELETE_STOP", payload: id }),

      changeText: (id) => (value) =>
        dispatch({ type: "CHANGE_STOP_TEXT", payload: { id, value } }),
      changeDuration: (id) => (value) =>
        dispatch({ type: "CHANGE_STOP_DURATION", payload: { id, value } }),
    },
    watchers: {
      addNewWatcher: (value) =>
        dispatch({ type: "ADD_WATCHER", payload: value }),
      removeNewWatcher: (value) =>
        dispatch({ type: "REMOVE_WATCHER", payload: value }),
    },
  }).current;

  return { trip, actions };
};
