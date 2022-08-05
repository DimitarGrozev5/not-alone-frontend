import ProfileOverview from "./ProfileOverview";
import ProfileOutRequests from "./ProfileOutRequests";
import ProfileInRequests from "./ProfileInRequests";
import { useState } from "react";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import PickUserInput from "../../common-components/PickUserInput/PickUserInput";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import ConfirmModal from "../../common-components/UIComponents/ConfirmModal/ConfirmModal";
import { useHState } from "../../hooks/useHState";
import Button from "../../common-components/FormElements/Button/Button";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux-store/userSlice";
import ProfileNotificationSettings from "./ProfileNotificationSettings";
import { useLoadPageData } from "../../hooks/useLoadPageData";

const ProfilePage = (props) => {
  const dispatch = useDispatch();

  const uData = JSON.parse(localStorage.getItem("jwt"));
  const {
    data,
    dataSource,
    reloadData,
    isLoading,
    error,
    sendRequest,
    clearError,
  } = useLoadPageData(`/users/${uData.userId}`, { getCache: true });

  const user = data ? { ...data, token: uData.token, id: uData.userId } : null;
  const offline = dataSource !== "network";

  // Logout user
  const logoutHandler = async () => {
    try {
      await sendRequest("/users/logout", {
        body: {
          token: user.token,
        },
      });
      localStorage.removeItem("jwt");
      dispatch(userActions.logout());
    } catch (err) {
      console.log(err);
    }
  };

  // Serach for user input
  const [newUser, setNewUser] = useState(null);

  // Confirm modal state
  const [showConfirmation, setShowConfirmationHandler] = useHState(false);

  const requestConnectionHandler = (confirmed) => async (event) => {
    if (!confirmed) {
      setShowConfirmationHandler(true)();
      return;
    }

    setShowConfirmationHandler(false)();

    try {
      await sendRequest("/requests", {
        body: {
          from: user.id,
          to: newUser.id,
          type: "CONNECTION",
        },
      });

      setNewUser(null);
      reloadData();
    } catch (err) {
      console.log();
    }
  };

  const acceptRequestHandler = (id) => async (event) => {
    event.preventDefault();

    try {
      await sendRequest(`/requests/${id}/accept`, {
        method: "POST",
      });
      setNewUser(null);
      reloadData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          asOverlay={dataSource !== "cache"}
          centerPage={dataSource === "cache"}
        />
      )}
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <ConfirmModal
        show={!!showConfirmation}
        message="Да бъде ли изпратена покана? Другият потребител ще види името и имейла Ви."
        onConfirm={requestConnectionHandler(true)}
        onCancel={setShowConfirmationHandler(false)}
      />

      <DataCard fullWidth>
        <h1>Профил {offline && !isLoading && "(Офлайн)"}</h1>
      </DataCard>

      {dataSource === "no-data" && (
        <DataCard>
          <h4>
            Нямате интернет връзка и страницата не е кеширана. Пробвайте отново,
            когато имате достъп до интернет.
          </h4>
        </DataCard>
      )}

      {user && (
        <>
          <DataCard fullWidth>
            <ProfileOverview
              userData={user.userData}
              connections={user.connections}
            />
            <PickUserInput
              disabled={offline}
              value={newUser}
              onChange={setNewUser}
            />
            {!!newUser && (
              <Button onClick={requestConnectionHandler(false)}>
                Свържете се
              </Button>
            )}
          </DataCard>

          <DataCard fullWidth>
            <ProfileOutRequests outRequests={user.outConReq} />
          </DataCard>

          <DataCard fullWidth>
            <ProfileInRequests
              inRequests={user.inConReq}
              onAccept={acceptRequestHandler}
            />
          </DataCard>

          <DataCard fullWidth>
            <ProfileNotificationSettings
              notifSettings={user.userData.settings.notifications}
            />
          </DataCard>

          <DataCard fullWidth>
            <Button onClick={logoutHandler} disabled={offline}>
              Излизане от профила
            </Button>
          </DataCard>
        </>
      )}
    </>
  );
};

export default ProfilePage;
