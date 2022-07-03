import styles from "./FormInput.module.css";
import { FormData, InvalidForm } from "../../../data-types/FormDataTypes";
import { useEffect } from "react";

const FormInput = (props) => {
  const wrapValue = (val) =>
    props.validator(val) ? FormData.of(val) : InvalidForm.of(val, props.errMsg);

  // Run Validator on first render
  useEffect(() => {
    const val = wrapValue(props.value.value);
    props.onChange(val);
  }, []);

  const isValid = true;

  const onChangeHandler = (event) => {
    const val = wrapValue(event.target.value);
    props.onChange(val);
  };

  return (
    <div>
      <label htmlFor={props.name}>{props.label}:</label>
      <input
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value.value}
        onChange={onChangeHandler}
      />
      {!isValid && <p>{props.errMsg}</p>}
    </div>
  );
};

export default FormInput;
