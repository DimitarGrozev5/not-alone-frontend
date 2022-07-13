import styles from "./ProfilePage.module.css";

const ProfileOverview = (props) => {
  return (
    <>
      <div className={styles["data-point"]}>
        <span>Име:</span> {props.userData.name}
      </div>
      <div className={styles["data-point"]}>
        <span>Имейл:</span> {props.userData.email}
      </div>
      <div className={styles["data-point"]}>
        <span>Телефон:</span> {props.userData.phone}
      </div>
      <div className={styles["data-point"]}>
        <span>Контакти:</span>
        {!!props.connections.length && (
          <ul>
            {props.connections.map((c) => (
              <li key={c.id}>
                <div>
                  {c.name}: {c.phone}
                </div>
              </li>
            ))}
          </ul>
        )}
        {!props.connections.length && (
          <div className={styles.empty}>Все още нямате контакти</div>
        )}
      </div>
    </>
  );
};

export default ProfileOverview;
