import { useRef, useState } from "react";

export const useHState = (init) => {
  const [state, setState] = useState(init);
  const handler = useRef((value) => () => setState(value));
  return [state, handler.current];
};
