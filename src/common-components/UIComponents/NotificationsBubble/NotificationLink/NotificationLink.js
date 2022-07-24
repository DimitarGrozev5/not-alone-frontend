// import styles from "./NotificationLink.module.css"

import { useDispatch } from "react-redux";
import { notificationActions } from "../../../../redux-store/notificationsSlice";
import Button from "../../../FormElements/Button/Button";
import { useLoad } from "../../../Reload/useLoad";

const NotificationLink = (props) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const load = useLoad();

  const n = props.notification;

  const openNotificationHandler = (target) => (event) => {
    event.preventDefault();
    dispatch(notificationActions.removeNotification(n.id));
    dispatch(notificationActions.removeAlert(n.id));
    load(target);
    props.onClick();
  };

  let content = "";
  switch (n.type) {
    case "OVERWATCH_REQUEST":
      content = (
        <Button onClick={openNotificationHandler(n.targetPage)}>
          Има нови покани за наблюдаване
        </Button>
      );
      break;

    case "CONNECTION_REQUEST":
      content = (
        <Button onClick={openNotificationHandler(n.targetPage)}>
          Има нови покани за приятелство
        </Button>
      );
      break;

    case "TRIP_STARTED":
      content = (
        <Button onClick={openNotificationHandler(n.targetPage)}>
          {n.userName} започна своето пътуване {n.targetName}
        </Button>
      );
      break;

    case "USER_IS_LATE":
    case "USER_IS_VERY_LATE":
      content = (
        <Button onClick={openNotificationHandler(n.targetPage)}>
          {n.userName} закъснява за следващата спирка
        </Button>
      );
      break;

    default:
      break;
  }

  return content;
};

export default NotificationLink;
