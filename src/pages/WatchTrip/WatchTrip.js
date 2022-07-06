import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadStatus } from "../../data-types/LoadStatus";
import useMessages from "../../services/useMessages";
import { useWatchingService } from "../../services/useWatchingService";
import styles from "./WatchTrip.module.css";

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
  }, [watchingService, trip, tripId]);

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
                {index < nextStopIndex && " - минала"}
              </li>
            ))}
          </ul>


        </>
      )}
    </>
  );
};

export default WatchTrip;
