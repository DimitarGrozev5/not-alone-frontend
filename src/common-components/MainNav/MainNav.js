import { NavLink } from "react-router-dom";

import styles from "./MainNav.module.css";

const MainNav = (props) => {
  const isActiveSwitch = ({ isActive }) => (isActive ? styles.active : "");

  // TODO: I am assuming that the window size won't change
  const windowWidth = window.innerWidth;

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/planned-trips" className={isActiveSwitch}>
            {windowWidth >= 600 ? "Пътувания" : "П"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/watching" className={isActiveSwitch}>
            {windowWidth >= 600 ? "Наблюдавай" : "Н"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/ongoing-trip" className={isActiveSwitch}>
            {windowWidth >= 600 ? "Активно пътуване" : "А"}
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={isActiveSwitch}>
            {windowWidth >= 600 ? "Профил" : "П"}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
