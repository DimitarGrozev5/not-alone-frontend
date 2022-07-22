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
    props.onClick();
    navigate("");
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

    default:
      break;
  }

  return content;
};

export default NotificationLink;
