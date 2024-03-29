import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../common-components/FormElements/Button/Button";
import ConfirmModal from "../../common-components/UIComponents/ConfirmModal/ConfirmModal";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import { useLoadPageData } from "../../hooks/useLoadPageData";
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

  const tripId = params.tripId;
  const {
    data,
    dataSource,
    offline,
    isLoading,
    sendRequest,
    error,
    clearError,
    setError,
  } = useLoadPageData(`/trips/${tripId}`, {
    loadIfTrue: props.mode !== "create",
    getCache: true,
  });

  useEffect(() => {
    if (data) {
      actions.initTrip(data.trip);
    }
  }, [data, actions]);

  const [confirmDelete, setConfirmDelete] = useState(false);

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
        await sendRequest("/trips", { body: prepTrip });
      } else if (props.mode === "edit") {
        await sendRequest(`/trips/${params.tripId}`, {
          body: prepTrip,
          method: "PATCH",
        });
      }
      navigate("/planned-trips");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteHandler = (del) => async (event) => {
    event.preventDefault();
    if (del) {
      try {
        await sendRequest(`/trips/${params.tripId}`, {
          method: "DELETE",
        });
        navigate("/planned-trips");
      } catch (err) {
        console.log(err);
        return setConfirmDelete(false);
      }
    }
    setConfirmDelete(true);
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          asOverlay={dataSource !== "cache"}
          centerPage={dataSource === "cache"}
        />
      )}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <ConfirmModal
        show={!!confirmDelete}
        onCancel={setConfirmDelete.bind(null, false)}
        onConfirm={deleteHandler(true)}
        message="Сигурни ли сте, че желаете да изтриете пътуването? Действието не може да бъде отменено!"
      />

      <form onSubmit={saveData} className={styles.form}>
        {props.mode === "create" && (
          <DataCard fullWidth>
            <h1>Планувай пътуване</h1>
          </DataCard>
        )}
        {props.mode !== "create" && (
          <DataCard fullWidth>
            <h1>
              Прегледай пътуване{" "}
              {dataSource === "cache" && !isLoading && "(Офлайн)"}
            </h1>
          </DataCard>
        )}
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

        <Button
          disabled={offline && props.mode !== "view"}
          stretch
          type="submit"
          to={props.mode === "view" ? "/ongoing-trip" : undefined}
        >
          {props.mode === "create" && "Създаване на пътуване"}
          {props.mode === "edit" && "Запазване на промените"}
          {props.mode === "view" && "Назад"}
        </Button>
        {props.mode === "edit" && (
          <Button disabled={offline} stretch onClick={deleteHandler(false)}>
            Изтрий пътуването
          </Button>
        )}
      </form>
    </>
  );
};

export default PlanTrip;
