import { Outlet } from "react-router-dom";
import styles from "./LoggedInTemplate.module.css";

// This template was used to show and hide teh menu in different routes
// It's not used at the moment
const LoggedInTemplate = (props) => {
  return (
    <>
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </>
  );
};

export default LoggedInTemplate;
