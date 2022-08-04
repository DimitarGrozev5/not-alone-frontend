import { Link } from "react-router-dom";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";

import styles from "./PlannedTrips.module.css";
import TripOverview from "./TripOverview/TripOverview";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import Button from "../../common-components/FormElements/Button/Button";
import { useLoadPageData } from "../../hooks/useLoadPageData";

const PlannedTrips = () => {
  const { data, isLoading, error, clearError } = useLoadPageData("/trips");
  const trips = data?.trips;

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <DataCard fullWidth>
        <h1>Планувани пътувания</h1>
      </DataCard>

      {trips && !trips.length && (
        <DataCard fullWidth>Все още няма създадени</DataCard>
      )}
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
