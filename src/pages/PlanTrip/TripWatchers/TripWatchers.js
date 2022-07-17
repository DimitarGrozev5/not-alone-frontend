import { useState } from "react";
import Button from "../../../components/FormElements/Button/Button";
import PickUserInput from "../../../components/PickUserInput/PickUserInput";
import { useTState } from "../../../hooks/useTState";
import styles from "./TripWatchers.module.css";

const TripWatchers = (props) => {
  const w = props.watchers;

  const [viewMode, toggleViewMode] = useTState(props.mode !== "create");
  const showAddNew = props.mode !== "view" && !viewMode;

  const [newUser, setNewUser] = useState(null);
  const addNewUserHandler = (event) => {
    event.preventDefault();
    if (!newUser) {
      return;
    }

    props.watcherActions.addNewWatcher(newUser);
    setNewUser(null);
  };

  return (
    <div className={styles.container}>
      {props.mode === "edit" && (
        <Button className={styles["edit-button"]} onClick={toggleViewMode}>
          {viewMode ? "Edit" : "OK"}
        </Button>
      )}
      {showAddNew && (
        <>
          <h2>Нови покани:</h2>
          <ul>
            {w.new.map((c) => (
              <li key={c.id}>
                {c.data.name} {c.data.phone}
              </li>
            ))}
          </ul>

          <PickUserInput
            title="Добави наблюдател:"
            searchInContacts
            value={newUser}
            onChange={setNewUser}
          />
          {newUser && <Button onClick={addNewUserHandler}>Добави</Button>}
          <hr />
        </>
      )}

      {props.mode !== "create" && <Confirmed watchers={w} />}
      {props.mode !== "create" && <Pending watchers={w} />}
    </div>
  );
};

function Confirmed({ watchers }) {
  return !watchers.confirmed ? (
    <h2>Никой не е потвърдил все още</h2>
  ) : (
    <>
      <h2>Потвърдили:</h2>
      <ul>
        {watchers.confirmed.map((c) => (
          <li key={c.id}>
            {c.name} {c.phone}
          </li>
        ))}
      </ul>
    </>
  );
}

function Pending({ watchers }) {
  return (
    !!watchers.pending && (
      <>
        <h2>Чакащи потвърждение:</h2>
        <ul>
          {watchers.pending.map((c) => (
            <li key={c.id}>
              {c.name} {c.phone}
            </li>
          ))}
        </ul>
      </>
    )
  );
}

export default TripWatchers;
