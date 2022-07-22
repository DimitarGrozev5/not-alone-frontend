// import styles from "./OngoingActive.module.css";
import DataCard from "../../../components/UIComponents/DataCard/DataCard";
import Button from "../../../components/FormElements/Button/Button";
import { useTimeLeft } from "../../../hooks/useTimeLeft";
import StopsMonitor from "../../../components/StopsMonitor/StopsMonitor";

const OngoingActive = (props) => {
  const activeTrip = props.activeTrip;

  const timeLeft = useTimeLeft(activeTrip?.tripStatus.dueBy);
  return (
    <>
      <DataCard>
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
