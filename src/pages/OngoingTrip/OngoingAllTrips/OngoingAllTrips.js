import OngoingTripDetails from "./OngoingTripDetails";

const OngoingAllTrips = (props) => {
  const allTrips = props.trips;
  return (
    <>
      {allTrips && !allTrips.length && <div>Все още нямате пътувания</div>}
      {allTrips && !!allTrips.length && (
        <ul>
          {allTrips.map((trip) => (
            <li key={trip._id}>
              <OngoingTripDetails onStartTrip={props.onStartTrip} trip={trip} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default OngoingAllTrips;
