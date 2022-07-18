import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";

import styles from "./Watching.module.css";
import Modal from "../../components/UIComponents/Modal/Modal";
import { useTState } from "../../hooks/useTState";
import RequestItem from "./RequestItem/RequestItem";

const Watching = () => {
  const [watching, setWatching] = useState(null);
  const [requests, setRequests] = useState(null);

  const [requestsModal, toggleRequestsModal] = useTState(false);

  const { isLoading, error, sendRequest, clearError, setError } =
    useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const { watchingRes, requestsRes } = await sendRequest(
          "trips/watching",
          null,
          { auth: true }
        );
        setWatching(watchingRes);
        setRequests(requestsRes);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [sendRequest]);

  console.log(requests);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}

      {requestsModal && requests && (
        <Modal title="Заявки" onClose={toggleRequestsModal}>
          {!requests.length && "Няма нови молби"}
          {!!requests.length && (
            <ul>
              {requests.map((req) => (
                <RequestItem key={req._id} request={req} />
              ))}
            </ul>
          )}
        </Modal>
      )}

      {requests && (
        <div className={styles.requests}>
          {!requests.length && "Няма нови молби"}
          {!!requests.length && (
            <button onClick={toggleRequestsModal}>
              {requests.length === 1
                ? "Има 1 нова заявка"
                : `Има ${requests.length} нови заявки`}
            </button>
          )}
        </div>
      )}
      {/* {showReqModal && (
        <Modal title="Нови молби" onClose={closeRequestsHandler}>
          <ul>
            {requests.isLoaded &&
              requests.result.map((req) => (
                <li key={req.id}>
                  {req.name} иска да{" "}
                  {req.type === requestTypes.OVERWATCH
                    ? "знаеш"
                    : "се свържете и да знаеш"}
                  , че отива на пътешествие
                  <button onClick={confirmRequest(req.id)}>ОК</button>
                  <button onClick={denyRequest(req.id)}>Откажи</button>
                </li>
              ))}
          </ul>
        </Modal>
      )}
      <h1>Наблюдавани пътувания</h1>

      {watched.isLoading && <h2>Наблюдаваните пътувания се зареждат</h2>}

      {watched.isEmpty && <h2>Не наблюдавате пътувания</h2>}

      {watched.isError && (
        <h2>Има грешка при зареждане на данните. Моля опитайте по-късно.</h2>
      )}

      {watched.isLoaded && (
        <ul>
          {watched.result.map((w) => (
            <li key={w.id}>
              <Link to={`/watch/${w.id}`}>
                <p>
                  {w.name}, {w.stops.length} спирки
                </p>
                <p>
                  {w.tripStatus.status === tripStatus.PENDING &&
                    "Пътуването не е започнало"}

                  {w.tripStatus.status !== tripStatus.PENDING &&
                    `Следваща спирка: ${
                      w.stops.find((s) => s.id === w.tripStatus.nextStop).text
                    }`}
                </p>
                {w.tripStatus.status === tripStatus.ONGOING && (
                  <p>
                    {`${w.user.name} трябва да пристигне до ${new Date(
                      w.tripStatus.dueBy
                    )}`}
                  </p>
                )}
                {(w.tripStatus.status === tripStatus.LATE ||
                  w.tripStatus.status === tripStatus.VERY_LATE) && (
                  <p>
                    {`${
                      w.user.name
                    } закъснява. Трябваше да пристигне до ${new Date(
                      w.tripStatus.dueBy
                    )}`}
                  </p>
                )}
                {w.tripStatus.status === tripStatus.PAUSED && (
                  <p>{`${w.user.name} е в почивка`}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
       */}
    </>
  );
};

export default Watching;
