import Button from "../../common-components/FormElements/Button/Button";

const ProfileInRequests = (props) => {
  return (
    <>
      Тези хора искат да се свържат с Вас:
      {!!props.inRequests.length && (
        <ul>
          {props.inRequests.map((r) => (
            <li key={r.id}>
              {r.name}, {r.phone}
              <Button onClick={props.onAccept(r.id)}>Приеми</Button>
            </li>
          ))}
        </ul>
      )}
      {!props.inRequests.length && <p>Нямате нови предложения</p>}
    </>
  );
};

export default ProfileInRequests;
