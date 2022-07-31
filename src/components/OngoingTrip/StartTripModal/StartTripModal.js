import Modal from "../../../common-components/UIComponents/Modal/Modal";
import Button from "../../../common-components/FormElements/Button/Button";
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
            checked={props.notify}
            onChange={props.onNotifyChange}
          />
          <label htmlFor="anounce">Съобщи, че тръгваш</label>
        </div>
        {/* <div className={styles["start-trip__checkbox"]}>
          <input
            type={"checkbox"}
            id="gps"
            checked={props.recordGPS}
            onChange={props.onRecordGPSChange}
            disabled={
              props.gpsState === "denied" || props.gpsState === "unavailable"
            }
          />
          <label htmlFor="gps">Запазвай GPS данни за прогреса си</label>
        </div>
        {props.gpsState === "denied" && (
          <div>
            Записването на GPS данни е забранено на това устройство. Можете да
            го разрешите от настройките
          </div>
        )} */}
        {props.gpsState === "unavailable" && (
          <div>Това устройство не може да записва GPS данни.</div>
        )}
        <Button onClick={props.onStart}>Старт</Button>
      </div>
    </Modal>
  );
};

export default StartTripModal;
