import { useEffect, useState } from "react";
import Button from "../../common-components/FormElements/Button/Button";
import styles from "./ProfilePage.module.css";

const ProfileNotificationSettings = (props) => {
  const [notifsEnabled, setNotifsEnabled] = useState(false);
  useEffect(() => {
    if ("Notification" in window && "permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        if (result.state == "granted") {
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
          actions: [
            {
              action: "confirm",
              title: "Провери настройки",
              // icon: "/road.png",
            },
          ],
        };
        // new Notification("Успешно включихте нотификациите", options);
        navigator.serviceWorker.ready.then((swReg) => {
          swReg.showNotification("Успешно включихте нотификациите", options);
        });
      }
    });
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
      <Button onClick={askForNotifPermission}>Нотификация</Button>
    </>
  );
};

export default ProfileNotificationSettings;
