import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../components/UIComponents/LoadingSpinner/LoadingSpinner";

import styles from "./Watching.module.css";
import Modal from "../../components/UIComponents/Modal/Modal";
import { useTState } from "../../hooks/useTState";
import RequestItem from "./RequestItem/RequestItem";
import WatchedTripOverview from "./WatchedTripOverview/WatchedTripOverview";

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
    if (!watching || !requests) {
      getData();
    }
  }, [sendRequest, watching, requests]);

  const answerRequest = (answer, reqId) => async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`requests/${reqId}/${answer}`, null, {
        method: "POST",
        auth: true,
      });

      // Force reload
      setRequests(null);
    } catch (err) {
      console.log(err);
    }
  };

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
                <RequestItem
                  key={req._id}
                  request={req}
                  onAccept={answerRequest("accept", req._id)}
                  onReject={answerRequest("reject", req._id)}
                />
              ))}
            </ul>
          )}
        </Modal>
      )}

      <h1>Наблюдавани пътувания</h1>

      {watching && (
        <>
          {!watching.length && <div>Все още не наблюдавате пътувания</div>}
          {!!watching.length && (
            <ul>
              {watching.map((w) => (
                <WatchedTripOverview trip={w} key={w._id} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default Watching;
