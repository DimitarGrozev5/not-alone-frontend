import { useSelector } from "react-redux";

import useUserService from "../../services/useUserService";
import styles from "./ProfilePage.module.css";
import ProfileOverview from "./ProfileOverview";
import ProfileAddConnection from "./ProfileAddConnection";
import ProfileOutRequests from "./ProfileOutRequests";
import ProfileInRequests from "./ProfileInRequests";

const ProfilePage = (props) => {
  // Get Services
  const userService = useUserService();

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

  return (
    <div className={styles.profile}>
      <ProfileOverview
        userData={user.userData}
        connections={user.connections}
      />
      <ProfileAddConnection />
      <div>
        <ProfileOutRequests outRequests={outRequests} />
        <ProfileInRequests inRequests={inRequests} />
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default ProfilePage;
