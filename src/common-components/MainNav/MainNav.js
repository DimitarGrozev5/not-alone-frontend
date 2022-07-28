import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLongPress } from "../../hooks/useLongPress";
import { useSState } from "../../hooks/useSState";

import styles from "./MainNav.module.css";

const MainNav = (props) => {
  const isActiveSwitch = ({ isActive }) => (isActive ? styles.active : "");

  // TODO: I am assuming that the window size won't change
  const windowWidth = window.innerWidth;

  // Long press functionality
  const longPressEvents = useLongPress();
  const [showHint, setShowHint, { passValueHandler: setShowHintTo }] =
    useSState(false, { preventDefault: false });
  useEffect(() => {
    let t;
    if (showHint) {
      t = setTimeout(() => {
        setShowHint(false);
      }, 2000);
    }

    return () => clearTimeout(t);
  }, [showHint]);

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
            {windowWidth >= 600 ? "Пътувания" : "П"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Наблюдавани пътувания"))}
            to="/watching"
            className={isActiveSwitch}
          >
            {windowWidth >= 600 ? "Наблюдавай" : "Н"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Текущо пътуване"))}
            to="/ongoing-trip"
            className={isActiveSwitch}
          >
            {windowWidth >= 600 ? "Активно пътуване" : "А"}
          </NavLink>
        </li>
        <li>
          <NavLink
            {...longPressEvents(setShowHintTo("Профил"))}
            to="/profile"
            className={isActiveSwitch}
          >
            {windowWidth >= 600 ? "Профил" : "П"}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
