import OngoingTripDetails from "./OngoingTripDetails";

const OngoingAllTrips = (props) => {
  const allTrips = props.trips;
  return (
      <ul>
        {allTrips.map((trip) => (
          <li key={trip._id}>
            <OngoingTripDetails onStartTrip={props.onStartTrip} trip={trip} />
          </li>
        ))}
      </ul>
  );
};

export default OngoingAllTrips;
