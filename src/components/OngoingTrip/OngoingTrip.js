import { useEffect, useState } from "react";

// import styles from "./OngoingTrip.module.css";
import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import Button from "../../common-components/FormElements/Button/Button";
import Modal from "../../common-components/UIComponents/Modal/Modal";
import { useHState } from "../../hooks/useHState";
import { useSState } from "../../hooks/useSState";
import DurationPicker from "../../common-components/DurationPicker/DurationPicker";
import StartTripModal from "./StartTripModal/StartTripModal";
import OngoingAllTrips from "./OngoingAllTrips/OngoingAllTrips";
import OngoingActive from "./OngoingActive/OngoingActive";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";

const OngoingTrip = () => {
  // Data about trips
  const [allTrips, setAllTrips] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);

  // Modal visibility states
  const [startTripModal, startTripHandler] = useHState(false);
  const [
    extendTimeModal,
    setExtendTime,
    { passValueHandler: extendTimeHandler },
  ] = useSState(false);
  const [
    deleteTripModal,
    setDeleteTrip,
    { passValueHandler: closeDeleteHandler },
  ] = useSState(false);

  // Get HTTP Client
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Load Data
  useEffect(() => {
    if (!allTrips && !activeTrip) {
      const getData = async () => {
        try {
          const { allTrips, activeTrip } = await sendRequest("/trips/active");
          setAllTrips(allTrips);
          setActiveTrip(activeTrip);
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }
  }, [allTrips, activeTrip, sendRequest]);

  // Trip controllers
  const [notifyWatchers, , { toggleHandler: toggleNotify }] = useSState(false);

  const sendStartTrip = async (event) => {
    event.preventDefault();

    const settings = { notifyWatchers };
    try {
      await sendRequest(`/trips/${startTripModal._id}/start`, {
        body: settings,
      });
      setAllTrips(null);
      startTripHandler(null)();
    } catch (err) {
      console.log(err);
    }
  };

  const tripControlHandler =
    (command, body = null) =>
    async (event) => {
      event.preventDefault();
      try {
        await sendRequest(`/trips/${activeTrip._id}/${command}`, { body });
        setAllTrips(null);
        setActiveTrip(null);
      } catch (err) {
        console.log(err);
      }
    };
  const sendExtendTime = (event) => {
    tripControlHandler("extend", { extendTime: extendTimeModal })(event);
    setExtendTime(false);
  };
  const deleteTripHandler = (del) => async (event) => {
    event.preventDefault();
    if (del) {
      try {
        await sendRequest(`/trips/${activeTrip._id}`, {
          method: "DELETE",
        });
        setAllTrips(null);
        setActiveTrip(null);
        setDeleteTrip(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      setDeleteTrip(true);
    }
  };

  return (
    <>
      {/* Loading and error handling */}
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}
      {/* Modals control */}
      <StartTripModal
        show={!!startTripModal}
        tripName={startTripModal.name}
        notify={notifyWatchers}
        onNotifyChange={toggleNotify}
        onClose={startTripHandler(null)}
        onStart={sendStartTrip}
      />

      <Modal
        show={!!extendTimeModal}
        title="Удължаване на времето"
        onClose={extendTimeHandler(false)}
      >
        <DurationPicker
          duration={extendTimeModal}
          onChange={setExtendTime}
          mode="create"
        />
        <Button onClick={sendExtendTime}>Удължи</Button>
      </Modal>

      <Modal
        show={!!deleteTripModal}
        title="Внимание"
        onClose={closeDeleteHandler(false)}
      >
        Пътуването е свършило и ще бъде изтрито!
        <Button onClick={closeDeleteHandler(false)}>Не</Button>
        <Button onClick={deleteTripHandler(true)}>Добре</Button>
      </Modal>

      {activeTrip && (
        <OngoingActive
          activeTrip={activeTrip}
          onTripControl={tripControlHandler}
          onDeleteTrip={deleteTripHandler}
          onExtendTime={extendTimeHandler}
          onReload={setActiveTrip.bind(null, null)}
        />
      )}

      {/* Display data */}
      {allTrips && !allTrips.length && (
        <DataCard fullWidth>Все още нямате пътувания</DataCard>
      )}
      {allTrips && !!allTrips.length && (
        <OngoingAllTrips trips={allTrips} onStartTrip={startTripHandler} />
      )}
    </>
  );
};

export default OngoingTrip;
