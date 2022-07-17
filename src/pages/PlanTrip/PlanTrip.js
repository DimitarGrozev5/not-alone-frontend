import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/FormElements/Button/Button";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../hooks/useHttpClient";
import { useManageTrip } from "./hooks/useManageTrip";
import styles from "./PlanTrip.module.css";
import { validateTrip } from "./planTripHelpers";
import TripInput from "./TripInput/TripInput";
import TripStopsPlanner from "./TripStopsPlanner/TripStopsPlanner";
import TripWatchers from "./TripWatchers/TripWatchers";

const PlanTrip = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  const { trip, actions } = useManageTrip();

  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  useEffect(() => {
    // Load data from server if the component is not in create mode
    if (props.mode !== "create") {
      const getTripData = async () => {
        // Get Trip Id
        const tripId = params.tripId;

        // Get Trip data from API
        try {
          const tripData = await sendRequest(`trips/${tripId}`, null, {
            auth: true,
          });
          actions.initTrip(tripData.trip);
        } catch (err) {
          console.log(err);
        }
      };

      getTripData();
    }
  }, [props.mode, params.tripId, sendRequest]);

  const saveData = async (event) => {
    event.preventDefault();
    //// Data validation
    try {
      const edit = props.mode === "edit";
      validateTrip(trip, { edit });
    } catch (err) {
      setError(err.message);
      return;
    }

    // Prepare data for API
    const prepTrip = {
      name: trip.name,

      stops: trip.stops,

      watchers: trip.watchers.new.map((w) => ({ ...w.data })),
    };

    try {
      if (props.mode === "create") {
        await sendRequest("trips", prepTrip, { auth: true });
      } else if (props.mode === "edit") {
        await sendRequest(`trips/${params.tripId}`, prepTrip, {
          method: "PATCH",
          auth: true,
        });
      }
      navigate("/planned-trips");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      <form onSubmit={saveData}>
        {props.mode === "create" && <h1>Планувай пътуване</h1>}
        {props.mode === "edit" && <h1>Прегледай пътуване</h1>}
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
              mode={props.mode}
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
