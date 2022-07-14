import { useEffect, useState } from "react";
import Button from "../../components/FormElements/Button/Button";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import { useManageTrip } from "./hooks/useManageTrip";
import styles from "./PlanTrip.module.css";
import { validateTrip } from "./planTripHelpers";
import TripInput from "./TripInput/TripInput";
import TripStopsPlanner from "./TripStopsPlanner/TripStopsPlanner";
import TripWatchers from "./TripWatchers/TripWatchers";

const PlanTrip = (props) => {
  const { trip, actions } = useManageTrip();

  useEffect(() => {
    // Load data from server if the component is not in create mode
  }, [props.mode]);

  const [error, setError] = useState(null);

  const saveData = (event) => {
    event.preventDefault();
    //// Data validation
    try {
      validateTrip(trip);
    } catch (err) {
      setError(err.message);
      return;
    }

    // Prepare data for API
    const prepTrip = {
      name: trip.name,

      stops: trip.stops.map((stop) => ({
        type: stop.type,
        data: stop.data,
        duration: stop.duration,
      })),

      watchers: trip.watchers.new.map((w) => ({ ...w.data })),
    };

    console.log(prepTrip);
  };

  return (
    <>
      {/* {isLoading && <LoadingSpinner asOverlay />} */}
      {error && (
        <ErrorModal error={error} onClose={setError.bind(null, null)} />
      )}
      <form onSubmit={saveData}>
        <h1>Планувай пътуване</h1>
        <div className={styles.plan}>
          <DataCard>
            <TripInput
              mode={props.mode}
              label="Име на пътуването:"
              type="text"
              value={trip.name}
              onChange={actions.changeName}
            />
          </DataCard>
          <DataCard>
            <TripStopsPlanner
              mode={props.mode}
              stops={trip.stops}
              stopActions={actions.stops}
            />
          </DataCard>
          <DataCard>
            <h2>Заявки за наблюдение</h2>
            <TripWatchers
              mode={"edit"}
              watchers={trip.watchers}
              watcherActions={actions.watchers}
            />
          </DataCard>
          <Button stretch type="submit">
            {props.mode === "create" && "Създаване на пътуване"}
            {props.mode === "edit" && "Запазване на промените"}
          </Button>
          {props.mode === "edit" && (
            <Button
              stretch
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Изтрий пътуването
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default PlanTrip;
