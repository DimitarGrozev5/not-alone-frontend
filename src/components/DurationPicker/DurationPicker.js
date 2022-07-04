import styles from "./DurationPicker.module.css";

const DurationPicker = (props) => {
  return (
    <div className={styles.duration}>
      <input type="number" step={1} min={0} />
      <button>-</button>
      <span>Дни</span>
      <button>+</button>
      <input type="number" step={1} min={0} />
      <button>-</button>
      <span>Часа</span>
      <button>+</button>
      <input type="number" step={1} min={0} />
      <button>-</button>
      <span>Минути</span>
      <button>+</button>
    </div>
  );
};

export default DurationPicker;
