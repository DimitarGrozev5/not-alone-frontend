import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const usePersistRoute = () => {
  const navigate = useRef(useNavigate()).current;

  // Save the last route, whenever it changes
  // TODO: Also save the hystory to Local storage
  const currentPath = useLocation().pathname;
  useEffect(() => {
    localStorage.setItem("last-route", currentPath);
  }, [currentPath, navigate]);

  // Navigate to last route, taken from Local Storage
  useEffect(() => {
    const lastRoute = localStorage.getItem("last-route");
    if (lastRoute) {
      navigate(lastRoute);
    }
  }, [navigate]);
};
