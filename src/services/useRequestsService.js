import { useRef } from "react";
import { useDispatch } from "react-redux";

export const useRequestsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    
  });

  return methods.current;
};
