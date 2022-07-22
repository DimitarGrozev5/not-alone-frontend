import Modal from "../../../components/UIComponents/Modal/Modal";
import Button from "../../../components/FormElements/Button/Button";
import styles from "./StartTripModal.module.css";

const StartTripModal = (props) => {
  return (
    <Modal title="Започване на пътуване" onClose={props.onClose}>
      <div className={styles["start-trip"]}>
        <h1>{props.tripName}</h1>
        <div className={styles["start-trip__checkbox"]}>
          <input
            type={"checkbox"}
            id="anounce"
            value={props.notify}
            onChange={props.onNotifyChange}
          />
          <label htmlFor="anounce">Съобщи, че тръгваш</label>
        </div>
        <div className={styles["start-trip__checkbox"]}>
          <input type={"checkbox"} id="gps" />
          <label htmlFor="gps">Запазвай GPS данни за прогреса си</label>
        </div>
        <Button onClick={props.onStart}>Старт</Button>
      </div>
    </Modal>
  );
};

export default StartTripModal;
