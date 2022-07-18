import { Link } from "react-router-dom";
import styles from "./WatchedTripOverview.module.css";

const WatchedTripOverview = (props) => {
  const w = props.trip;
  return (
    <li>
      <Link to={`/watch/${w._id}`}>
        <p>
          {w.name}, {w.stops.length} спирки
        </p>
        <p>
          {w.tripStatus.status === "PENDING" && "Пътуването не е започнало"}

          {w.tripStatus.status !== "PENDING" &&
            `Следваща спирка: ${w.stops[w.tripStatus.nextStop].data.placeName}`}
        </p>
        {w.tripStatus.status === "ONGOING" && (
          <p>
            {`${w.owner.name} трябва да пристигне до ${new Date(
              w.tripStatus.dueBy
            )}`}
          </p>
        )}
        {(w.tripStatus.status === "LATE" ||
          w.tripStatus.status === "VERY_LATE") && (
          <p>
            {`${w.owner.name} закъснява. Трябваше да пристигне до ${new Date(
              w.tripStatus.dueBy
            )}`}
          </p>
        )}
        {w.tripStatus.status === "PAUSED" && (
          <p>{`${w.owner.name} е в почивка`}</p>
        )}
      </Link>
    </li>
  );
};

export default WatchedTripOverview;
