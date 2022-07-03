import { useRef } from "react";
import { useDispatch } from "react-redux";

const useRequestsService = () => {
  const dispatch = useDispatch();
  const methods = useRef({
    
  });

  return methods.current;
};
