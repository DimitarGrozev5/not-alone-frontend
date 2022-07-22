import { useState } from "react";
import Button from "../../../components/FormElements/Button/Button";
import styles from "./TripStopDescription.module.css";

const TripStopDescription = (props) => {
  const [viewMode, setViewMode] = useState(props.mode !== "create");

  const changeHandler = (event) => props.onChange(event.target.value);

  const toggleViewModeHandler = (event) => {
    event.preventDefault();
    setViewMode((v) => !v);
  };

  const classes = [styles.desc];
  if (viewMode) {
    classes.push(styles.view);
  }

  return (
    <>
      <label className={styles.label}>{props.label}</label>
      <div className={styles.name}>
        <textarea
          className={classes.join(" ")}
          rows={6}
          disabled={viewMode}
          value={props.value}
          onChange={changeHandler}
        />
        {props.mode === "edit" && (
          <Button className={styles.edit} onClick={toggleViewModeHandler}>
            {viewMode ? "Edit" : "OK"}
          </Button>
        )}
      </div>
    </>
  );
};

export default TripStopDescription;
