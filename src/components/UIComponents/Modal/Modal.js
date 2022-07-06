import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const Overlay = (props) => {
  return <div className={styles.overlay} onClick={props.onClose}></div>;
};

const Modal = (props) => {
  return ReactDOM.createPortal(
    <>
      <Overlay onClose={props.onClose} />
      <div className={styles.modal}>
        <h1>
          {props.title}
          <button onClick={props.onClose}>X</button>
        </h1>
        {props.children}
      </div>
    </>,
    document.getElementById("modal-root")
  );
};

export default Modal;
