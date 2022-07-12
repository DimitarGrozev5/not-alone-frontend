import { useEffect, useState } from "react";

import { LoadStatus } from "../../data-types/LoadStatus";
import useUserService from "../../services/useUserService";
import LoadingSpinner from "../UIComponents/LoadingSpinner/LoadingSpinner";
import styles from "./PickUserInput.module.css";

const PickUserInput = (props) => {
  // Get Services
  const userService = useUserService();

  // State that controls the search phone input
  const [searchText, setSearchText] = useState("");
  const searchHandler = (event) => {
    const query = event.target.value;
    setSearchText(query);
  };

  // State and Effect that fetches phone suggestions everytime the search text changes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const [suggetions, setSuggetions] = useState(null);

  const showFloater = !props.value && (isLoading || error || suggetions);

  useEffect(() => {
    if (!searchText.length) {
      return () => {};
    }

    let active = true;
    const interval = setTimeout(() => {
      const service = props.searchInContacts
        ? userService.findAllUsers
        : userService.findUnknownUsers;

      setIsLoading(true);
      setError(undefined);
      service(searchText)
        .then((results) => {
          if (active) {
            setIsLoading(false);
            setSuggetions(results);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err.message);
          console.log(err);
        });
    }, 500);

    return () => {
      active = false;
      clearTimeout(interval);
      setIsLoading(false);
    };
  }, [searchText, userService]);

  // Select suggestion handler
  const selectSuggetionHandler = (suggetion) => (event) => {
    event.preventDefault();
    setSearchText(suggetion.phone);
    setSuggetions(null);
    props.onChange(suggetion);
  };

  const editSelectedHandler = (event) => {
    props.onChange(null);
    setSearchText(props.value.phone);
  };

  const blurHandler = () => {
    setTimeout(() => {
      setSuggetions(null);
    }, 0);
  };

  return (
    <div className={styles["pick-user"]}>
      <label htmlFor="add-contact">Добави контакт:</label>
      <div className={styles.input}>
        {!!props.value && (
          <span onClick={editSelectedHandler}>{props.value.phone}</span>
        )}
        {!props.value && (
          <input
            type="text"
            name="add-contact"
            placeholder="Номер: 088 123 1234"
            value={searchText}
            onChange={searchHandler}
            autoComplete="off"
            onBlur={blurHandler}
          />
        )}
        {showFloater && (
          <div className={styles.suggetions}>
            {isLoading && (
              <div className={styles.loader}>
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && suggetions && !!suggetions.length && (
              <ul>
                {suggetions.map((s) => (
                  <li key={s.id}>
                    <span>
                      {s.name} {s.phone}
                    </span>
                    <button onClick={selectSuggetionHandler(s)}>Избери</button>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && suggetions && !suggetions.length && (
              <span className={styles.empty}>Потребителят не е намерен</span>
            )}
            {!!error && <span className={styles.error}>{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PickUserInput;