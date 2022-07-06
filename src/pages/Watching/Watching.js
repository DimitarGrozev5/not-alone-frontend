import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/UIComponents/Modal/Modal";
import { LoadStatus } from "../../data-types/LoadStatus";
import { requestTypes, tripStatus } from "../../data-types/trip-data";
import useMessages from "../../services/useMessages";
import { useWatchingService } from "../../services/useWatchingService";

import styles from "./Watching.module.css";

const Watching = () => {
  const watchingService = useWatchingService();
  const messages = useMessages();

  const [watched, setWatched] = useState(new LoadStatus.Idle());
  const [requests, setRequests] = useState(new LoadStatus.Idle());

  useEffect(() => {
    console.log("data load");
    if (watched.isIdle) {
      watchingService
        .getAllWatchingAndRequests()
        .then((res) => {
          setWatched(
            res.watching.length
              ? new LoadStatus.Loaded(res.watching)
              : new LoadStatus.Empty()
          );
          setRequests(
            res.requests.length
              ? new LoadStatus.Loaded(res.requests)
              : new LoadStatus.Empty()
          );
        })
        .catch((err) => {
          console.log(err.message);
          messages.alert(err.message);
          setWatched(new LoadStatus.Error(err.message));
        });
      setWatched(new LoadStatus.Loading());
    }
  }, [watchingService, messages, watched]);

  const [showReqModal, setShowReqModal] = useState(false);
  const openRequestsHandler = (event) => {
    event.preventDefault();
    setShowReqModal(true);
  };
  const closeRequestsHandler = (event) => {
    event.preventDefault();
    setShowReqModal(false);
  };

  const confirmRequest = (id) => () => {
    watchingService
      .confirmWatch(id)
      .then(() => {
        setWatched(new LoadStatus.Idle());
        if (!requests.result.length) {
          setShowReqModal(false);
        }
      })
      .catch((err) => messages.alert(err.message));
  };
  const denyRequest = (id) => () => {
    watchingService
      .denyWatch(id)
      .then(() => {
        setWatched(new LoadStatus.Idle());
        if (!requests.result.length) {
          setShowReqModal(false);
        }
      })
      .catch((err) => messages.alert(err.message));
  };

  return (
    <>
      {showReqModal && (
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
      <div className={styles.requests}>
        {requests.isLoading && "Зареждане"}
        {requests.isEmpty && "Няма нови молби"}
        {requests.isError && "Има грешка при зареждането"}
        {requests.isLoaded && (
          <button onClick={openRequestsHandler}>
            Има {requests.result.length} нови молби
          </button>
        )}
      </div>
    </>
  );
};

export default Watching;
