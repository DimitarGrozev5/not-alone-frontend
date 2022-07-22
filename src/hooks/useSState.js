import { useRef, useState } from "react";

export const useSState = (value) => {
  const [state, setState] = useState(value);
  const handlers = useRef({
    onChangeHandler: (event) => setState(event.target.value),
    passValueHandler: (val) => (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      setState(val);
    },
    toggleHandler: (event) => {
      if (event && event.preventDefault && event?.target.type !== "checkbox") {
        event.preventDefault();
      }
      setState((val) => !val);
    },
  });

  return [state, setState, handlers.current];
};
