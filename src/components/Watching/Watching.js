import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";

import styles from "./Watching.module.css";
import Modal from "../../common-components/UIComponents/Modal/Modal";
import { useTState } from "../../hooks/useTState";
import RequestItem from "./RequestItem/RequestItem";
import WatchedTripOverview from "./WatchedTripOverview/WatchedTripOverview";
import DataCard from "../../common-components/UIComponents/DataCard/DataCard";
import Button from "../../common-components/FormElements/Button/Button";
import { useLoadPageData } from "../../hooks/useLoadPageData";

const Watching = () => {
  const [requestsModal, toggleRequestsModal] = useTState(false);

  const {
    data,
    dataSource,
    offline,
    reloadData,
    isLoading,
    error,
    sendRequest,
    clearError,
  } = useLoadPageData("/trips/watching", { getCache: true });
  const watching = data?.watchingRes;
  const requests = data?.requestsRes;

  const answerRequest = (answer, reqId) => async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`/requests/${reqId}/${answer}`, {
        method: "POST",
      });

      // Force reload
      reloadData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          asOverlay={dataSource !== "cache"}
          centerPage={dataSource === "cache"}
        />
      )}
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
        <h1>
          Наблюдавани пътувания{" "}
          {dataSource === "cache" && !isLoading && "(Офлайн)"}
        </h1>
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
        <Button
          onClick={toggleRequestsModal}
          className={styles.requests}
          disabled={offline}
        >
          Имате {requests.length} заявки
        </Button>
      )}
    </>
  );
};

export default Watching;
