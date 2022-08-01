import { useCallback, useRef, useState } from "react";

export const useLongPress = (delay = 300) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef();

  const start = useCallback(
    (onLongPress) => (event) => {
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [delay]
  );

  const clear = useCallback(
    (event) => {
      timeout.current && clearTimeout(timeout.current);
      longPressTriggered && event.preventDefault();
      setLongPressTriggered(false);
    },
    [longPressTriggered]
  );

  const getTouchEvents = useCallback(
    (onLongPress) => ({
      onTouchStart: start(onLongPress),
      onTouchEnd: clear,
      onContextMenu: clear,
    }),
    [start, clear]
  );

  return getTouchEvents;
};