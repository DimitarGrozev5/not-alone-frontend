import { useDispatch, useSelector } from "react-redux";

import { requestActions } from "../../redux-store/requestsSlice";
import useMessages from "../../services/useMessages";
import { useRequestsService } from "../../services/useRequestsService";
import useUserService from "../../services/useUserService";
import styles from "./ProfilePage.module.css";
import ProfileOverview from "./ProfileOverview";
import ProfileAddConnection from "./ProfileAddConnection";
import ProfileOutRequests from "./ProfileOutRequests";
import ProfileInRequests from "./ProfileInRequests";
import { LoadStatus } from "../../data-types/LoadStatus";
import { useEffect, useState } from "react";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";

const ProfilePage = (props) => {
  // Get Services
  const userService = useUserService();
  const requestsService = useRequestsService();
  const messages = useMessages();
  const dispatch = useDispatch();

  // Setup loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  // Get data about the user on first load
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    userService
      .getUserData()
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, [userService]);

  // Logout user
  const logoutHandler = () => {
    setIsLoading(true);
    userService.logout().catch((err) => {
      setIsLoading(false);
      setError(err.message);
    });
  };

  const requestConnectionHandler = (searchPhoneUser, clearText) => {
    requestsService
      .requestConnection(searchPhoneUser.phone) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Maybe it should be ID
      .then((result) => {
        if (result instanceof LoadStatus.Error) {
          throw result;
        }
        messages.alert(result.result);
        clearText();
        return requestsService.getConnectionRequests();
      })
      .then((requsets) => dispatch(requestActions.updateRequests(requsets)))
      .catch((err) => {
        messages.alert(err.message);
      });
  };

  return (
    <div className={styles.profile}>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal error={error} onClose={setError.bind(null, undefined)} />
      )}
      {user && false && (
        <>
          <ProfileOverview
            userData={user.userData}
            connections={user.connections}
          />
          <ProfileAddConnection onSubmit={requestConnectionHandler} />
          <div>
            <ProfileOutRequests outRequests={user.outRequests} />
            <ProfileInRequests inRequests={user.inRequests} />
          </div>
          <button onClick={logoutHandler}>Logout</button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
