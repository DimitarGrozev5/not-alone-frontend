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
import { getLocation } from "../../utils/getLocation";
import { getBattery } from "../../utils/getBattery";
// import { useDispatch } from "react-redux";
// import { setGpsRecordTo } from "../../redux-store/gpsThunks/changeGpsRecordThunk";

const OngoingTrip = () => {
  // const dispatch = useDispatch();

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
  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  // Load Data
  useEffect(() => {
    if (!allTrips && !activeTrip) {
      const getData = async () => {
        try {
          const { allTrips, activeTrip } = await sendRequest(
            "/trips/active",
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
  const [notifyWatchers, , { toggleHandler: toggleNotify }] = useSState(false);

  // // Should the user record GPS data
  // const [recordGPS, setRecordGPS] = useState(false);
  // // What is the current status of the geolocation permition
  // const [gpsState, setGPSState] = useState("denied");

  // Update the geolocation permition after component load
  // useEffect(() => {
  //   if ("geolocation" in navigator && "permissions" in navigator) {
  //     navigator.permissions.query({ name: "geolocation" }).then((result) => {
  //       setGPSState(result.state);
  //     });
  //   } else {
  //     setGPSState("unavailable");
  //   }
  // }, []);

  // const toggleRecordGPS = (event) => {
  //   setRecordGPS((gps) => !gps);
  //   // If the user turns on the GPS recording, prompt for permition
  //   if (gpsState === "prompt") {
  //     navigator.geolocation.getCurrentPosition(() => {});
  //   }
  // };

  const sendStartTrip = async (event) => {
    event.preventDefault();

    // dispatch(setGpsRecordTo(recordGPS));

    const settings = { notifyWatchers };
    try {
      await sendRequest(`/trips/${startTripModal._id}/start`, settings, {
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
        await sendRequest(`/trips/${activeTrip._id}/${command}`, body, {
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
        await sendRequest(`/trips/${activeTrip._id}`, null, {
          method: "DELETE",
          auth: true,
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

  const snapshotHandler = async () => {
    if ("geolocation" in navigator) {
      if ("getBattery" in navigator) {
        // Get location
        const [location, battery] = await Promise.allSettled([
          getLocation(),
          getBattery(),
        ]).then((results) => {
          return results.map((r) =>
            r.status === "fulfilled" ? r.value : null
          );
        });
        console.log(location, battery);
      } else {
      }
    } else {
      setError("Този браузър не подържа записване на GPS данни");
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
          notify={notifyWatchers}
          onNotifyChange={toggleNotify}
          // recordGPS={recordGPS}
          // gpsState={gpsState}
          // onRecordGPSChange={toggleRecordGPS}
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
          onSnapshot={snapshotHandler}
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
