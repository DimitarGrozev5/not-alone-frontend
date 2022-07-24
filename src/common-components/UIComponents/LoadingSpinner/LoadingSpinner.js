import ReactDOM from "react-dom";
import React from "react";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = (props) => {
  return ReactDOM.createPortal(
    <div className={props.asOverlay && styles["loading-spinner__overlay"]}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default LoadingSpinner;
