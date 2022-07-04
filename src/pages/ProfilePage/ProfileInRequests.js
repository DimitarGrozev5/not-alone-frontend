import { useDispatch } from "react-redux";

import { requestActions } from "../../redux-store/requestsSlice";
import useMessages from "../../services/useMessages";
import { useRequestsService } from "../../services/useRequestsService";

const ProfileInRequests = (props) => {
  const dispatch = useDispatch();

  // Get Services
  const requestsService = useRequestsService();
  const messages = useMessages();

  const acceptRequestHandler = (id) => (event) => {
    event.preventDefault();
    requestsService
      .acceptRequest(id)
      .then(() => requestsService.getConnectionRequests())
      .then((requests) => dispatch(requestActions.updateRequests(requests)))
      .catch((err) => messages.alert(err.message));
  };

  return (
    <>
      Тези хора искат да се свържат с теб:
      {props.inRequests.length && (
        <ul>
          {props.inRequests.map((r) => (
            <li key={r.id}>
              {r.name}, {r.phone}
              <button onClick={acceptRequestHandler(r.id)}>Приеми</button>
            </li>
          ))}
        </ul>
      )}
      {!props.inRequests.length && <p>Нямаш предложения</p>}
    </>
  );
};

export default ProfileInRequests;
