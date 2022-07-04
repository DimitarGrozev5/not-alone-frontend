import { deconstructDuration, TimeConst } from "../../utils/time";
import styles from "./DurationPicker.module.css";

const DurationPicker = (props) => {
  const updateDuration = (dt) => (duration) =>
    duration + dt < 0 ? 0 : duration + dt;

  const [, , minutes, hours, days] = deconstructDuration(props.duration);

  const changeHandler = (timeframe, baseMeasure) => (event) => {
    if (/0[1-9]+/.test(event.target.value)) {
      event.target.value = event.target.value.substr(1);
    }

    const dt = (event.target.value - baseMeasure) * timeframe;
    props.onChange(updateDuration(dt));
  };

  const addOneHandler = (timeframe) => (event) => {
    event.preventDefault();
    props.onChange(updateDuration(timeframe));
  };

  return (
    <div className={styles.duration}>
      <input
        type="number"
        step={1}
        min={0}
        value={days}
        onChange={changeHandler(TimeConst.DAY, days)}
      />
      <button onClick={addOneHandler(-TimeConst.DAY)}>-</button>
      <span>Дни</span>
      <button onClick={addOneHandler(TimeConst.DAY)}>+</button>
      <input
        type="number"
        step={1}
        min={0}
        value={hours}
        onChange={changeHandler(TimeConst.HOUR, hours)}
      />
      <button onClick={addOneHandler(-TimeConst.HOUR)}>-</button>
      <span>Часа</span>
      <button onClick={addOneHandler(TimeConst.HOUR)}>+</button>
      <input
        type="number"
        step={1}
        min={0}
        value={minutes}
        onChange={changeHandler(TimeConst.MINUTE, minutes)}
      />
      <button onClick={addOneHandler(-TimeConst.MINUTE)}>-</button>
      <span>Минути</span>
      <button onClick={addOneHandler(TimeConst.MINUTE)}>+</button>
    </div>
  );
};

export default DurationPicker;
