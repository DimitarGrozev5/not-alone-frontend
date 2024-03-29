import ReactDOM from "react-dom";
import React from "react";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = (props) => {
  let classes = "";
  if (props.asOverlay) {
    classes = styles["loading-spinner__overlay"];
  }
  if (props.minimize) {
    classes = styles["loading-spinner__mini"];
  }
  if (props.centerPage) {
    classes = styles["loading-spinner__center-page"];
  }

  const content = (
    <div className={classes}>
      <div className={styles["lds-dual-ring"]}></div>
    </div>
  );

  if (props.asOverlay || props.centerPage) {
    return ReactDOM.createPortal(
      content,
      document.getElementById("modal-root")
    );
  }

  return content;
};

export default LoadingSpinner;
