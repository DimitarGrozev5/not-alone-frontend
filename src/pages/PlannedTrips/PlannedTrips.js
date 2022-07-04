import { Link } from "react-router-dom";

import styles from "./PlannedTrips.module.css";

const PlannedTrips = () => {
  return (
    <>
      <div>List of planned trips</div>
      <div className={styles.add}>
        <Link className={styles.add} to="/plan-trip">
          +
        </Link>
      </div>
    </>
  );
};

export default PlannedTrips;
