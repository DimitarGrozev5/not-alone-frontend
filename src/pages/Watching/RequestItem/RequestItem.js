import styles from "./RequestItem.module.css";
import Button from "../../../components/FormElements/Button/Button";

const RequestItem = (props) => {
  const req = props.request;
  return (
    <li className={styles.request} key={req._id}>
      <div className={styles.request__info}>
        <span className={styles.request__accent}>{req.from.name}</span> Ви кани
        да наблюдавате пътуването{" "}
        <span className={styles.request__accent}>{req.trip.name}</span>
      </div>
      <div className={styles.request__controlls}>
        <Button onClick={props.onAccept}>Ок</Button>
        <Button onClick={props.onReject}>Отказ</Button>
      </div>
      <hr />
    </li>
  );
};

export default RequestItem;
