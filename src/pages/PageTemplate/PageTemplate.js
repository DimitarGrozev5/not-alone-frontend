import { Outlet } from "react-router-dom";
import MainCard from "../../components/UIComponents/MainCard";
import styles from "./PageTemplate.module.css";

const PageTemplate = (props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Travel Safe</h1>
      </header>
      <MainCard>
        <Outlet />
      </MainCard>
    </div>
  );
};

export default PageTemplate;
