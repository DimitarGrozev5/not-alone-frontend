import { useState } from "react";
import { LoadStatus } from "../../data-types/LoadStatus";
import ProfileAddConnection from "../ProfilePage/ProfileAddConnection";
import { useManageStops } from "./hooks/useManageStops";
import styles from "./PlanTrip.module.css";
import TripStop from "./TripStop";

const PlanTrip = () => {
  const {
    stops,
    onNameChangeHandler,
    onDurationChangeHandler,
    onRemoveStopHandler,
    addStopHandler,
  } = useManageStops();

  const [watcherRequests, setWatcherRequests] = useState(new LoadStatus.Idle());
  const addWatcherRequestHandler = (watcher, clearText) => {};

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
          <ul>
            {!watcherRequests.result?.length && (
              <h3>Никой не е избран все още</h3>
            )}
            {watcherRequests instanceof LoadStatus.Loaded &&
              watcherRequests.result.map((w) => (
                <li key={w.id}>
                  {w.name} {w.phone}
                </li>
              ))}
          </ul>
          <ProfileAddConnection onSubmit={addWatcherRequestHandler} all />
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
