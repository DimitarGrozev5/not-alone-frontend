import { useState } from "react";

import styles from "./PlanTrip.module.css";
import TripStop from "./TripStop";

const PlanTrip = () => {
  const [stops, setStops] = useState([{ text: "", duration: 0 }]);

  const onNameChangeHandler = (id) => (event) => {
    setStops((stops) => {
      const copy = [...stops];
      copy[id].text = event.target.value;
      return copy;
    });
  };
  const onDurationChangeHandler = (id) => (dt) => {
    setStops((stops) => {
      const copy = [...stops];

      copy[id].duration =
        copy[id].duration + dt < 0 ? 0 : copy[id].duration + dt;
      return copy;
    });
  };

  const onRemoveHandler = (id) => () => {
    setStops((stops) => {
      const copy = [...stops];
      copy.splice(id, 1);
      return copy;
    });
  };

  const addStopHandler = (event) => {
    event.preventDefault();
    setStops((stops) => [...stops, { text: "", duration: 0 }]);
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
                onRemove={onRemoveHandler(index)}
              />
            </li>
          ))}
        </ul>
        <div>
          <button onClick={addStopHandler}>Добави спирка</button>
        </div>
        <div>
          <h2>Наблюдаващи</h2>
          <ul>
            
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
