import { useEffect } from "react";
import Button from "../common-components/FormElements/Button/Button";
import DataCard from "../common-components/UIComponents/DataCard/DataCard";
import ErrorModal from "../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import StopsMonitor from "../common-components/StopsMonitor/StopsMonitor";
import { useTimeLeft } from "../hooks/useTimeLeft";
import { useLoadPageData } from "../hooks/useLoadPageData";

const HomePage = (props) => {
  const {
    data: randomTrip,
    reloadData,
    isLoading,
    error,
    clearError,
  } = useLoadPageData("/trips/random", { auth: false });

  const [dt, timeLeft] = useTimeLeft(randomTrip?.tripStatus.dueBy);
  useEffect(() => {
    if (
      (dt < -65 * 1000 && randomTrip?.tripStatus.status === "ONGOING") ||
      (dt < -1 * 60 * 60 * 1000 + 5000 &&
        randomTrip?.tripStatus.status === "LATE")
    ) {
      // setRandomTrip(null);
      reloadData();
    }
  }, [dt, randomTrip?.tripStatus.status, reloadData]);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <DataCard expand>
        <div>
          <Button to="/login">Login</Button>
          <Button to="/register">Register</Button>
        </div>
        {randomTrip && (
          <>
            <h2>{randomTrip.allActiveTrips} активни пътувания в момента</h2>
            <h3>Ето едно от тях:</h3>
            <StopsMonitor
              stops={randomTrip.stops}
              nextStop={randomTrip.tripStatus.nextStop}
            >
              {randomTrip.tripStatus.status === "ONGOING" && (
                <>
                  <div>Потребителят се очаква да пристигне до {timeLeft}</div>
                </>
              )}
              {randomTrip.tripStatus.status === "PAUSED" && (
                <>
                  <div>Потребителят е в почивка</div>
                </>
              )}
              {(randomTrip.tripStatus.status === "LATE" ||
                randomTrip.tripStatus.status === "VERY_LATE") && (
                <>Потребителят закъснява с {timeLeft}.</>
              )}
              {randomTrip.tripStatus.status === "FINISHED" && (
                <>Потребителят стигна до крайната си дестинация</>
              )}
            </StopsMonitor>
            <h3>{randomTrip.watchers} на брой хора следят прогреса му</h3>
          </>
        )}
      </DataCard>
    </>
  );
};

export default HomePage;
