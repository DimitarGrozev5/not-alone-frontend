import { useRef, useState } from "react";

export const useSState = (value, { preventDefault = true } = {}) => {
  const [state, setState] = useState(value);
  const handlers = useRef({
    onChangeHandler: (event) => setState(event.target.value),
    passValueHandler: (val) => (event) => {
      if (event && event.preventDefault) {
        preventDefault && event.preventDefault();
      }
      setState(val);
    },
    toggleHandler: (event) => {
      if (event && event.preventDefault && event?.target.type !== "checkbox") {
        preventDefault && event.preventDefault();
      }
      setState((val) => !val);
    },
  });

  return [state, setState, handlers.current];
};
