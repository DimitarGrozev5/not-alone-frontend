import { useEffect } from "react";
import { useLongPress } from "../../hooks/useLongPress";
import { useSState } from "../../hooks/useSState";

export const useHint = ({ hintDelay = 2000, longPressDelay = 300 } = {}) => {
  const longPressEvents = useLongPress(longPressDelay);
  const [showHint, setShowHint, { passValueHandler: setShowHintTo }] =
    useSState(false, { preventDefault: false });
  useEffect(() => {
    let t;
    if (showHint) {
      t = setTimeout(() => {
        setShowHint(false);
      }, hintDelay);
    }

    return () => clearTimeout(t);
  }, [showHint]);

  return [showHint, setShowHintTo, longPressEvents];
};
