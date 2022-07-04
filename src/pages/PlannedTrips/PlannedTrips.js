import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadStatus } from "../../data-types/LoadStatus";
import { useTripsService } from "../../services/useTripsService";

import styles from "./PlannedTrips.module.css";

const PlannedTrips = () => {
  const tripsService = useTripsService();

  const [trips, setTrips] = useState(new LoadStatus.Loading());

  useEffect(() => {
    // tripsService
  }, []);

  return (
    <>
      <div>
        <h1>List of planned trips</h1>
      </div>
      {trips instanceof LoadStatus.Loading && <div>Loading...</div>}
      <div className={styles.add}>
        <Link className={styles.add} to="/plan-trip">
          +
        </Link>
      </div>
    </>
  );
};

export default PlannedTrips;
