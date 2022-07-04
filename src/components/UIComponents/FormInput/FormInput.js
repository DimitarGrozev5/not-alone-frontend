import styles from "./FormInput.module.css";
import { FormData, InvalidForm } from "../../../data-types/FormDataTypes";
import { useEffect, useRef, useState } from "react";

const FormInput = (props) => {
  const [inputWasTouched, setInputWasTouched] = useState(false);

  const wrapValue = (val) =>
    props.validator(val) ? new FormData(val) : new InvalidForm(val, props.errMsg);

  // Run Validator on first render
  const firstValue = useRef(wrapValue(props.value.value));
  const firstChange = useRef(props.onChange);
  useEffect(() => {
    firstChange.current(firstValue.current);
  }, []);

  const onChangeHandler = (event) => {
    const val = wrapValue(event.target.value);
    props.onChange(val);
  };

  const onBlurHandler = (event) => {
    setInputWasTouched(true);

    const val = wrapValue(event.target.value);
    props.onChange(val);
  };

  const isValid =
    (!props.formWasTouched && !inputWasTouched) || props.value.isValid;

  return (
    <div className={styles["form-input"]}>
      <label htmlFor={props.name}>{props.label}:</label>
      <input
        className={isValid ? "" : styles.error}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value.value}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      />
      {!isValid && <p className={styles.error}>{props.errMsg}</p>}
    </div>
  );
};

export default FormInput;
