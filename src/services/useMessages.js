import { useRef } from "react";

const useMessages = () => {
  const methods = useRef({
    alert: (msg) => alert(msg),
    confirm: (msg) => window.confirm(msg),
  });
  return methods.current;
};

export default useMessages;
