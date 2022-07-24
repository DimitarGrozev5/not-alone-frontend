import DataCard from "../../../common-components/UIComponents/DataCard/DataCard";
import OngoingTripDetails from "./OngoingTripDetails";

const OngoingAllTrips = (props) => {
  const allTrips = props.trips;
  return (
    <>
    <DataCard fullWidth><h2>Все още няма започнато пътуване</h2></DataCard>
      {allTrips.map((trip) => (
        <OngoingTripDetails
          key={trip._id}
          onStartTrip={props.onStartTrip}
          trip={trip}
        />
      ))}
    </>
  );
};

export default OngoingAllTrips;
