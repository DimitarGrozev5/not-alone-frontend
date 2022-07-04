import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadStatus } from "../../data-types/LoadStatus";
import { requestActions } from "../../redux-store/requestsSlice";
import useMessages from "../../services/useMessages";

import { useRequestsService } from "../../services/useRequestsService";
import useUserService from "../../services/useUserService";

const ProfileAddConnection = (props) => {
  const dispatch = useDispatch();

  // Get Services
  const userService = useUserService();
  const requestsService = useRequestsService();
  const messages = useMessages();

  // State that handles the search phone input
  const [searchPhoneText, setSearchPhoneText] = useState("");
  const searchHandler = (event) => {
    const phone = event.target.value;
    setSearchPhoneText(phone);
  };

  // State and Effect that fetches phone suggestions everytime the search text changes
  const [suggetions, setSuggetions] = useState(new LoadStatus.Idle());
  useEffect(() => {
    if (!searchPhoneText.length) {
      return () => {};
    }
    let active = true;
    const interval = setTimeout(() => {
      userService
        .findUserByPhone(searchPhoneText)
        .then((results) => {
          if (active) {
            setSuggetions(results);
          }
        })
        .catch((err) => console.log(err));
    }, 500);

    return () => {
      active = false;
      clearTimeout(interval);
    };
  }, [searchPhoneText, userService]);

  // Select suggestion handler
  const selectSuggetionHandler = (phone) => (event) => {
    event.preventDefault();
    setSearchPhoneText(phone);
    setSuggetions(new LoadStatus.Idle());
  };

  // Handle requests for connecting with other people
  const submitHandler = (event) => {
    event.preventDefault();
    userService
      .requestConnection(searchPhoneText)
      .then((result) => {
        if (result instanceof LoadStatus.Error) {
          throw result;
        }
        messages.alert(result.result);
        setSearchPhoneText("");
        return requestsService.getConnectionRequests();
      })
      .then((requsets) => dispatch(requestActions.updateRequests(requsets)))
      .catch((err) => {
        messages.alert(err.message);
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler} autoComplete="off">
        <label htmlFor="add-contact">Добави контакт:</label>
        <input
          type="text"
          name="add-contact"
          placeholder="Номер: 088 123 1234"
          value={searchPhoneText}
          onChange={searchHandler}
        />
        {suggetions instanceof LoadStatus.Loaded && (
          <ul>
            {suggetions.result.map((s) => (
              <li key={s.phone}>
                <button onClick={selectSuggetionHandler(s.phone)}>
                  {s.phone}
                </button>
              </li>
            ))}
          </ul>
        )}
        {suggetions instanceof LoadStatus.Empty && (
          <div>Телефонът не е намерен</div>
        )}
        {suggetions instanceof LoadStatus.Error && (
          <div>{suggetions.message}</div>
        )}

        <button type="submit">Изпрати покана</button>
      </form>
    </div>
  );
};

export default ProfileAddConnection;
