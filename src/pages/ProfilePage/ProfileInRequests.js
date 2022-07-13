import { useDispatch } from "react-redux";

import { requestActions } from "../../redux-store/requestsSlice";
import useMessages from "../../services/useMessages";
import { useRequestsService } from "../../services/useRequestsService";

const ProfileInRequests = (props) => {
  return (
    <>
      Тези хора искат да се свържат с Вас:
      {!!props.inRequests.length && (
        <ul>
          {props.inRequests.map((r) => (
            <li key={r.id}>
              {r.name}, {r.phone}
              <button onClick={props.onAccept(r.id)}>Приеми</button>
            </li>
          ))}
        </ul>
      )}
      {!props.inRequests.length && <p>Нямате нови предложения</p>}
    </>
  );
};

export default ProfileInRequests;
