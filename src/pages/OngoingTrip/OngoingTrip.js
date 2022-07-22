import { useEffect, useState } from "react";

// import styles from "./OngoingTrip.module.css";
import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";
import Button from "../../components/FormElements/Button/Button";
import Modal from "../../components/UIComponents/Modal/Modal";
import { useHState } from "../../hooks/useHState";
import { useSState } from "../../hooks/useSState";
import DurationPicker from "../../components/DurationPicker/DurationPicker";
import StartTripModal from "./StartTripModal/StartTripModal";
import OngoingAllTrips from "./OngoingAllTrips/OngoingAllTrips";
import OngoingActive from "./OngoingActive/OngoingActive";

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
          const { allTrips, activeTrip } = await sendRequest(
            "trips/active",
            null,
            { auth: true }
          );
          // console.log(activeTrip);
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
  const sendStartTrip = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`trips/${startTripModal._id}/start`, null, {
        method: "POST",
        auth: true,
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
        await sendRequest(`trips/${activeTrip._id}/${command}`, body, {
          method: "POST",
          auth: true,
        });
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
        await sendRequest(`trips/${activeTrip._id}`, null, {
          method: "DELETE",
          auth: true,
        });
        setAllTrips(null);
        setActiveTrip(null);
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
      {startTripModal && (
        <StartTripModal
          tripName={startTripModal.name}
          onClose={startTripHandler(null)}
          onStart={sendStartTrip}
        />
      )}
      {extendTimeModal !== false && (
        <Modal title="Удължаване на времето" onClose={extendTimeHandler(false)}>
          <DurationPicker
            duration={extendTimeModal}
            onChange={setExtendTime}
            mode="create"
          />
          <Button onClick={sendExtendTime}>Удължи</Button>
        </Modal>
      )}
      {deleteTripModal && (
        <Modal title="Внимание" onClose={closeDeleteHandler(false)}>
          Пътуването е свършило и ще бъде изтрито!
          <Button onClick={closeDeleteHandler(false)}>Не</Button>
          <Button onClick={deleteTripHandler(true)}>Добре</Button>
        </Modal>
      )}

      {activeTrip && (
        <OngoingActive
          activeTrip={activeTrip}
          onTripControl={tripControlHandler}
          onDeleteTrip={deleteTripHandler}
          onExtendTime={extendTimeHandler}
        />
      )}

      {/* Display data */}
      {allTrips && !allTrips.length && <div>Все още нямате пътувания</div>}
      {allTrips && !!allTrips.length && (
        <OngoingAllTrips trips={allTrips} onStartTrip={startTripHandler} />
      )}
    </>
  );
};

export default OngoingTrip;
