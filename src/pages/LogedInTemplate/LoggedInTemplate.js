import { Outlet } from "react-router-dom";
import styles from "./LoggedInTemplate.module.css";
import MainNav from "../../components/MainNav/MainNav";
import NotificationBubble from "../../components/UIComponents/NotificationsBubble/NotificationBubble";

const LoggedInTemplate = (props) => {
  return (
    <>
      <NotificationBubble />
      <div className={styles.outlet}>
        <Outlet />
      </div>
      <MainNav />
    </>
  );
};

export default LoggedInTemplate;
