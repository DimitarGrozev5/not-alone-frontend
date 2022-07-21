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
import { useSState } from "../../hooks/useSState";
import DurationPicker from "../../components/DurationPicker/DurationPicker";
import StartTripModal from "./StartTripModal/StartTripModal";

const OngoingTrip = () => {
  const [allTrips, setAllTrips] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);

  const [startTrip, startTripHandler] = useHState(false);
  const [extendTime, setExtendTime, { passValueHandler: extendTimeHandler }] =
    useSState(false);
  const [deleteTrip, setDeleteTrip, { passValueHandler: closeDeleteHandler }] =
    useSState(false);

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
  const tripControlHandler =
    (command, body = null) =>
    async (event) => {
      event.preventDefault();
      try {
        await sendRequest(`trips/${activeTrip._id}/${command}`, body, {
          method: "POST",
          auth: true,
        });
        setAllTrips(null);
        setActiveTrip(null);
      } catch (err) {
        console.log(err);
      }
    };
  const sendExtendTime = (event) => {
    tripControlHandler("extend", { extendTime })(event);
    setExtendTime(false);
  };
  const deleteTripHandler = (del) => async (event) => {
    event.preventDefault();
    if (del) {
      try {
        await sendRequest(`trips/${activeTrip._id}`, null, {
          method: "DELETE",
          auth: true,
        });
        setAllTrips(null);
        setActiveTrip(null);
      } catch (err) {
        console.log(err);
      }
    } else {
      setDeleteTrip(true);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      {startTrip && (
        <StartTripModal
          tripName={startTrip.name}
          onClose={startTripHandler(null)}
          onStart={sendStartTrip}
        />
      )}
      {extendTime !== false && (
        <Modal title="Удължаване на времето" onClose={extendTimeHandler(false)}>
          <DurationPicker
            duration={extendTime}
            onChange={setExtendTime}
            mode="create"
          />
          <Button onClick={sendExtendTime}>Удължи</Button>
        </Modal>
      )}
      {deleteTrip && (
        <Modal title="Внимание" onClose={closeDeleteHandler(false)}>
          Пътуването е свършило и ще бъде изтрито!
          <Button onClick={closeDeleteHandler(false)}>Не</Button>
          <Button onClick={deleteTripHandler(true)}>Добре</Button>
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
                      <Button onClick={tripControlHandler("pause")}>
                        Пауза
                      </Button>
                      <Button onClick={extendTimeHandler(0)}>
                        Ще закъснея
                      </Button>
                    </div>
                  </>
                )}
                {activeTrip.tripStatus.status === "PAUSED" && (
                  <>
                    <div>Пътуването е в почивка</div>
                    <div>
                      <Button onClick={tripControlHandler("resume")}>
                        Продължи
                      </Button>
                    </div>
                  </>
                )}
                {(activeTrip.tripStatus.status === "LATE" ||
                  activeTrip.tripStatus.status === "VERY_LATE") && (
                  <>
                    Закъснявате с {timeLeft}.
                    {activeTrip.tripStatus.status === "VERY_LATE" &&
                      " Тъй като закъснението е голямо, всички ваши данни са достъпни за наблюдателите Ви."}{" "}
                    Може да{" "}
                    <Button onClick={extendTimeHandler(0)}>
                      удължите времето
                    </Button>
                    , ако всичко е наред.
                  </>
                )}
                {activeTrip.tripStatus.status === "FINISHED" && (
                  <>Стигнахте до крайната си дестинация</>
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
          {activeTrip.tripStatus.status !== "FINISHED" && (
            <DataCard>
              <Button stretch onClick={tripControlHandler("next-stop")}>
                Стигнах до следващата спирка
              </Button>
            </DataCard>
          )}
          {activeTrip.tripStatus.status === "FINISHED" && (
            <DataCard>
              <Button stretch onClick={deleteTripHandler(false)}>
                Приключване и изтриване на пътуването
              </Button>
            </DataCard>
          )}
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
