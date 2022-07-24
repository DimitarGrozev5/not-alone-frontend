import styles from "./DataCard.module.css";

const DataCard = (props) => {
  const classes = [styles.card];
  if (props.expand) {
    classes.push(styles.expand);
  }
  if (props.fullWidth) {
    classes.push(styles["full-width"]);
  }
  
  return <div className={classes.join(" ")}>{props.children}</div>;
};

export default DataCard;
