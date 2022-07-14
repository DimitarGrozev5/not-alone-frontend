import { useRef, useState } from "react";

export const useTState = (init) => {
  const [state, setState] = useState(init);
  const handler = useRef((e) => {
    if (e) {
      e?.preventDefault();
    }
    setState((s) => !s);
  });
  return [state, handler.current];
};
