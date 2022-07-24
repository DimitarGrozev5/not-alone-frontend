import { Link } from "react-router-dom";
import DataCard from "../../../common-components/UIComponents/DataCard/DataCard";
import { useTimeLeft } from "../../../hooks/useTimeLeft";
import styles from "./WatchedTripOverview.module.css";

const WatchedTripOverview = (props) => {
  const w = props.trip;

  const timeLeft = useTimeLeft(w.tripStatus.dueBy);
  return (
    <DataCard>
      <Link to={`/watch/${w._id}`} className={styles.overview}>
        <h3>
          {w.name}, {w.stops.length} спирки
        </h3>
        <p>
          {w.tripStatus.status === "PENDING" &&
            `${w.owner.name} все още не е тръгнал`}

          {w.tripStatus.status !== "PENDING" &&
            w.tripStatus.status !== "FINISHED" && (
              <>
                <span className={styles.accent}>Следваща спирка:</span>{" "}
                {w.stops[w.tripStatus.nextStop].data.placeName}
              </>
            )}
        </p>
        {w.tripStatus.status === "ONGOING" && (
          <p>{`${w.owner.name} трябва да пристигне до ${timeLeft}`}</p>
        )}
        {(w.tripStatus.status === "LATE" ||
          w.tripStatus.status === "VERY_LATE") && (
          <p>
            {`${w.owner.name} закъснява. Трябваше да пристигне преди ${timeLeft}`}
          </p>
        )}
        {w.tripStatus.status === "PAUSED" && (
          <p>{`${w.owner.name} е в почивка`}</p>
        )}
        {w.tripStatus.status === "FINISHED" && (
          <p>{`${w.owner.name} приключи пътуването си.`}</p>
        )}
      </Link>
    </DataCard>
  );
};

export default WatchedTripOverview;
