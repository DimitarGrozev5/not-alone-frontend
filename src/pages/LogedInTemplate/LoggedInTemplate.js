import { Outlet } from "react-router-dom";
import styles from "./LoggedInTemplate.module.css";
import MainNav from "../../components/MainNav/MainNav";

const LoggedInTemplate = (props) => {
  return (
    <>
      <div className={styles.outlet}>
        <Outlet />
      </div>
      <MainNav />
    </>
  );
};

export default LoggedInTemplate;
