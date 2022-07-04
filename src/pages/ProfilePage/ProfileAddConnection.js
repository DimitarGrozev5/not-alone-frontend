import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadStatus } from "../../data-types/LoadStatus";
import useUserService from "../../services/useUserService";

const ProfileAddConnection = (props) => {
  const dispatch = useDispatch();

  // Get Services
  const userService = useUserService();

  // State that handles the search phone input
  const [searchPhoneText, setSearchPhoneText] = useState("");
  const searchHandler = (event) => {
    const phone = event.target.value;
    setSearchPhoneText(phone);
  };

  // State and Effect that fetches phone suggestions everytime the search text changes
  const [selectedSuggetion, setSelectedSuggetion] = useState(null);
  const [suggetions, setSuggetions] = useState(new LoadStatus.Idle());
  useEffect(() => {
    if (!searchPhoneText.length) {
      return () => {};
    }
    let active = true;
    const interval = setTimeout(() => {
      const service = props.all
        ? "findAllUsersByPhone"
        : "findUnknownUserByPhone";
      userService[service](searchPhoneText)
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
  const selectSuggetionHandler = (suggetion) => (event) => {
    event.preventDefault();
    setSearchPhoneText(suggetion.phone);
    setSelectedSuggetion(suggetion);
    setSuggetions(new LoadStatus.Idle());
  };

  // Handle requests for connecting with other people
  const submitHandler = (event) => {
    event.preventDefault();
    props.onSubmit(selectedSuggetion, () => setSearchPhoneText(""));
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
              <li key={s.id}>
                <button onClick={selectSuggetionHandler(s)}>
                  {s.name} {s.phone}
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

        <button type="submit">{props.caption || "Изпрати покана"}</button>
      </form>
    </div>
  );
};

export default ProfileAddConnection;
