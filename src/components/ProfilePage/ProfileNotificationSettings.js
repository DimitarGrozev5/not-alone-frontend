import webpush from "web-push";

import { useEffect, useState } from "react";
import Button from "../../common-components/FormElements/Button/Button";
import styles from "./ProfilePage.module.css";
import { urlBase64ToUint8Array } from "../../utils/urlBase64ToUint8Array";
import { useHttpClient } from "../../hooks/useHttpClient";
import { useSelector } from "react-redux";

const ProfileNotificationSettings = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useSelector((state) => state.user.userData.userId);

  const [notifsEnabled, setNotifsEnabled] = useState(false);
  useEffect(() => {
    if ("Notification" in window && "permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        if (result.state === "granted") {
          setNotifsEnabled(true);
        } else {
          setNotifsEnabled(false);
        }
      });
    }
  }, []);

  const askForNotifPermission = () => {
    Notification.requestPermission((result) => {
      if (result !== "granted") {
        setNotifsEnabled(false);
      } else {
        setNotifsEnabled(true);
        const options = {
          body: "Можете да контролирате кои нотификации да излизат, от профилната Ви страница.",
          icon: "/road.png",
          vibrate: [100, 50, 200],
          // tag: "confirm-notification", // Acts as an id, to replace notifications with newer one
          // renotify: true, // New notifications with the same tag will alert again
          // actions: [
          //   {
          //     action: "confirm",
          //     title: "Провери настройки",
          //     // icon: "/road.png",
          //   },
          // ],
        };
        // new Notification("Успешно включихте нотификациите", options);
        navigator.serviceWorker.ready.then((swReg) => {
          swReg.showNotification("Успешно включихте нотификациите", options);
        });
      }
    });
  };

  const configurePushSub = () => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let reg;
    navigator.serviceWorker.ready
      .then((swreg) => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then((subs) => {
        // if (subs === null) {
        // const convVapidKey = urlBase64ToUint8Array(
        //   process.env.REACT_APP_VAPID_PUBLIC_KEY
        // );
        // Create new subscription
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
        });
        // } else {
        //   // We have a subscription
        // }
      })
      .then((newSub) => {
        // Save new subscription to server
        const uData = JSON.parse(localStorage.getItem("jwt"));
        return sendRequest(
          `/users/${uData.userId}/settings/notifications/subscriptions`,
          { subscription: JSON.stringify(newSub) },
          { auth: true }
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h3>Настройки на нотификациите</h3>
      {!("Notification" in window) && (
        <h4>
          Този браузър не подържа нотификации. Няма да получавате дори да ги
          включите.
        </h4>
      )}
      {!notifsEnabled && "Notification" in window && (
        <h4>
          Нотификациите са изключени за този браузър. Трябва да ги включите от
          настройките му.
        </h4>
      )}
      <div>
        Receive requests:{" "}
        {props.notifSettings.receiveRequests ? "True" : "False"}
      </div>
      <div>
        Receive alerts: {props.notifSettings.receiveAlerts ? "True" : "False"}
      </div>
      <Button onClick={askForNotifPermission}>Нотификация</Button>
      <Button onClick={configurePushSub}>Test subscription</Button>
    </>
  );
};

export default ProfileNotificationSettings;
