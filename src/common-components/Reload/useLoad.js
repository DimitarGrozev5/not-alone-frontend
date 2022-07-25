import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useLoad = () => {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();

  const load = useCallback(
    (targetPath) => {
      if (targetPath !== currentPath) {
        navigate(targetPath);
      } else {
        navigate(`/reload?path=${encodeURIComponent(currentPath)}`);
      }
    },
    [currentPath, navigate]
  );

  return load;
};
