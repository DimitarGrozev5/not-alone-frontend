import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useUserService from "../../services/useUserService";
import styles from "./ProfilePage.module.css";
import { LoadStatus } from "../../data-types/LoadStatus";
import useMessages from "../../services/useMessages";

const ProfilePage = (props) => {
  // Get Services
  const userService = useUserService();
  const messages = useMessages();

  // Get data about the user from the store
  const user = useSelector((state) => state.user);

  // Logout user
  const logoutHandler = () => userService.logout();

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
      })
      .catch((err) => {
        messages.alert(err.message);
      });
  };

  return (
    <div>
      <div>Име: {user.userData.name}</div>
      <div>Имейл: {user.userData.email}</div>
      <div>Телефон: {user.userData.phone}</div>
      <div>
        Контакти:
        <ul>
          {user.connections.map((c) => (
            <li key={c.phone}>
              <div>Име: {c.name}</div>
              <div>Телефон: {c.phone}</div>
            </li>
          ))}
        </ul>

        <form onSubmit={submitHandler}>
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
                  <button onClick={() => setSearchPhoneText(s.phone)}>
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
      <div>
        Изпратени покани:
          
        Тези хора искат да се свържат с теб:
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default ProfilePage;
