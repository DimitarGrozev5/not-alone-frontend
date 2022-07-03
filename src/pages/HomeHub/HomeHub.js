import MainNav from "../../components/MainNav/MainNav";
import useUserService from "../../services/useUserService";
import styles from "./HomeHub.module.css";

const HomeHub = () => {
  const userService = useUserService();

  const logoutHandler = () => userService.logout();

  return (
    <>
      <div>
        home hub
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </>
  );
};

export default HomeHub;
