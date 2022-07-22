// TODO: If the target page is opened, navigate will not prompt a reload of the data
// This means that the current page will not have the latest data

// import styles from "./NotificationLink.module.css"

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notificationActions } from "../../../../redux-store/notificationsSlice";
import Button from "../../../FormElements/Button/Button";

const NotificationLink = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const n = props.notification;

  const openNotificationHandler = (target) => (event) => {
    event.preventDefault();
    dispatch(notificationActions.removeNotification(n.id));
    navigate(target);
    props.onClick();
  };

  let content = "";
  switch (n.type) {
    case "OVERWATCH_REQUEST":
      content = (
        <Button onClick={openNotificationHandler("/watching")}>
          Има нови покани за наблюдаване
        </Button>
      );
      break;

    case "CONNECTION_REQUEST":
      content = (
        <Button onClick={openNotificationHandler("/profile")}>
          Има нови покани за приятелство
        </Button>
      );
      break;

    case "TRIP_STARTED":
      content = (
        <Button onClick={openNotificationHandler(`/watch/${n.targetId}`)}>
          {n.userName} започна своето пътуване {n.targetName}
        </Button>
      );
      break;

    case "USER_IS_LATE":
    case "USER_IS_VERY_LATE":
      content = (
        <Button onClick={openNotificationHandler(`/watch/${n.targetId}`)}>
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
