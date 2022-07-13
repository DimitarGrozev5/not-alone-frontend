import { useEffect, useState, useReducer, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/FormElements/Button/Button";
import DataCard from "../../components/UIComponents/DataCard/DataCard";
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

const PlanTrip = (props) => {
  const { trip, actions } = useManageTrip();

  return (
    <form>
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
            mode={"create"}
            stops={trip.stops}
            stopActions={actions.stops}
          />
        </DataCard>
        <DataCard>
          <h2>Заявки за наблюдение</h2>
        </DataCard>
        {/* <Button stretch onClick={() => {}}>
          {editFlag ? "Запази промените" : "Запази нов план"}
        </Button> */}
        {/* {editFlag && <button onClick={() => {}}>Изтрий пътуването</button>} */}
      </div>
    </form>
  );
};

export default PlanTrip;
