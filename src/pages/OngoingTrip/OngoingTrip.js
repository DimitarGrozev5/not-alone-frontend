import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "../../components/UIComponents/Modal/Modal";
import { LoadStatus } from "../../data-types/LoadStatus";
import { requestStatus, tripStatus } from "../../data-types/trip-data";
import useMessages from "../../services/useMessages";
import { useTripsService } from "../../services/useTripsService";
import { exp } from "../../utils/helpers";
import { deconstructDuration } from "../../utils/time";
import styles from "./OngoingTrip.module.css";

const OngoingTrip = () => {
  const user = useSelector((state) => state.user);
  const tripsService = useTripsService();
  const messages = useMessages();

  const [trip, setTrip] = useState(new LoadStatus.Idle());

  useEffect(() => {
    if (trip.isIdle) {
      tripsService
        .getActiveTrip()
        .then((result) => setTrip(new LoadStatus.Loaded(result)))
        .catch((err) => setTrip(new LoadStatus.Error(err.message)));
      setTrip(new LoadStatus.Loading());
    }
  }, [trip, tripsService]);

  const listOfAllTrips =
    trip.isLoaded && trip.result instanceof Array && trip.result;

  const activeTrip = trip.isLoaded && !listOfAllTrips && trip.result;

  const nextStopIndex =
    activeTrip &&
    activeTrip.stops.findIndex(
      (stop) => activeTrip.tripStatus.nextStop === stop.id
    );

  if (activeTrip && nextStopIndex < 0) {
    messages
      .alert("Грешка в данните")
      .then(() => setTrip(new LoadStatus.Idle()));
  }

  const nextStop = activeTrip && activeTrip[nextStopIndex];

  const stopsBeforeNext =
    activeTrip && activeTrip.stops.filter((s, i) => i < nextStopIndex);

  const stopsAfterNext =
    activeTrip && activeTrip.stops.filter((s, i) => i >= nextStopIndex);

  const [startModalData, setStartModalData] = useState(null);
  const openStartModalHandler = (id) => () => {
    const trip = listOfAllTrips.find((t) => t.id === id);
    const nextArrival = new Date(
      +new Date() + trip.stops[1].duration
    ).toString();
    setStartModalData({
      id: trip.id,
      name: trip.name,
      start: trip.stops[0].text,
      next: trip.stops[1].text,
      nextTravelTime: trip.stops[1].duration,
      nextArrival,
    });
  };

  useEffect(() => {
    const i = setTimeout(() => {
      setStartModalData(
        (data) =>
          data && {
            ...data,
            nextArrival: new Date(+new Date() + data.nextTravelTime).toString(),
          }
      );
    }, 1000);
    return () => clearTimeout(i);
  }, [startModalData]);

  const startTripHandler = (id) => () => {
    tripsService
      .startTrip(id)
      .catch((err) => messages.alert(err.message))
      .finally(() => {
        setTrip(new LoadStatus.Idle());
        setStartModalData(null);
      });
  };

  return (
    <>
      {startModalData && (
        <Modal
          onClose={setStartModalData.bind(null, null)}
          title="Започни пътуването"
        >
          <h2>{startModalData.name}</h2>
          <div>Тръгваш от {startModalData.start}</div>
          <div>Следваща спирка {startModalData.next}</div>
          <div>Очаква се да пристигнеш до {startModalData.nextArrival}</div>
          <button onClick={startTripHandler(startModalData.id)}>Старт</button>
        </Modal>
      )}

      <h1>Активно пътуване</h1>

      {trip.isLoading && <div>Зареждане...</div>}

      {trip.isError && <div>Грешка при зареждане на пътуванията</div>}

      {listOfAllTrips && !listOfAllTrips.length && (
        <div>Нямаш планувани пътуваня</div>
      )}

      {listOfAllTrips && listOfAllTrips.length && (
        <>
          <div>Няма активно пътуване. Може да започнеш някое от следните</div>
          <ul>
            {listOfAllTrips.map((trip) => {
              const tripTotalDuration = trip.stops.reduce(
                (total, stop) => total + stop.duration,
                0
              );
              const [, , minutes, hours, days] =
                deconstructDuration(tripTotalDuration);

              const watching = trip.watchers.filter(
                (w) => w.status === requestStatus.ACCEPTED
              ).length;

              return (
                <li key={trip.id}>
                  <h2>{trip.name}</h2>
                  <div>{trip.stops.length - 1} спирки</div>
                  <div>
                    Общо {days} дни, {hours} часа и {minutes} минути предвидено
                    пътуване
                  </div>
                  <h3>
                    {watching && watching > 1
                      ? `${watching} души ще те следят`
                      : `1 човек ще те следи`}
                    {!watching && "Все още никой не те следи"}
                  </h3>
                  <button onClick={openStartModalHandler(trip.id)}>
                    Старт
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {activeTrip && (
        <>
          <h2>{activeTrip.name}</h2>
          <ul>
            {stopsBeforeNext.map((stop) => (
              <li key={stop.id}>{stop.text}</li>
            ))}

            <li>
              {activeTrip.tripStatus.status !== tripStatus.PAUSED &&
                `${user.userData.name} се придвижва`}
            </li>

            {stopsAfterNext.map((stop) => (
              <li key={stop.id}>{stop.text}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default OngoingTrip;
