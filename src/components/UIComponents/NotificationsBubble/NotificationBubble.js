// TODO: It would be nice if the target page of the notification is the same as the current page, to directly reload it

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { useSState } from "../../../hooks/useSState";
import { notificationActions } from "../../../redux-store/notificationsSlice";
import { useLoad } from "../../Reload/useLoad";
import styles from "./NotificationBubble.module.css";
import NotificationLink from "./NotificationLink/NotificationLink";

const NotificationBubble = (props) => {
  const notifs = useSelector((state) => state.notif.notifications);
  const alerts = useSelector((state) => state.notif.alerts);

  const dispatch = useDispatch();

  const bubbleStyles = [styles.bubble];
  const expandedStyles = [styles.expanded];
  if (alerts.find((a) => a.type === "USER_IS_VERY_LATE")) {
    bubbleStyles.push(styles["high-alert"]);
    expandedStyles.push(styles["high-alert"]);
  } else if (alerts.length) {
    bubbleStyles.push(styles.alert);
    expandedStyles.push(styles.alert);
  }

  const [expanded, , { passValueHandler: setExpandedTo }] = useSState(false);

  // Reload page if it matches some of the targetPages of the alerts and notifs
  const currentPath = useLocation().pathname;
  const load = useLoad();
  useEffect(() => {
    const n = notifs.find((n) => n.targetPage === currentPath);
    const a = alerts.find((a) => a.targetPage === currentPath);
    if (n || a) {
      n && dispatch(notificationActions.removeNotification(n.id));
      a && dispatch(notificationActions.removeAlert(a.id));
      load(currentPath);
    }
  }, [notifs, alerts, currentPath, dispatch, load]);

  return ReactDOM.createPortal(
    <>
      {!!alerts.length && (
        <>
          {!expanded && (
            <div
              className={bubbleStyles.join(" ")}
              onClick={setExpandedTo(true)}
            >
              !
            </div>
          )}
          {!!expanded && (
            <div className={expandedStyles.join(" ")}>
              <h1>Внимание</h1>
              <button
                onClick={setExpandedTo(false)}
                className={bubbleStyles.join(" ")}
              >
                X
              </button>
              <ul>
                {alerts.map((a) => (
                  <li key={a.id}>
                    <NotificationLink
                      onClick={setExpandedTo(false)}
                      notification={a}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {!!notifs.length && !alerts.length && (
        <>
          {!expanded && (
            <div
              className={bubbleStyles.join(" ")}
              onClick={setExpandedTo(true)}
            >
              {notifs.length}
            </div>
          )}
          {!!expanded && (
            <div className={expandedStyles.join(" ")}>
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
