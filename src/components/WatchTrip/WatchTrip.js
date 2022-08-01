import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import StopsMonitor from "../../common-components/StopsMonitor/StopsMonitor";
import { useTimeLeft } from "../../hooks/useTimeLeft";
import styles from "./WatchTrip.module.css";
import { useSState } from "../../hooks/useSState";
import Button from "../../common-components/FormElements/Button/Button";
import Modal from "../../common-components/UIComponents/Modal/Modal";
import Map from "../../common-components/Map/Map";
import { fd } from "../../utils/format-date";

const WatchTrip = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showDesc, , { toggleHandler: toggleShowDesc }] = useSState(false);

  const [mapRoute, setMapRoute, { passValueHandler: setMapRouteTo }] =
    useSState(null);

  const [trip, setTrip] = useState(null);
  const tripId = useParams().tripId;

  useEffect(() => {
    if (!trip) {
      const getData = async () => {
        try {
          const { trip: tripResult } = await sendRequest(
            `/trips/watching/${tripId}`,
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

  const showMapHandler = () => {
    setMapRoute(true);
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      {mapRoute && (
        <Modal onClose={setMapRouteTo(null)}>
          <Map />
        </Modal>
      )}

      {trip && (
        <>
          <DataCard fullWidth>
            <h2>Информация за пътуването</h2>
          </DataCard>
          <DataCard>
            <StopsMonitor
              stops={trip.stops}
              nextStop={trip.tripStatus.nextStop}
              showDesc={showDesc}
            >
              {trip.tripStatus.status === "PENDING" && (
                <>
                  <div>{trip.owner.name} все още не е тръгнал</div>
                </>
              )}
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
              <p>
                {trip.owner.name} закъснява много. Вече имате достъп до
                допълнителна информация за пътуването му.
              </p>
              <Button onClick={toggleShowDesc}>
                {showDesc ? "Скрий " : "Покажи "} описание на спирките
              </Button>
              {trip.tripStatus.data.locations.length && (
                <Button onClick={showMapHandler}>
                  Виж пътуването на карта
                </Button>
              )}
            </DataCard>
          )}
          {trip.tripStatus.status === "VERY_LATE" && (
            <DataCard>
              <h2>Нива на батерията</h2>
              <ul>
                {trip.tripStatus.data.batteries.map((b) => (
                  <li key={b._id}>
                    [{fd(b.timestamp, "dd.mm.yyyy hh:nn")}] {b.level}%
                  </li>
                ))}
              </ul>
            </DataCard>
          )}
        </>
      )}
    </>
  );
};

export default WatchTrip;
