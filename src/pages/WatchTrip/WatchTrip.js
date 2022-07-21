import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import StopsMonitor from "../../components/StopsMonitor/StopsMonitor";
import { useTimeLeft } from "../../hooks/useTimeLeft";
import styles from "./WatchTrip.module.css";

const WatchTrip = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [trip, setTrip] = useState(null);
  const tripId = useParams().tripId;

  useEffect(() => {
    if (!trip) {
      const getData = async () => {
        try {
          const { trip: tripResult } = await sendRequest(
            `trips/watching/${tripId}`,
            null,
            { auth: true }
          );
          setTrip(tripResult);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }
  }, [sendRequest, tripId, trip]);

  const timeLeft = useTimeLeft(trip?.tripStatus.dueBy);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}

      {trip && (
        <>
          <DataCard>
            <h2>Информация за пътуването</h2>
          </DataCard>
          <DataCard>
            <StopsMonitor
              stops={trip.stops}
              nextStop={trip.tripStatus.nextStop}
            >
              {trip.tripStatus.status === "ONGOING" && (
                <>
                  <div>
                    {trip.owner.name} се очаква да пристигне до {timeLeft}
                  </div>
                </>
              )}
              {trip.tripStatus.status === "PAUSED" && (
                <>
                  <div>{trip.owner.name} е в почивка</div>
                </>
              )}
              {(trip.tripStatus.status === "LATE" ||
                trip.tripStatus.status === "VERY_LATE") && (
                <>
                  {trip.owner.name} закъснява с {timeLeft}.
                </>
              )}
              {trip.tripStatus.status === "FINISHED" && (
                <>{trip.owner.name} стигна до крайната си дестинация</>
              )}
            </StopsMonitor>
          </DataCard>

          {trip.tripStatus.status === "LATE" && (
            <DataCard>
              {trip.owner.name} закъснява. Насърчаваме Ви да се свържете с него
              по един от следните начини:
              <ul>
                <li>
                  <span className={styles.accent}>Телефон:</span>{" "}
                  {trip.owner.phone}
                </li>
              </ul>
            </DataCard>
          )}
          {trip.tripStatus.status === "VERY_LATE" && (
            <DataCard>
              {trip.owner.name} закъснява много. Вече имате достъп до
              допълнителна информация
            </DataCard>
          )}
        </>
      )}
    </>
  );
};

export default WatchTrip;
