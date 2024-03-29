import { useEffect, useState } from "react";
import { useEState } from "../../hooks/useEState";
import { deconstructDuration, TimeConst } from "../../utils/time";
import Button from "../FormElements/Button/Button";
import styles from "./DurationPicker.module.css";

const DurationPicker = (props) => {
  const [viewMode, setViewMode] = useState(props.mode !== "create");
  const toggleViewModeHandler = (event) => {
    event.preventDefault();
    setViewMode((m) => !m);
  };

  const [, , minutes, hours, days] = deconstructDuration(props.duration);

  const [d, setD] = useEState(days);
  const [h, setH] = useEState(hours);
  const [m, setM] = useEState(minutes);
  const validateChangeHandler = (setState) => (event) => {
    if (!/^[0-9]*$/.test(event.target.value)) {
      return;
    }
    setState(event);
  };

  useEffect(() => {
    setM(minutes);
    setH(hours);
    setD(days);
  }, [minutes, hours, days, setD, setH, setM]);

  const changeHandler = (timeframe, baseMeasure) => (event) => {
    const t = props.duration + (event.target.value - baseMeasure) * timeframe;
    if (t < 0) {
      setM(0);
      setH(0);
      setD(0);
    }
    props.onChange(t);
  };

  const blockEnterHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  };

  return (
    <>
      <div className={styles.header}>
        <label className={styles.label}>{props.label}</label>
        {props.mode === "edit" && (
          <Button onClick={toggleViewModeHandler}>
            {viewMode ? "Edit" : "OK"}
          </Button>
        )}
      </div>
      <div className={`${styles.duration} ${viewMode && styles["view-mode"]}`}>
        <div className={styles.picker}>
          {viewMode ? (
            <div className={styles.input}>{d}</div>
          ) : (
            <input
              className={styles.input}
              type="text"
              step={1}
              min={0}
              value={d}
              onChange={validateChangeHandler(setD)}
              onKeyDown={blockEnterHandler}
              onBlur={changeHandler(TimeConst.DAY, days)}
            />
          )}
          <span>Дни</span>
        </div>

        <div className={styles.picker}>
          {viewMode ? (
            <div className={styles.input}>{h}</div>
          ) : (
            <input
              className={styles.input}
              type="text"
              step={1}
              min={0}
              value={h}
              onChange={validateChangeHandler(setH)}
              onKeyDown={blockEnterHandler}
              onBlur={changeHandler(TimeConst.HOUR, hours)}
            />
          )}
          <span>Часа</span>
        </div>

        <div className={styles.picker}>
          {viewMode ? (
            <div className={styles.input}>{m}</div>
          ) : (
            <input
              className={styles.input}
              type="text"
              step={1}
              min={0}
              value={m}
              onChange={validateChangeHandler(setM)}
              onKeyDown={blockEnterHandler}
              onBlur={changeHandler(TimeConst.MINUTE, minutes)}
            />
          )}
          <span>Минути</span>
        </div>
      </div>
    </>
  );
};

export default DurationPicker;
