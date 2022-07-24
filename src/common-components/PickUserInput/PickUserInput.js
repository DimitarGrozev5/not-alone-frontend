/*
 * TODO: Make the page expand as to make the suggetions bubble not overlap the navbar
 */

import { useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/useHttpClient";
import { useSState } from "../../hooks/useSState";

import useUserService from "../../services/useUserService";
import Button from "../FormElements/Button/Button";
import LoadingSpinner from "../UIComponents/LoadingSpinner/LoadingSpinner";
import styles from "./PickUserInput.module.css";

let i = 1;

const PickUserInput = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // State that stores and controls the input field value
  const [searchText, setSearchText, { onChangeHandler: changeSearchText }] =
    useSState("");

  // State that stores and controls the search query value
  const [searchQuery, setSearchQuery, { onChangeHandler: changeSearchQuery }] =
    useSState("");

  // State that stores the search results
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Make sure the search query changes, when the searchText Changes
    setSearchQuery(searchText);
  }, [searchText]);

  // State that controls if the floating window is open
  const [showFloater, setShowFloater] = useState(false);

  // Cleat search text when the props.value changes to null
  // If the searchQuery is not empty then props.value
  // was changed by the component and the seatch text shouldn't be reset
  // If the searchQuery is empty then props.value
  // was changed by the outside enviroment and a new search should begin
  useEffect(() => {
    if (!props.value && !searchQuery) {
      setSearchText("");
    }
  }, [props.value]);

  // Perform search when the searchQuery changes and the props.value is null
  useEffect(() => {
    let active = true;
    let timeoutHandle;

    if (!props.value && searchQuery) {
      // Define search function
      // It updates the state only if the "active" flag is true
      // The active flag is set to false on useEffect exit
      const search = async () => {
        const route = `users?query=${encodeURIComponent(searchQuery)}`;

        const res = await sendRequest(route, null, { auth: true });
        if (active) {
          setShowFloater(true);
          if (props.searchInContacts) {
            setSearchResults([...res.connected, ...res.notConnected]);
          } else {
            setSearchResults([...res.notConnected]);
          }
        }
      };

      // Start a throtling timeout to give the user a chance to input
      // a couple of characters before making a fetch request
      // Don't make the request if useEffect has set active to false
      setTimeout(() => {
        if (active) {
          search();
        }
      }, 500);
    }

    // If the search query is empty, clear the search results
    if (searchQuery === "") {
      setSearchResults([]);
    }

    return () => {
      active = false;
      clearTimeout(timeoutHandle);
    };
  }, [searchQuery, props.value]);

  const focusHandler = (event) => {
    setSearchQuery(searchText);
    setShowFloater(true);
  };
  const blurHandler = (event) => {
    // TODO: find a solution that is not hacky
    setTimeout(() => {
      setSearchQuery("");
      setShowFloater(false);
    }, 50);
  };

  const selectSuggetionHandler = (suggetion) => (event) => {
    setSearchResults([]);
    props.onChange(suggetion);
  };

  const editSelectedHandler = (event) => {
    setSearchQuery(searchText);
    props.onChange(null);
  };

  return (
    <div className={styles["pick-user"]}>
      <label htmlFor="add-contact">{props.title || "Добави контакт:"}</label>
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
            onChange={changeSearchText}
            autoComplete="off"
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        )}
        {showFloater && !!searchText && (
          <div className={styles.suggetions}>
            {isLoading && (
              <div className={styles.loader}>
                <LoadingSpinner />
              </div>
            )}
            {!isLoading && searchResults && !!searchResults.length && (
              <ul>
                {searchResults.map((s) => (
                  <li key={s.id}>
                    <span>
                      {s.name} {s.phone}
                    </span>
                    <Button onClick={selectSuggetionHandler(s)}>Избери</Button>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && searchResults && !searchResults.length && (
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
