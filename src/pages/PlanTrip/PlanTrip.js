import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const tripService = useTripsService();
  const message = useMessages();
  const params = useParams();

  const [edit, setEdit] = useState({});
  const editFlag = props.edit;
  const tripId = params.tripId;
  useEffect(() => {
    if (editFlag) {
      tripService
        .getTripById(tripId)
        .then((data) => {
          const editData = {
            tripName: data.name,
            startStop: data.stops[0].text,
            stops: data.stops
              .slice(1)
              .map((stop) => ({ text: stop.text, duration: stop.duration })),
            watcherRequests: data.watchers,
          };
          setEdit(editData);
        })
        .catch((err) => message.alert(err.message));
    }
  }, [tripService, message, editFlag, tripId]);

  const [tripName, setTripName] = useState("");
  const changeTripNameHandler = (event) => setTripName(event.target.value);
  const [startStop, setStartStop] = useState("");
  const changeStartStopHandler = (event) => setStartStop(event.target.value);

  const {
    stops,
    setStops,
    onNameChangeHandler,
    onDurationChangeHandler,
    onRemoveStopHandler,
    addStopHandler,
  } = useManageStops();

  const [watcherRequests, setWatcherRequests] = useState([]);
  const addWatcherRequestHandler = (watcher) => {
    console.log(watcher);
    setWatcherRequests((w) => [...w, watcher]);
  };
  const removeWatcherHandler = (index) => (event) => {
    event.preventDefault();
    setWatcherRequests((w) => {
      const tmp = [...w];
      tmp.splice(index, 1);
      return tmp;
    });
  };

  const saveHandler = (event) => {
    event.preventDefault();

    // TODO: Validation

    const formatedStops = stops.map((stop) => ({
      ...stop,
      type: stopTypes.TEXT_DESCRIPTION,
    }));
    const formatedWatcherRequests = watcherRequests.map((watcher) => ({
      watcherId: watcher.id,
      requestType: watcher.name
        ? requestTypes.OVERWATCH
        : requestTypes.OVERWATCH_AND_CONNECTION,
    }));

    tripService
      .postNewTrip({
        name: tripName,
        stops: [
          { text: startStop, type: stopTypes.TEXT_DESCRIPTION, duration: 0 },
          ...formatedStops,
        ],
        watcherRequests: formatedWatcherRequests,
      })
      .then(() => {
        message.alert("Пътуването е запазено");
        navigate("/", { replace: true });
      })
      .catch((err) => message.alert(err.message));
  };

  useEffect(() => {
    if (editFlag) {
      setTripName(edit.tripName);
      setStartStop(edit.startStop);
      setStops(edit.stops);
      setWatcherRequests(edit.watcherRequests);
    }
  }, [edit, setStops]);

  return (
    <>
      <h1>Планувай пътуване</h1>
      <div className={styles.plan}>
        <label>Име на пътуването:</label>
        <input type="text" value={tripName} onChange={changeTripNameHandler} />
        <h2>Спирки</h2>
        <div>
          <label>Начална точка</label>
          <input
            type="text"
            placeholder="Напишете името на мястото"
            value={startStop}
            onChange={changeStartStopHandler}
          />
        </div>
        <ul>
          {stops.map((stop, index) => (
            <li key={index}>
              <TripStop
                stop={stop}
                onNameChange={onNameChangeHandler(index)}
                onDurationChange={onDurationChangeHandler(index)}
                onRemove={onRemoveStopHandler(index)}
              />
            </li>
          ))}
        </ul>
        <div>
          <button onClick={addStopHandler}>Добави спирка</button>
        </div>
        <div>
          <h2>Заявки за наблюдение</h2>
          {!watcherRequests.length && <h3>Никой не е избран все още</h3>}
          {!!watcherRequests.length && (
            <ul>
              {watcherRequests.map((w, index) => (
                <li key={w.id}>
                  {w.name} {w.phone}
                  {w.status === requestStatus.ACCEPTED && " наблюдава"}
                  {w.status === requestStatus.PENDING && " не е отговорил"}
                  <button onClick={removeWatcherHandler(index)}>X</button>
                </li>
              ))}
            </ul>
          )}
          <ProfileAddConnection
            caption="Добави наблюдател"
            onSubmit={addWatcherRequestHandler}
            all
          />
        </div>
        <button onClick={saveHandler}>Запази нов план</button>
      </div>
    </>
  );
};

export default PlanTrip;
