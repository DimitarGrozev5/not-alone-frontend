const ProfileOutRequests = (props) => {
  return (
    <>
      Изпратени покани:
      {!!props.outRequests.length && (
        <ul>
          {props.outRequests.map((r) => (
            <li key={r.phone}>
              {r.name}, {r.phone}
            </li>
          ))}
        </ul>
      )}
      {!props.outRequests.length && <p>Нямате изпратени покани</p>}
    </>
  );
};

export default ProfileOutRequests;
