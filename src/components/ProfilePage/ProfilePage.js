/*
 * TODO
 * The page should be made to reload after a request for connection is send
 */

import useMessages from "../../services/useMessages";
import { useRequestsService } from "../../services/useRequestsService";
import useUserService from "../../services/useUserService";
import styles from "./ProfilePage.module.css";
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

const ProfilePage = (props) => {
  // Get Services
  const userService = useUserService();
  const requestsService = useRequestsService();
  const messages = useMessages();

  // Setup loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  // Get data about the user on first load
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      return () => {};
    }

    setIsLoading(true);
    userService
      .getUserData()
      .then((data) => {
        setIsLoading(false);
        setUser(data);
      })
      .catch((err) => setError(err.message));
  }, [userService, user]);

  // Logout user
  const logoutHandler = () => {
    setIsLoading(true);
    userService.logout().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
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

    setIsLoading(true);

    requestsService
      .requestConnection(newUser.id)
      .then(() => {
        messages.alert("Request is send");
        setNewUser(null);
        setUser(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const acceptRequestHandler = (id) => (event) => {
    event.preventDefault();

    setIsLoading(true);

    requestsService
      .acceptRequest(id)
      .then(() => {
        setNewUser(null);
        setUser(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal error={error} onClose={setError.bind(null, undefined)} />
      )}

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
            <Button onClick={logoutHandler}>Излизане от профила</Button>
          </DataCard>
        </>
      )}
    </>
  );
};

export default ProfilePage;
