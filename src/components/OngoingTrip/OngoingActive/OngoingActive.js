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
        await sendRequest(
          `/trips/${props.activeTrip._id}/add-details`,
          reqBody,
          { auth: true }
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      setError("Този браузър не подържа записване на GPS данни");
    }
  };

  const timeLeft = useTimeLeft(activeTrip?.tripStatus.dueBy);
  return (
    <>
      {error && <ErrorModal error={error} onClose={clearError} />}

      <DataCard fullWidth>
        <h2>Активно пътуване</h2>
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
                <Button onClick={props.onTripControl("pause")}>Пауза</Button>
                <Button onClick={props.onExtendTime(0)}>Ще закъснея</Button>
              </div>
            </>
          )}
          {activeTrip.tripStatus.status === "PAUSED" && (
            <>
              <div>Пътуването е в почивка</div>
              <div>
                <Button onClick={props.onTripControl("resume")}>
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
              <Button onClick={props.onExtendTime(0)}>удължите времето</Button>,
              ако всичко е наред.
            </>
          )}
          {activeTrip.tripStatus.status === "FINISHED" && (
            <>Стигнахте до крайната си дестинация</>
          )}
        </StopsMonitor>
      </DataCard>

      {activeTrip.tripStatus.status !== "FINISHED" && (
        <DataCard>
          <Button stretch onClick={props.onTripControl("next-stop")}>
            Стигнах до следващата спирка
          </Button>
          <div>Можете да запазите локация и данни за батерията</div>
          <Button disabled={isLoading} stretch onClick={snapshotHandler}>
            Запазване на локация {isLoading && <LoadingSpinner minimize />}
          </Button>
        </DataCard>
      )}
      {activeTrip.tripStatus.status === "FINISHED" && (
        <DataCard>
          <Button stretch onClick={props.onDeleteTrip(false)}>
            Приключване и изтриване на пътуването
          </Button>
        </DataCard>
      )}
    </>
  );
};

export default OngoingActive;
