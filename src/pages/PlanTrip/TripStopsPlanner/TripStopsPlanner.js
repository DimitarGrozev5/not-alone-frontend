import Button from "../../../components/FormElements/Button/Button";
import TripInput from "../TripInput/TripInput";
import TripStopText from "../TripStopText/TripStopText";
import styles from "./TripStopsPlanner.module.css";

const TripStopsPlanner = (props) => {
  const addStopHandler = (event) => {
    event.preventDefault();
    props.stopActions.appendStop();
  };

  return (
    <>
      <h2>Спирки</h2>
      <ul className={styles.list}>
        <li>
          <TripInput
            mode={props.mode}
            label="Начална спирка"
            type="text"
            value={props.stops[0].data.placeName}
            onChange={props.stopActions.changeFirstStop}
          />
        </li>
        {props.stops.slice(1).map((stop) => (
          <li key={stop.id}>
            <TripStopText
              stopData={stop.data}
              onTextChange={props.stopActions.changeText(stop.id)}
              duration={stop.duration}
              onDurationChange={props.stopActions.changeDuration(stop.id)}
              onDelete={props.stopActions.deleteStop(stop.id)}
              mode={props.mode}
            />
          </li>
        ))}
      </ul>
      {props.mode !== "view" && (
        <Button onClick={addStopHandler}>Добави спирка</Button>
      )}
    </>
  );
};

export default TripStopsPlanner;
