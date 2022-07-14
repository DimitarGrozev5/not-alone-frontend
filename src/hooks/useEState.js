import { useRef, useState } from "react";

export const useEState = (init) => {
  const [state, setState] = useState(init);
  const handler = useRef((event) =>
    setState(event.target ? event.target.value : event)
  );
  return [state, handler.current];
};
