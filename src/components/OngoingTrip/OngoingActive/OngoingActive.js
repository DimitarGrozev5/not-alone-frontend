// import styles from "./OngoingActive.module.css";
import DataCard from "../../../common-components/UIComponents/DataCard/DataCard";
import Button from "../../../common-components/FormElements/Button/Button";
import { useTimeLeft } from "../../../hooks/useTimeLeft";
import StopsMonitor from "../../../common-components/StopsMonitor/StopsMonitor";
import { useHttpClient } from "../../../hooks/useHttpClient";
import { getLocation } from "../../../utils/getLocation";
import { getBattery } from "../../../utils/getBattery";
import ErrorModal from "../../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import { useEffect } from "react";

const OngoingActive = (props) => {
  const activeTrip = props.activeTrip;

  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  const snapshotHandler = async () => {
    if ("geolocation" in navigator) {
      let [location, battery] = [null, null];
      try {
        if ("getBattery" in navigator) {
          // Get location

          [location, battery] = await Promise.allSettled([
            getLocation(),
            getBattery(),
          ]).then((results) =>
            results.map((r) => {
              if (r.status !== "fulfilled") {
                throw new Error(r.reason.message);
              }
              return r.value;
            })
          );
        } else {
          location = await Promise.allSettled([getLocation()]);
        }
      } catch (err) {
        setError(err.message);
        return;
      }

      const reqBody = {};
      if (location) {
        reqBody.location = location;
      }
      if (battery) {
        reqBody.battery = battery;
      }

      if (!location && !battery) {
        return;
      }

      // Send request
      try {
        await sendRequest(`/trips/${props.activeTrip._id}/add-details`, {
          body: reqBody,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setError("Този браузър не подържа записване на GPS данни");
    }
  };

  const [dt, timeLeft] = useTimeLeft(activeTrip?.tripStatus.dueBy);
  const onReload = props.onReload;
  useEffect(() => {
    if (
      (dt < -65 * 1000 && activeTrip.tripStatus.status === "ONGOING") ||
      (dt < -1 * 60 * 60 * 1000 + 5000 &&
        activeTrip.tripStatus.status === "LATE")
    ) {
      onReload();
    }
  }, [dt, activeTrip.tripStatus.status, onReload]);
  return (
    <>
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <DataCard fullWidth>
        <h2>
          Активно пътуване{" "}
          {props.dataSource === "cache" && !props.isLoading && "(Офлайн)"}
        </h2>
      </DataCard>
      <DataCard>
        <h3>Прогрес</h3>
        <StopsMonitor
          stops={activeTrip.stops}
          nextStop={activeTrip.tripStatus.nextStop}
        >
          {activeTrip.tripStatus.status === "ONGOING" && (
            <>
              <div>Очаква се да пристигнете до {timeLeft}</div>
              <div>
                <Button
                  disabled={props.offline}
                  onClick={props.onTripControl("pause")}
                >
                  Пауза
                </Button>
                <Button
                  disabled={props.offline}
                  onClick={props.onExtendTime(0)}
                >
                  Ще закъснея
                </Button>
              </div>
            </>
          )}
          {activeTrip.tripStatus.status === "PAUSED" && (
            <>
              <div>Пътуването е в почивка</div>
              <div>
                <Button
                  disabled={props.offline}
                  onClick={props.onTripControl("resume")}
                >
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
              <Button disabled={props.offline} onClick={props.onExtendTime(0)}>
                удължите времето
              </Button>
              , ако всичко е наред.
            </>
          )}
          {activeTrip.tripStatus.status === "FINISHED" && (
            <>Стигнахте до крайната си дестинация</>
          )}
        </StopsMonitor>
      </DataCard>

      {activeTrip.tripStatus.status !== "FINISHED" && (
        <DataCard>
          <Button
            disabled={props.offline}
            stretch
            onClick={props.onTripControl("next-stop")}
          >
            Стигнах до следващата спирка
          </Button>
          <div>Можете да запазите локация и данни за батерията</div>
          <Button
            disabled={isLoading || props.offline}
            stretch
            onClick={snapshotHandler}
          >
            Запазване на локация {isLoading && <LoadingSpinner minimize />}
          </Button>
        </DataCard>
      )}
      {activeTrip.tripStatus.status === "FINISHED" && (
        <DataCard>
          <Button
            disabled={props.offline}
            stretch
            onClick={props.onDeleteTrip(false)}
          >
            Приключване и изтриване на пътуването
          </Button>
        </DataCard>
      )}
    </>
  );
};

export default OngoingActive;
