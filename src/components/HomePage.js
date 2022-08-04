import { useEffect, useState } from "react";
import Button from "../common-components/FormElements/Button/Button";
import DataCard from "../common-components/UIComponents/DataCard/DataCard";
import { useHttpClient } from "../hooks/useHttpClient";
import ErrorModal from "../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import StopsMonitor from "../common-components/StopsMonitor/StopsMonitor";
import { useTimeLeft } from "../hooks/useTimeLeft";

const HomePage = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [randomTrip, setRandomTrip] = useState(null);

  useEffect(() => {
    if (!randomTrip) {
      (async () => {
        try {
          const trip = await sendRequest("/trips/random", { auth: false });
          setRandomTrip(trip);
          console.log(trip);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [randomTrip, sendRequest]);

  const [dt, timeLeft] = useTimeLeft(randomTrip?.tripStatus.dueBy);
  useEffect(() => {
    if (
      (dt < -65 * 1000 && randomTrip?.tripStatus.status === "ONGOING") ||
      (dt < -1 * 60 * 60 * 1000 + 5000 &&
        randomTrip?.tripStatus.status === "LATE")
    ) {
      setRandomTrip(null);
    }
  }, [dt, randomTrip?.tripStatus.status]);

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
