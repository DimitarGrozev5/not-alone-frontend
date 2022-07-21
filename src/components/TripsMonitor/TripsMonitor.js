import styles from "./TripsMonitor.module.css";

const TripsMonitor = (props) => {
  return (
    <ul className={styles.stops}>
      {props.stops.slice(0, props.nextStop).map((stop) => (
        <li key={stop._id} className={styles["past-stop"]}>
          {stop.data.placeName}
        </li>
      ))}

      <li className={styles["current-position"]}>{props.children}</li>

      {props.stops.slice(props.nextStop).map((stop) => (
        <li key={stop._id} className={styles["upcoming-stop"]}>
          {stop.data.placeName}
        </li>
      ))}
    </ul>
  );
};

export default TripsMonitor;
