import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadStatus } from "../../data-types/LoadStatus";
import { tripStatus } from "../../data-types/trip-data";
import useMessages from "../../services/useMessages";
import { useWatchingService } from "../../services/useWatchingService";
// import styles from "./WatchTrip.module.css";

const WatchTrip = () => {
  const watchingService = useWatchingService();
  const messages = useMessages();

  const [trip, setTrip] = useState(new LoadStatus.Idle());
  const tripId = useParams().tripId;

  useEffect(() => {
    if (trip.isIdle) {
      watchingService
        .getOneTrip(tripId)
        .then((res) => setTrip(new LoadStatus.Loaded(res)))
        .catch((err) => {
          console.log(err.message);
          messages.alert(err.message);
          setTrip(new LoadStatus.Error(err.message));
        });
      setTrip(new LoadStatus.Loading());
    }
  }, [watchingService, trip, tripId, messages]);

  const nextStopIndex = trip?.result?.tripStatus?.nextStop;

  return (
    <>
      <h1>Информация за пътуването</h1>

      {trip.isLoading && <h2>Наблюдаваното пътувания се зарежда</h2>}

      {trip.isError && (
        <h2>Има грешка при зареждане на данните. Моля опитайте по-късно.</h2>
      )}

      {trip.isLoaded && (
        <>
          <h2>Име: {trip.result.name}</h2>

          <h3>По молба от {trip.result.user.name}</h3>

          <ul>
            {trip.result.stops.map((stop, index) => (
              <li key={stop.id}>
                {stop.text}
                {index < nextStopIndex && " - стигната"}
              </li>
            ))}
          </ul>

          {trip.result.tripStatus.status === tripStatus.PENDING && (
            <div>{trip.result.user.name} все още не е тръгнал</div>
          )}

          {trip.result.tripStatus.status === tripStatus.PAUSED && (
            <div>
              {trip.result.user.name} почива преди да се насочи към следващата
              спирка
            </div>
          )}

          {trip.result.tripStatus.status === tripStatus.ONGOING && (
            <>
              <div>
                {trip.result.user.name} се придвижва към следващата спирка
              </div>
              <div>
                Очаква се да пристигне около{" "}
                {new Date(trip.result.tripStatus.dueBy).toString()}
              </div>
            </>
          )}

          {trip.result.tripStatus.status === tripStatus.LATE && (
            <div>{trip.result.user.name} закъснява</div>
          )}

          {trip.result.tripStatus.status === tripStatus.VERY_LATE && (
            <div>
              {trip.result.user.name} закъснява много. Пробвай да се свържеш с
              него.
            </div>
          )}
        </>
      )}
    </>
  );
};

export default WatchTrip;
