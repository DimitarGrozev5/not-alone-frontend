import { useState } from "react";
import Button from "../../../components/FormElements/Button/Button";
import PickUserInput from "../../../components/PickUserInput/PickUserInput";
import styles from "./TripWatchers.module.css";

const TripWatchers = (props) => {
  const w = props.watchers;

  const [newUser, setNewUser] = useState(null);

  return (
    <>
      <h2>Нови покани:</h2>
      <ul>
        {w.new.map((c) => (
          <li key={c.id}>
            {c.name} {c.phone}
          </li>
        ))}
      </ul>
      <PickUserInput
        title="Добави наблюдател:"
        searchInContacts
        value={newUser}
        onChange={setNewUser}
      />
      <Button>Добави</Button>
      <hr />
      {props.mode !== "create" && <Confirmed watchers={w} />}
      {props.mode !== "create" && <Pending watchers={w} />}
    </>
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
