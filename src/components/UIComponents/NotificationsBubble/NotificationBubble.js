import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import { useSState } from "../../../hooks/useSState";
import styles from "./NotificationBubble.module.css";
import NotificationLink from "./NotificationLink/NotificationLink";

const NotificationBubble = (props) => {
  const notifs = useSelector((state) => state.notif.notifications);
  console.log(notifs);

  const [expanded, setExpanded, { passValueHandler: setExpandedTo }] =
    useSState(false);

  return ReactDOM.createPortal(
    <>
      {!!notifs.length && (
        <>
          {!expanded && (
            <div className={styles.bubble} onClick={setExpandedTo(true)}>
              {notifs.length}
            </div>
          )}
          {!!expanded && (
            <div className={styles.expanded}>
              <h1>Съобщения</h1>
              <button onClick={setExpandedTo(false)} className={styles.bubble}>
                X
              </button>
              <ul>
                {notifs.map((notif) => (
                  <li key={notif.id}>
                    <NotificationLink
                      onClick={setExpandedTo(false)}
                      notification={notif}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>,
    document.getElementById("modal-root")
  );
};

export default NotificationBubble;
