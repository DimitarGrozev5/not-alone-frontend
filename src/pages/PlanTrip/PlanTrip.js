import { useEffect, useState } from "react";
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
import styles from "./PlanTrip.module.css";
import TripStop from "./TripStop";

const PlanTrip = (props) => {
  const editFlag = props.edit;
  
  return (
    <form>
      <h1>Планувай пътуване</h1>
      <div className={styles.plan}>
        <DataCard>
          <label>Име на пътуването:</label>
        </DataCard>
        <DataCard>
          <h2>Спирки</h2>
        </DataCard>
        <DataCard>
          <h2>Заявки за наблюдение</h2>
        </DataCard>
        <Button stretch onClick={() => {}}>
          {editFlag ? "Запази промените" : "Запази нов план"}
        </Button>
        {editFlag && <button onClick={() => {}}>Изтрий пътуването</button>}
      </div>
    </form>
  );
};

export default PlanTrip;
