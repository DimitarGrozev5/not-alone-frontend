import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";

import Button from "../../FormElements/Button/Button";
import styles from "./Modal.module.css";

const Overlay = (props) => {
  return <div className={styles.overlay} onClick={props.onClose}></div>;
};

const Modal = (props) => {
  return ReactDOM.createPortal(
    <Transition in={props.show} timeout={400} mountOnEnter unmountOnExit>
      {(state) => (
        <>
          <Overlay onClose={props.onClose} />
          <div className={`${styles.modal} ${styles[state]}`}>
            <header>
              <h1>{props.title}</h1>
              <Button
                onClick={props.onClose}
                className={styles["close-button"]}
              >
                X
              </Button>
            </header>
            <section>{props.children}</section>
          </div>
        </>
      )}
    </Transition>,
    document.getElementById("modal-root")
  );
};

export default Modal;
