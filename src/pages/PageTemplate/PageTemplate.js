import { Outlet } from "react-router-dom";
import MainCard from "../../components/UIComponents/MainCard";
import styles from "./PageTemplate.module.css";
import MainNav from "../../components/MainNav/MainNav";
import { useSelector } from "react-redux";

const PageTemplate = (props) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>На път</h1>
        {isLoggedIn && <MainNav />}
      </header>
      <MainCard>
        <Outlet />
      </MainCard>
    </div>
  );
};

export default PageTemplate;
