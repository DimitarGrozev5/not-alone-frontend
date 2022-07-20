import { useEffect, useState } from "react";
import { timeLeft } from "../../../utils/time";

export const useTimeLeft = (targetTime) => {
  const [left, setLeft] = useState("");

  useEffect(() => {
    let latestRequest;
    const update = () => {
      const text = timeLeft(targetTime);
      setLeft(text);
      latestRequest = requestAnimationFrame(update);
    };
    if (targetTime) {
      update();
    }
    return () => cancelAnimationFrame(latestRequest);
  }, [targetTime]);

  return left;
};
