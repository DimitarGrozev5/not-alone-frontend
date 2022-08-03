import { useEffect, useState, useCallback } from "react";
import Button from "../../common-components/FormElements/Button/Button";
// import styles from "./ProfilePage.module.css";
import { useHttpClient } from "../../hooks/useHttpClient";
// import { useSelector } from "react-redux";
import { useSState } from "../../hooks/useSState";
import Modal from "../../common-components/UIComponents/Modal/Modal";

const ProfileNotificationSettings = (props) => {
  const { sendRequest } = useHttpClient();
  // const userId = useSelector((state) => state.user.userData.userId);

  const [notifsEnabled, setNotifsEnabled] = useState(false);
  const [notifsModal, setNotifsModal, { passValueHandler: setNotifsModalTo }] =
    useSState(false);
  useEffect(() => {
    // Check wheater some of the settings are on
    if (
      !props.notifSettings.receiveRequests &&
      !props.notifSettings.receiveAlerts
    ) {
      return;
    }

    // Check if the user has rejected the notifications prompt
    if (localStorage.getItem("notifs-prompt") === "rejected") {
      return;
    }

    // Check if notification permission is granted
    if ("Notification" in window && "permissions" in navigator) {
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        if (result.state === "granted") {
          setNotifsEnabled(true);
        } else {
          setNotifsModal(true);
        }
      });
    }
  }, [
    props.notifSettings.receiveAlerts,
    props.notifSettings.receiveRequests,
    setNotifsModal,
  ]);

  const showNotifsButton =
    (props.notifSettings.receiveRequests ||
      props.notifSettings.receiveAlerts) &&
    localStorage.getItem("notifs-prompt") === "rejected" &&
    "Notification" in window;

  const cancelNotifPrompt = () => {
    setNotifsModal(false);
    localStorage.setItem("notifs-prompt", "rejected");
  };

  const askForNotifPermission = useCallback(() => {
    setNotifsModal(false);
    Notification.requestPermission((result) => {
      if (result !== "granted") {
        setNotifsEnabled(false);
      } else {
        localStorage.removeItem("notifs-prompt");
        setNotifsEnabled(true);
      }

      // Configure new subscription
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
          // Create new subscription
          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
          });
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
        .then(() => alert("Устройството ще получава нотификации!"))
        .catch((err) => console.log(err));
    });
  }, [sendRequest, setNotifsModal]);

  // If notification subscribtions are empty for some reason, then make a new subscribtion
  useEffect(() => {
    if (
      !props.notifSettings.subscriptions.length &&
      (props.notifSettings.receiveRequests || props.notifSettings.receiveAlerts)
    ) {
      askForNotifPermission();
    }
  }, [props.notifSettings, askForNotifPermission]);

  return (
    <>
      <Modal
        show={!!notifsModal}
        title="Нотификации"
        onClose={setNotifsModalTo(false)}
      >
        <div>
          Нотификациите не са активирани на това устройство. Няма да получавате
          съобщения ако се случи нещо важно. Искате ли да ги включите?
        </div>
        <Button onClick={askForNotifPermission}>Да</Button>
        <Button onClick={cancelNotifPrompt}>Не</Button>
      </Modal>

      <h3>Настройки на нотификациите</h3>
      {!("Notification" in window) && (
        <h4>
          Този браузър не подържа нотификации. Няма да получавате дори да са
          включени.
        </h4>
      )}
      {!notifsEnabled && "Notification" in window && (
        <h4>
          Нотификациите са изключени за този браузър. Трябва да ги включите от
          настройките му.{" "}
          {showNotifsButton && (
            <Button onClick={setNotifsModalTo(true)}>Включи</Button>
          )}
        </h4>
      )}
      <div>
        Receive requests:{" "}
        {props.notifSettings.receiveRequests ? "True" : "False"}
      </div>
      <div>
        Receive alerts: {props.notifSettings.receiveAlerts ? "True" : "False"}
      </div>
    </>
  );
};

export default ProfileNotificationSettings;
