import { useEffect, useState } from "react";

import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import styles from "./OngoingTrip.module.css";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import Button from "../../components/FormElements/Button/Button";
import Modal from "../../components/UIComponents/Modal/Modal";
import { useHState } from "../../hooks/useHState";
import { useTimeLeft } from "./hooks/useTimeLeft";

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
          console.log(activeTrip);
          setAllTrips(allTrips);
          setActiveTrip(activeTrip);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }
  }, [allTrips, activeTrip, sendRequest]);

  const sendStartTrip = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`trips/${startTrip._id}/start`, null, {
        method: "POST",
        auth: true,
      });
      setAllTrips(null);
      startTripHandler(null)();
    } catch (err) {
      console.log(err);
    }
  };

  const timeLeft = useTimeLeft(activeTrip?.tripStatus.dueBy);
  const pauseHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`trips/${activeTrip._id}/pause`, null, {
        method: "POST",
        auth: true,
      });
      setAllTrips(null);
      setActiveTrip(null);
    } catch (err) {
      console.log(err);
    }
  };
  const resumeHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`trips/${activeTrip._id}/start`, null, {
        method: "POST",
        auth: true,
      });
      setAllTrips(null);
      setActiveTrip(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      {startTrip && (
        <Modal title="Започване на пътуване" onClose={startTripHandler(null)}>
          <div className={styles["start-trip"]}>
            <h1>{startTrip.name}</h1>
            <div className={styles["start-trip__checkbox"]}>
              <input type={"checkbox"} id="anounce" />
              <label htmlFor="anounce">Съобщи, че тръгваш</label>
            </div>
            <div className={styles["start-trip__checkbox"]}>
              <input type={"checkbox"} id="gps" />
              <label htmlFor="gps">Запазвай GPS данни за прогреса си</label>
            </div>
            <Button onClick={sendStartTrip}>Старт</Button>
          </div>
        </Modal>
      )}

      {activeTrip && (
        <>
          <DataCard>
            <h2>Активно пътуване</h2>
          </DataCard>
          <DataCard>
            <h3>Прогрес</h3>
            <ul className={styles.stops}>
              {activeTrip.stops
                .slice(0, activeTrip.tripStatus.nextStop)
                .map((stop) => (
                  <li key={stop._id} className={styles["past-stop"]}>
                    {stop.data.placeName}
                  </li>
                ))}
              <li className={styles["current-position"]}>
                {activeTrip.tripStatus.status === "ONGOING" && (
                  <>
                    <div>Очаква се да пристигнете до {timeLeft}</div>
                    <div>
                      <Button onClick={pauseHandler}>Пауза</Button>
                      <Button>Ще закъснея</Button>
                    </div>
                  </>
                )}
                {activeTrip.tripStatus.status === "PAUSED" && (
                  <>
                    <div>Пътуването е в почивка</div>
                    <div>
                      <Button onClick={resumeHandler}>Продължи</Button>
                    </div>
                  </>
                )}
              </li>
              {activeTrip.stops
                .slice(activeTrip.tripStatus.nextStop)
                .map((stop) => (
                  <li key={stop._id} className={styles["upcoming-stop"]}>
                    {stop.data.placeName}
                  </li>
                ))}
            </ul>
          </DataCard>
        </>
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
