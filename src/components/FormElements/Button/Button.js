import styles from "./Button.module.css";

const Button = (props) => {
  const classNames = [styles.button];
  props.stretch && classNames.push(styles.stretch);
  props.className && classNames.push(props.className);

  const className = classNames.join(" ");
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      className={className}
    >
      {props.children}
    </button>
  );
};

export default Button;
