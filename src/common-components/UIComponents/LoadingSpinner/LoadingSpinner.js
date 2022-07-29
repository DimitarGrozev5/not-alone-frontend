import ReactDOM from "react-dom";
import React from "react";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = (props) => {
  const content = (
    <div className={props.asOverlay && styles["loading-spinner__overlay"]}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );

  if (props.asOverlay) {
    return ReactDOM.createPortal(
      content,
      document.getElementById("modal-root")
    );
  }

  return content;
};

export default LoadingSpinner;
