import { useEffect, useState } from "react";
import { LoadStatus } from "../../data-types/LoadStatus";
import { requestStatus } from "../../data-types/trip-data";
import useMessages from "../../services/useMessages";
import { useTripsService } from "../../services/useTripsService";
import { exp } from "../../utils/helpers";
import { deconstructDuration } from "../../utils/time";
import styles from "./OngoingTrip.module.css";

const OngoingTrip = () => {
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

  const startTripHandler = (id) => () => {
    tripsService
      .startTrip(id)
      .catch((err) => messages.alert(err.message))
      .finally(() => setTrip(new LoadStatus.Idle()));
  };

  return (
    <>
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
                  <button onClick={startTripHandler(trip.id)}>Старт</button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default OngoingTrip;
