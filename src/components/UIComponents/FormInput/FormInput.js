import styles from "./FormInput.module.css";
import { FormData, InvalidForm } from "../../../data-types/FormDataTypes";
import { useEffect, useState } from "react";

const FormInput = (props) => {
  const [inputWasTouched, setInputWasTouched] = useState(false);

  const wrapValue = (val) =>
    props.validator(val) ? FormData.of(val) : InvalidForm.of(val, props.errMsg);

  useEffect(() => {
    // Run Validator on first render
    const val = wrapValue(props.value.value);
    props.onChange(val);
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
    <div>
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
