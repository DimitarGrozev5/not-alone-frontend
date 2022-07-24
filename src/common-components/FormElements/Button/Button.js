import { Link } from "react-router-dom";

import styles from "./Button.module.css";

const Button = (props) => {
  const classNames = [styles.button];
  props.stretch && classNames.push(styles.stretch);
  props.className && classNames.push(props.className);

  const className = classNames.join(" ");

  if (props.to) {
    return (
      <Link to={props.to} className={className}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type || "button"}
      className={className}
    >
      {props.children}
    </button>
  );
};

export default Button;
