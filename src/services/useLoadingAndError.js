import { useState } from "react";
import ErrorModal from "../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../common-components/UIComponents/LoadingSpinner/LoadingSpinner";

export const useLoadingAndError = () => {
  // Setup loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const component = (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal error={error} onClose={setError.bind(null, undefined)} />
      )}
    </>
  );

  return {
    setLoading: () => setIsLoading(true),
    clearLoading: () => setIsLoading(false),
    setError: (err) => setError(err),
    clearError: () => setError(undefined),
    LoadingAndError: component,
  };
};
