import { useState } from "react";
import Button from "../../../components/FormElements/Button/Button";
import styles from "./TripInput.module.css";

const TripInput = (props) => {
  const [viewMode, setViewMode] = useState(props.mode !== "create");

  const changeHandler = (event) => props.onChange(event.target.value);

  const toggleViewModeHandler = (event) => {
    event.preventDefault();
    setViewMode((v) => !v);
  };

  return (
    <>
      <label className={styles.label}>{props.label}</label>
      <div className={styles.name}>
        {viewMode ? (
          <span className={styles.name}>{props.value}</span>
        ) : (
          <input
            className={styles.input}
            type={props.type}
            value={props.value}
            onChange={changeHandler}
          />
        )}
        {props.mode === "edit" && (
          <Button onClick={toggleViewModeHandler}>
            {viewMode ? "Edit" : "OK"}
          </Button>
        )}
      </div>
    </>
  );
};

export default TripInput;
