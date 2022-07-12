import styles from "./DataCard.module.css";

const DataCard = (props) => {
  return <div className={styles.card}>{props.children}</div>;
};

export default DataCard;
