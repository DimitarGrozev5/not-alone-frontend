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
          <ul></ul>
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
