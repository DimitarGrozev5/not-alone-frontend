import { useEffect, useState } from "react";

import { useHttpClient } from "../../hooks/useHttpClient";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";

import styles from "./Watching.module.css";
import Modal from "../../common-components/UIComponents/Modal/Modal";
import { useTState } from "../../hooks/useTState";
import RequestItem from "./RequestItem/RequestItem";
import WatchedTripOverview from "./WatchedTripOverview/WatchedTripOverview";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import Button from "../../common-components/FormElements/Button/Button";

const Watching = () => {
  const [watching, setWatching] = useState(null);
  const [requests, setRequests] = useState(null);

  const [requestsModal, toggleRequestsModal] = useTState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getData = async () => {
      try {
        const { watchingRes, requestsRes } = await sendRequest(
          "/trips/watching"
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
      await sendRequest(`/requests/${reqId}/${answer}`, {
        method: "POST",
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
      <ErrorModal show={!!error} error={error} onClose={clearError} />

      <Modal
        show={!!requestsModal}
        title="Заявки"
        onClose={toggleRequestsModal}
      >
        {requests && (
          <>
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
          </>
        )}
      </Modal>

      <DataCard fullWidth>
        <h1>Наблюдавани пътувания</h1>
      </DataCard>

      {watching && (
        <>
          {!watching.length && (
            <DataCard fullWidth>Все още не наблюдавате пътувания</DataCard>
          )}
          {!!watching.length &&
            watching.map((w) => <WatchedTripOverview trip={w} key={w._id} />)}
        </>
      )}

      {!!requests && !!requests.length && (
        <Button onClick={toggleRequestsModal} className={styles.requests}>
          Имате {requests.length} заявки
        </Button>
      )}
    </>
  );
};

export default Watching;
