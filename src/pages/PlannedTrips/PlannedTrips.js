import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import { useHttpClient } from "../../hooks/useHttpClient";

import styles from "./PlannedTrips.module.css";
import TripOverview from "./TripOverview/TripOverview";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import Button from "../../components/FormElements/Button/Button";

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

      <DataCard fullWidth>
        <h1>Планувани пътувания</h1>
      </DataCard>

      {trips && !trips.length && <div>Все още няма създадени</div>}
      {trips &&
        !!trips.length &&
        trips.map((trip) => <TripOverview key={trip._id} tripData={trip} />)}
      <div className={styles.add}>
        {window.innerWidth >= 600 ? (
          <Button to="/plan-trip" className={styles.add}>
            Добави ново пътуване
          </Button>
        ) : (
          <Link className={styles.add} to="/plan-trip">
            +
          </Link>
        )}
      </div>
    </>
  );
};

export default PlannedTrips;
