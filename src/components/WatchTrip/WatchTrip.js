import { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { useLoadPageData } from "../../hooks/useLoadPageData";

const WatchTrip = () => {
  const tripId = useParams().tripId;
  const {
    data,
    offline,
    dataSource,
    reloadData,
    isLoading,
    error,
    clearError,
  } = useLoadPageData(`/trips/watching/${tripId}`, { getCache: true });
  const trip = data?.trip;

  const [showDesc, , { toggleHandler: toggleShowDesc }] = useSState(false);

  const [mapRoute, setMapRoute, { passValueHandler: setMapRouteTo }] =
    useSState(null);

  const [dt, timeLeft] = useTimeLeft(trip?.tripStatus.dueBy);
  useEffect(() => {
    if (
      !offline &&
      ((dt < -65 * 1000 && trip?.tripStatus.status === "ONGOING") ||
        (dt < -1 * 60 * 60 * 1000 + 5000 && trip?.tripStatus.status === "LATE"))
    ) {
      // setTrip(null);
      reloadData();
    }
  }, [dt, trip?.tripStatus.status, reloadData, offline]);

  const showMapHandler = () => {
    const loc = trip.tripStatus.data.locations;
    const props = {
      route: loc,
    };

    setMapRoute(props);
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          asOverlay={dataSource !== "cache"}
          centerPage={dataSource === "cache"}
        />
      )}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <Modal show={!!mapRoute} onClose={setMapRouteTo(null)}>
        <Map {...mapRoute} />
      </Modal>
      {trip && (
        <>
          <DataCard fullWidth>
            <h2>
              Информация за пътуването{" "}
              {dataSource === "cache" && !isLoading && "(Офлайн)"}
            </h2>
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
            <>
              <DataCard limitHeight>
                <h2>Нива на батерията</h2>
                <ul>
                  {trip.tripStatus.data.batteries.map((b) => (
                    <li key={b._id}>
                      <span className={styles.accent}>
                        [{fd(b.timestamp, "dd.mm.yyyy hh:nn")}]
                      </span>{" "}
                      {b.level}%
                    </li>
                  ))}
                </ul>
              </DataCard>
              <DataCard limitHeight>
                <h2>Записани GPS локации</h2>
                <ul>
                  {trip.tripStatus.data.locations.map((loc) => (
                    <li key={loc._id}>
                      <span className={styles.accent}>
                        [{fd(loc.timestamp, "dd.mm.yyyy hh:nn")}]
                      </span>{" "}
                      {loc.latitude}, {loc.longitude}
                    </li>
                  ))}
                </ul>
              </DataCard>
            </>
          )}
        </>
      )}
    </>
  );
};

export default WatchTrip;
