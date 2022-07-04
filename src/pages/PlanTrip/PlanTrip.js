import { useState } from "react";
import DurationPicker from "../../components/DurationPicker/DurationPicker";
import styles from "./PlanTrip.module.css";

const PlanTrip = () => {
  const [duration1, setDuration1] = useState(0);

  return (
    <>
      <h1>Планувай пътуване</h1>
      <div className={styles.plan}>
        <h2>Спирки</h2>
        <div>
          <label>Начална точка</label>
          <input type="text" placeholder="Напишете името на мястото" />
        </div>
        <div>
          <label>Следваща спирка</label>
          <input type="text" placeholder="Напишете името на мястото" />
          <label>Колко време ще продължи пътуването</label>
          <DurationPicker duration={duration1} onChange={setDuration1} />
        </div>
        <div>
          <button>Добави спирка</button>
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
