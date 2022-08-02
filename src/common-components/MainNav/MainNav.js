import { NavLink } from "react-router-dom";

import styles from "./MainNav.module.css";
import { useHint } from "./useHint";
import { useWindowSize } from "./useWindowSize";

const MainNav = (props) => {
  const isActiveSwitch = ({ isActive }) => (isActive ? styles.active : "");

  const windowWidth = useWindowSize();

  // Long press functionality
  const [showHint, setShowHintTo, longPressEvents] = useHint();

  return (
    <nav className={styles.nav}>
      {!!showHint && (
        <div className={styles.hint}>
          <span>{showHint}</span>
        </div>
      )}
      <ul>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Планувани пътувания"))}
            to="/planned-trips"
            className={isActiveSwitch}
          >
            {windowWidth >= 750 ? "Пътувания" : "П"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Наблюдавани пътувания"))}
            to="/watching"
            className={isActiveSwitch}
          >
            {windowWidth >= 750 ? "Наблюдавай" : "Н"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Текущо пътуване"))}
            to="/ongoing-trip"
            className={isActiveSwitch}
          >
            {windowWidth >= 750 ? "Активно пътуване" : "А"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Профил"))}
            to="/profile"
            className={isActiveSwitch}
          >
            {windowWidth >= 750 ? "Профил" : "П"}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
