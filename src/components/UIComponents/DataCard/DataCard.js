import styles from "./DataCard.module.css";

const DataCard = (props) => {
  const classes = [styles.card];
  if (props.expand) {
    classes.push(styles.expand);
  }
  return <div className={classes.join(" ")}>{props.children}</div>;
};

export default DataCard;
