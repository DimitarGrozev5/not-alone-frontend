import { useReducer, useRef } from "react";
import produce from "immer";

const tripReducer = (state, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case "CHANGE_NAME":
        draft.name = action.payload;
        break;

      default:
        break;
    }
  });

export const useManageTrip = () => {
  const [trip, dispatch] = useReducer(tripReducer, {
    name: "",
    trips: [
      {
        type: "StopTextDescription",
        data: { placeName: "" },
        duration: 0,
      },
    ],
    watchers: [],
  });

  const actions = useRef({
    changeName: (value) => dispatch({ type: "CHANGE_NAME", payload: value }),
  }).current;

  return { trip, actions };
};
