import { useState } from "react";

export const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  let t;

  window.addEventListener("resize", (event) => {
    if (t) {
      clearTimeout(t);
    }
    t = setTimeout(() => {
      setWidth(window.innerWidth);
    }, 200);
  });

  return width;
};
