import { useEffect, useState, useReducer, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/FormElements/Button/Button";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import {
  requestStatus,
  requestTypes,
  stopTypes,
} from "../../data-types/trip-data";
import useMessages from "../../services/useMessages";
import { useTripsService } from "../../services/useTripsService";
import ProfileAddConnection from "../ProfilePage/ProfileAddConnection";
import { useManageStops } from "./hooks/useManageStops";
import { useManageTrip } from "./hooks/useManageTrip";
import styles from "./PlanTrip.module.css";
import TripInput from "./TripInput/TripInput";
import TripStop from "./TripStop";
import TripStopsPlanner from "./TripStopsPlanner/TripStopsPlanner";
import TripWatchers from "./TripWatchers/TripWatchers";

const PlanTrip = (props) => {
  const { trip, actions } = useManageTrip();

  const [error, setError] = useState(null);

  const saveData = (event) => {
    event.preventDefault();
    //// Data validation
    try {
      // Name is not empty
      if (!trip.name.length) {
        throw "Пътуването трябва да има име!";
      }

      // There is more than one stop
      if (trip.stops.length === 1) {
        throw "Трябва да има поне две спирки!";
      }

      // Trip stops have name and non zero duration
      trip.stops.forEach(({ data, duration }, i) => {
        if (!data.stopName.length) {
          throw "Спирките трябва да имат име!";
        }
        if (duration === 0 && i > 0) {
          throw "Спирките трябва да имат положително време за пътуване!";
        }
      });

      // There is at least one watcher
      if (trip.watchers.new.length === 0) {
        throw "Добавете поне един наблюдател!";
      }
    } catch (err) {
      setError(err);
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
              mode={"create"}
              watchers={trip.watchers}
              watcherActions={actions.watchers}
            />
          </DataCard>
          <Button stretch type="submit">
            Submit
          </Button>
          {/* <Button stretch onClick={() => {}}>
          {editFlag ? "Запази промените" : "Запази нов план"}
        </Button> */}
          {/* {editFlag && <button onClick={() => {}}>Изтрий пътуването</button>} */}
        </div>
      </form>
    </>
  );
};

export default PlanTrip;
