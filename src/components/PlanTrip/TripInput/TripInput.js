import { useState } from "react";
import Button from "../../../common-components/FormElements/Button/Button";
import styles from "./TripInput.module.css";

const TripInput = (props) => {
  const [viewMode, setViewMode] = useState(props.mode !== "create");

  const changeHandler = (event) => props.onChange(event.target.value);

  const toggleViewModeHandler = (event) => {
    event.preventDefault();
    setViewMode((v) => !v);
  };

  const blockEnterHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <>
      <label className={styles.label}>{props.label}</label>
      <div className={styles.name}>
        {viewMode ? (
          <span className={styles.name}>{props.value}</span>
        ) : (
          <input
            onKeyDown={blockEnterHandler}
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
