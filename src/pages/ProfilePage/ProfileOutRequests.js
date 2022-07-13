const ProfileOutRequests = (props) => {
  return (
    <>
      Изпратени покани:
      {!!props.outRequests.length && (
        <ul>
          {props.outRequests.map((r) => (
            <li key={r.id}>
              {r.phone}
            </li>
          ))}
        </ul>
      )}
      {!props.outRequests.length && <p>Нямате изпратени покани</p>}
    </>
  );
};

export default ProfileOutRequests;
