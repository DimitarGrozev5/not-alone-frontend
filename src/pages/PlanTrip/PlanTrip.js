import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMessages from "../../services/useMessages";
import { useTripsService } from "../../services/useTripsService";
import ProfileAddConnection from "../ProfilePage/ProfileAddConnection";
import { useManageStops } from "./hooks/useManageStops";
import styles from "./PlanTrip.module.css";
import TripStop from "./TripStop";

const PlanTrip = () => {
  const navigate = useNavigate();
  const tripService = useTripsService();
  const message = useMessages();

  const {
    stops,
    onNameChangeHandler,
    onDurationChangeHandler,
    onRemoveStopHandler,
    addStopHandler,
  } = useManageStops();

  const [watcherRequests, setWatcherRequests] = useState([]);
  const addWatcherRequestHandler = (watcher) => {
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
      type: "text-descripton",
    }));
    const formatedWatcherRequests = watcherRequests.map((watcher) => ({
      watcherId: watcher.id,
      requestType: watcher.name ? "request" : "request-and-connection",
    }));

    tripService
      .postNewTrip({
        stops: formatedStops,
        watcherRequests: formatedWatcherRequests,
      })
      .then(() => {
        message.alert("Пътуването е запазено");
        navigate("/", { replace: true });
      })
      .catch((err) => message.alert(err.message));
  };

  return (
    <>
      <h1>Планувай пътуване</h1>
      <div className={styles.plan}>
        <h2>Спирки</h2>
        <div>
          <label>Начална точка</label>
          <input type="text" placeholder="Напишете името на мястото" />
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
                <li key={w}>
                  {w}
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
