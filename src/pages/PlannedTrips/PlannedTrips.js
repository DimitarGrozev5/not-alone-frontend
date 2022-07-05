import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadStatus } from "../../data-types/LoadStatus";
import { requestStatus } from "../../data-types/trip-data";
import { useTripsService } from "../../services/useTripsService";
import { deconstructDuration } from "../../utils/time";

import styles from "./PlannedTrips.module.css";

const PlannedTrips = () => {
  const tripsService = useTripsService();

  const [trips, setTrips] = useState(new LoadStatus.Loading());

  useEffect(() => {
    tripsService
      .getAllTrips()
      .then((trips) => {
        const t = trips.length
          ? new LoadStatus.Loaded(trips)
          : new LoadStatus.Empty();
        setTrips(t);
      })
      .catch((err) => {
        setTrips(new LoadStatus.Error(err.message));
      });
  }, [tripsService]);

  return (
    <>
      <div>
        <h1>Планувани пътувания:</h1>
      </div>
      {trips instanceof LoadStatus.Loading && <div>Зареждане...</div>}
      {trips instanceof LoadStatus.Empty && <div>Няма пътувания все още</div>}
      {trips instanceof LoadStatus.Error && (
        <div>Грешка при зареждане на пътуванията</div>
      )}
      {trips instanceof LoadStatus.Loaded && (
        <ul>
          {trips.result.map((trip) => {
            const tripTotalDuration = trip.stops.reduce(
              (total, stop) => total + stop.duration,
              0
            );
            const [, , minutes, hours, days] =
              deconstructDuration(tripTotalDuration);

            const watching = trip.watchers.filter(
              (w) => w.status === requestStatus.ACCEPTED
            ).length;

            return (
              <li key={trip.id}>
                <Link to={`/planned-trips/${trip.id}`}>
                  <h2>{trip.name}</h2>
                  <div>{trip.stops.length - 1} спирки</div>
                  <div>
                    Общо {days} дни, {hours} часа и {minutes} минути предвидено
                    пътуване
                  </div>
                  <h3>
                    {watching && watching > 1
                      ? `${watching} души ще те следят`
                      : `1 човек ще те следи`}
                    {!watching && "Все още никой не те следи"}
                  </h3>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <div className={styles.add}>
        <Link className={styles.add} to="/plan-trip">
          +
        </Link>
      </div>
    </>
  );
};

export default PlannedTrips;
