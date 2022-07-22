import DurationPicker from "../../../components/DurationPicker/DurationPicker";
import Button from "../../../components/FormElements/Button/Button";
import TripInput from "../TripInput/TripInput";
import TripStopDescription from "../TripStopDescription/TripStopDescription";
// import styles from "./TripStopText.module.css";

const TripStopText = (props) => {
  return (
    <>
      <hr />
      <TripInput
        mode={props.mode}
        label="Спирка:"
        type="text"
        value={props.stopData.placeName}
        onChange={props.onTextChange}
      />
      <DurationPicker
        mode={props.mode}
        label="Продължителност на пътуването:"
        duration={props.duration}
        onChange={props.onDurationChange}
      />
      <TripStopDescription
        mode={props.mode}
        label="Описание на пътуването:"
        value={props.stopData.description}
        placeholder="Въведете опсиание къде ще ходите, какво ще правите и как ще стигнете там. Тази информация ще се покаже на наблюдателите Ви, само ако закъснеете много."
        onChange={props.onDescChange}
      />
      {props.mode !== "view" && (
        <Button onClick={props.onDelete}>Изтриване</Button>
      )}
    </>
  );
};

export default TripStopText;
