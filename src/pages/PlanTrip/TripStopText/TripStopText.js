import DurationPicker from "../../../components/DurationPicker/DurationPicker";
import Button from "../../../components/FormElements/Button/Button";
import TripInput from "../TripInput/TripInput";
import styles from "./TripStopText.module.css";

const TripStopText = (props) => {
  return (
    <>
      <TripInput
        mode={props.mode}
        label="Спирка:"
        type="text"
        value={props.stopData.stopName}
        onChange={props.onTextChange}
      />
      <DurationPicker
        mode={props.mode}
        label="Продължителност на пътуването:"
        duration={props.duration}
        onChange={props.onDurationChange}
      />
      {props.mode !== "view" && (
        <Button onClick={props.onDelete}>Изтриване</Button>
      )}
    </>
  );
};

export default TripStopText;
