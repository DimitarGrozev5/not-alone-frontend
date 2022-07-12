const ProfileOverview = (props) => {
  return (
    <>
      <div>Име: {props.userData.name}</div>
      <div>Имейл: {props.userData.email}</div>
      <div>Телефон: {props.userData.phone}</div>
      <div>
        Контакти:
        {!!props.connections.length && (
          <ul>
            {props.connections.map((c) => (
              <li key={c.phone}>
                <div>Име: {c.name}</div>
                <div>Телефон: {c.phone}</div>
              </li>
            ))}
          </ul>
        )}
        {!props.connections.length && <div>Все още нямате контакти</div>}
      </div>
    </>
  );
};

export default ProfileOverview;
