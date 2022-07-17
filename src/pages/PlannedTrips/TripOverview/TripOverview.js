import { Link } from "react-router-dom";

import styles from "./TripOverview.module.css";
import { deconstructDuration } from "../../../utils/time";
import DataCard from "../../../components/UIComponents/DataCard/DataCard";

const TripOverview = ({ tripData }) => {
  const tripTotalDuration = tripData.stops.reduce(
    (total, stop) => total + stop.duration,
    0
  );
  const [, , minutes, hours, days] = deconstructDuration(tripTotalDuration);

  const watching = tripData.watchers;
  // .filter(
  //   (w) => w.status === requestStatus.ACCEPTED
  // ).length;

  return (
    <DataCard>
      <Link
        to={`/planned-trips/${tripData._id}`}
        className={styles["trip-link"]}
      >
        <h2>{tripData.name}</h2>
        <div>{tripData.stops.length - 1} {tripData.stops.length === 2 ? "спирка" : "спирки"}</div>
        <div>
          Общо {days} дни, {hours} часа и {minutes} минути предвидено пътуване
        </div>
        <h3>
          {watching && watching > 1
            ? `${watching} души ще те следят`
            : `1 човек ще те следи`}
          {!watching && "Все още никой не те следи"}
        </h3>
      </Link>
    </DataCard>
  );
};

export default TripOverview;
