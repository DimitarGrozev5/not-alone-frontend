import { useEffect, useState } from "react";

import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import styles from "./OngoingTrip.module.css";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import Button from "../../components/FormElements/Button/Button";
import Modal from "../../components/UIComponents/Modal/Modal";
import { useHState } from "../../hooks/useHState";

const OngoingTrip = () => {
  const [allTrips, setAllTrips] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [startTrip, startTripHandler] = useHState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    if (!allTrips && !activeTrip) {
      const getData = async () => {
        try {
          const { allTrips, activeTrip } = await sendRequest(
            "trips/active",
            null,
            { auth: true }
          );
          setAllTrips(allTrips);
          setActiveTrip(activeTrip);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }
  }, [allTrips, activeTrip, sendRequest]);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      {startTrip && (
        <Modal title="Започване на пътуване" onClose={startTripHandler(null)}>
          <div className={styles["start-trip"]}>
            <h1>{startTrip.name}</h1>
            <div className={styles["start-trip__checkbox"]}>
              <input type={"checkbox"} />
              <label>Съобщи, че тръгваш</label>
            </div>
            <div className={styles["start-trip__checkbox"]}>
              <input type={"checkbox"} />
              <label>Запазвай GPS данни за прогреса си</label>
            </div>
            <Button>Старт</Button>
          </div>
        </Modal>
      )}

      {allTrips && !allTrips.length && <div>Все още нямате пътувания</div>}
      {allTrips && !!allTrips.length && (
        <ul>
          {allTrips.map((trip) => {
            return (
              <DataCard key={trip._id}>
                <h2>{trip.name}</h2>
                <div>
                  {trip.stops.length - 1}{" "}
                  {trip.stops.length === 2 ? "спирка" : "спирки"}
                </div>
                {trip.watchers && (
                  <>
                    <h3>
                      {!trip.watchers.length && "Все още никой не те следи"}
                      {trip.watchers.length === 1 && `1 човек ще те следи`}
                      {trip.watchers.length > 1 &&
                        `${trip.watchers.length} души ще те следят`}
                    </h3>

                    <div>
                      <Button to={`/ongoing-trip/${trip._id}`}>Преглед</Button>
                      {!!trip.watchers.length && (
                        <Button onClick={startTripHandler(trip)}>Старт</Button>
                      )}
                    </div>
                  </>
                )}
              </DataCard>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default OngoingTrip;
