import DurationPicker from "../../components/DurationPicker/DurationPicker";

const TripStop = (props) => {
  return (
    <div>
      <label>Следваща спирка</label>
      <input
        type="text"
        placeholder="Напишете името на мястото"
        value={props.stop.text}
        onChange={props.onNameChange}
      />
      <label>Колко време ще продължи пътуването</label>
      <DurationPicker
        duration={props.stop.duration}
        onChange={props.onDurationChange}
      />
      <button onClick={props.onRemove}>Премахни спирка</button>
    </div>
  );
};

export default TripStop;
