import styles from "./FormCard.module.css";

const FormCard = (props) => {
  const submitHandler = props.onSubmit || ((e) => e.preventDefault());
  return (
    <form onSubmit={submitHandler} className={styles.form}>
      {props.children}
    </form>
  );
};

export default FormCard;
