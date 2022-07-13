import { useReducer, useRef } from "react";
import produce from "immer";
import { nanoid } from "nanoid";

const txtStop = "StopTextDescription";

// Reducer that uses immer produce to update the trip state
const tripReducer = (state, action) =>
  produce(state, (draft) => {
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
        const i = draft.stops.findIndex((s) => s.id === action.payload);
        draft.stops.splice(i, 1);
        break;

      case "CHANGE_STOP_TEXT":
        draft.stops.find((s) => s.id === action.payload.id).data.stopName =
          action.payload.value;
        break;

      case "CHANGE_STOP_DURATION":
        draft.stops.find((s) => s.id === action.payload.id).data.duration =
          action.payload.value;
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
    watchers: [],
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
  }).current;

  return { trip, actions };
};
