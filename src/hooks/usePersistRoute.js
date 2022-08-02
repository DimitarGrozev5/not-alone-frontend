import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const usePersistRoute = () => {
  const navigate = useRef(useNavigate()).current;

  // Save the last route, whenever it changes
  const currentPath = useLocation().pathname;
  useEffect(() => {
    sessionStorage.setItem("last-route", currentPath);
  }, [currentPath, navigate]);

  // Navigate to last route, taken from Local Storage
  useEffect(() => {
    const lastRoute = sessionStorage.getItem("last-route");
    if (lastRoute) {
      navigate(lastRoute);
    }
  }, [navigate]);
};
