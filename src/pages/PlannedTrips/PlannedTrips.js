import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import { useHttpClient } from "../../hooks/useHttpClient";

import styles from "./PlannedTrips.module.css";
import TripOverview from "./TripOverview/TripOverview";

const PlannedTrips = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [trips, setTrips] = useState(null);

  useEffect(() => {
    sendRequest("trips", null, { auth: true })
      .then(({ trips }) => {
        setTrips(trips);
      })
      .catch((err) => console.log(err));
  }, [sendRequest]);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      <div>
        <h1>Планувани пътувания:</h1>
      </div>

      {trips && !trips.length && <div>Все още няма създадени</div>}
      {trips && trips.length && (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <TripOverview tripData={trip} />
            </li>
          ))}
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
