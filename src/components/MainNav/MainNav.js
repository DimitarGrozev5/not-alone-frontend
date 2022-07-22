import { NavLink } from "react-router-dom";

import styles from "./MainNav.module.css";

const MainNav = (props) => {
  const isActiveSwitch = ({ isActive }) => (isActive ? styles.active : "");

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/planned-trips" className={isActiveSwitch}>
            П
          </NavLink>
        </li>
        <li>
          <NavLink to="/watching" className={isActiveSwitch}>
            Н
          </NavLink>
        </li>
        <li>
          <NavLink to="/ongoing-trip" className={isActiveSwitch}>
            А
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={isActiveSwitch}>
            П
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
