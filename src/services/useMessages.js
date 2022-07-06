import { useRef } from "react";

const useMessages = () => {
  const methods = useRef({
    alert: async (msg) => alert(msg),
    confirm: async (msg) => window.confirm(msg),
  });
  return methods.current;
};

export default useMessages;
