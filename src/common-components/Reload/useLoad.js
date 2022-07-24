import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useLoad = () => {
  const currentPath = useLocation().pathname;
  const navigate = useNavigate();

  // TODO: Test load function in useEffect. It may create infinate loop
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
