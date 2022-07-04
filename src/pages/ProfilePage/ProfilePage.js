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

const ProfilePage = (props) => {
  // Get Services
  const userService = useUserService();
  const requestsService = useRequestsService();
  const messages = useMessages();
  const dispatch = useDispatch();

  // Get data about the user from the store
  const user = useSelector((state) => state.user);
  const outRequests = useSelector(
    (state) => state.requests.requestsForConnectionSend
  );
  const inRequests = useSelector(
    (state) => state.requests.requestsForConnectionReceived
  );

  // Logout user
  const logoutHandler = () => userService.logout();

  const requestConnectionHandler = (searchPhoneUser, clearText) => {
    userService
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
      <ProfileOverview
        userData={user.userData}
        connections={user.connections}
      />
      <ProfileAddConnection onSubmit={requestConnectionHandler} />
      <div>
        <ProfileOutRequests outRequests={outRequests} />
        <ProfileInRequests inRequests={inRequests} />
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default ProfilePage;
