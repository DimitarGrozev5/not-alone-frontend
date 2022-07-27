import ProfileOverview from "./ProfileOverview";
import ProfileOutRequests from "./ProfileOutRequests";
import ProfileInRequests from "./ProfileInRequests";
import { useEffect, useState } from "react";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import PickUserInput from "../../common-components/PickUserInput/PickUserInput";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import ConfirmModal from "../../common-components/UIComponents/ConfirmModal/ConfirmModal";
import { useHState } from "../../hooks/useHState";
import Button from "../../common-components/FormElements/Button/Button";
import { useHttpClient } from "../../hooks/useHttpClient";
import { requestTypes } from "../../data-types/trip-data";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux-store/userSlice";
import ProfileNotificationSettings from "./ProfileNotificationSettings";

const ProfilePage = (props) => {
  const dispatch = useDispatch();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Get data about the user on first load
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      const fetchData = async () => {
        try {
          const uData = JSON.parse(localStorage.getItem("jwt"));
          const userData = await sendRequest(`/users/${uData.userId}`, null, {
            auth: true,
          });
          setUser({ ...userData, token: uData.token, id: uData.userId });
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [sendRequest, user]);

  // Logout user
  const logoutHandler = async () => {
    try {
      await sendRequest("/users/logout", {
        token: user.token,
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
      await sendRequest(
        "/requests",
        {
          from: user.id,
          to: newUser.id,
          type: requestTypes.CONNECTION,
        },
        { auth: true }
      );

      setNewUser(null);
      setUser(null);
    } catch (err) {
      console.log();
    }
  };

  const acceptRequestHandler = (id) => async (event) => {
    event.preventDefault();

    try {
      await sendRequest(`/requests/${id}/accept`, null, {
        auth: true,
        method: "POST",
      });
      setNewUser(null);
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}

      {showConfirmation && (
        <ConfirmModal
          message="Да бъде ли изпратена покана? Другият потребител ще види името и имейла Ви."
          onConfirm={requestConnectionHandler(true)}
          onCancel={setShowConfirmationHandler(false)}
        />
      )}

      <DataCard fullWidth>
        <h1>Профил</h1>
      </DataCard>

      {user && (
        <>
          <DataCard fullWidth>
            <ProfileOverview
              userData={user.userData}
              connections={user.connections}
            />
            <PickUserInput value={newUser} onChange={setNewUser} />
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
            <Button onClick={logoutHandler}>Излизане от профила</Button>
          </DataCard>
        </>
      )}
    </>
  );
};

export default ProfilePage;
