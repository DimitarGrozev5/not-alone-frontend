// import styles from "./OngoingTrip.module.css";
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
import { useLoadPageData } from "../../hooks/useLoadPageData";

const OngoingTrip = () => {
  const {
    data,
    dataSource,
    offline,
    reloadData,
    isLoading,
    error,
    sendRequest,
    clearError,
  } = useLoadPageData("/trips/active", { getCache: true });

  // Data about trips
  const allTrips = data?.allTrips;
  const activeTrip = data?.activeTrip;

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

  // Trip controllers
  const [notifyWatchers, , { toggleHandler: toggleNotify }] = useSState(false);

  const sendStartTrip = async (event) => {
    event.preventDefault();

    const settings = { notifyWatchers };
    try {
      await sendRequest(`/trips/${startTripModal._id}/start`, {
        body: settings,
      });
      reloadData();
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
        await sendRequest(`/trips/${activeTrip._id}/${command}`, {
          body,
          method: "POST",
        });
        reloadData();
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
        reloadData();
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
      {isLoading && (
        <LoadingSpinner
          asOverlay={dataSource !== "cache"}
          centerPage={dataSource === "cache"}
        />
      )}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      {/* Modals control */}
      <StartTripModal
        show={!!startTripModal}
        tripName={startTripModal?.name}
        notify={notifyWatchers}
        onNotifyChange={toggleNotify}
        onClose={startTripHandler(null)}
        onStart={sendStartTrip}
      />

      <Modal
        show={extendTimeModal !== false}
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
          // onReload={setActiveTrip.bind(null, null)}
          onReload={reloadData}
          offline={offline}
          dataSource={dataSource}
          isLoading={isLoading}
        />
      )}

      {/* Display data */}
      {allTrips && !allTrips.length && (
        <DataCard fullWidth>Все още нямате пътувания</DataCard>
      )}
      {allTrips && !!allTrips.length && (
        <OngoingAllTrips
          offline={offline}
          dataSource={dataSource}
          isLoading={isLoading}
          trips={allTrips}
          onStartTrip={startTripHandler}
        />
      )}
    </>
  );
};

export default OngoingTrip;
