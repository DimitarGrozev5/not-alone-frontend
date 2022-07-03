import { useSelector } from "react-redux";

import styles from "./ProfilePage.module.css";

const ProfilePage = (props) => {
  const userData = useSelector((state) => state.user);
  return <div></div>;
};

export default ProfilePage;
