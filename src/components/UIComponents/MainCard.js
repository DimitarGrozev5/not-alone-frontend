import styles from "./MainCard.module.css";

const MainCard = (props) => {
  return <main className={styles.main}>{props.children}</main>;
};

export default MainCard;
