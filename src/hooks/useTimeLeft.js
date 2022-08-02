import { useEffect, useState } from "react";
import { timeLeft } from "../utils/time";

export const useTimeLeft = (targetTime) => {
  const [left, setLeft] = useState([0, ""]);

  useEffect(() => {
    let latestRequest;
    const update = () => {
      const [dt, text] = timeLeft(targetTime);
      setLeft([dt, text]);
      latestRequest = requestAnimationFrame(update);
    };
    if (targetTime) {
      update();
    }
    return () => cancelAnimationFrame(latestRequest);
  }, [targetTime]);

  return left;
};
