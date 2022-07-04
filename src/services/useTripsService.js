import { useRef } from "react";
import { useDispatch } from "react-redux";

export const useTripsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    postNewTrip: async (data) => {
      return true;
    },
  });

  return methods.current;
};
