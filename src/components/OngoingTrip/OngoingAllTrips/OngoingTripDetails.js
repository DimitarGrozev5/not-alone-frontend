import DataCard from "../../../common-components/UIComponents/DataCard/DataCard";
import Button from "../../../common-components/FormElements/Button/Button";

const OngoingTripDetails = (props) => {
  const trip = props.trip;
  return (
    <DataCard>
      <h2>{trip.name}</h2>
      <div>
        {trip.stops.length - 1} {trip.stops.length === 2 ? "спирка" : "спирки"}
      </div>
      {trip.watchers && (
        <>
          <h3>
            {!trip.watchers.length && "Все още никой не те следи"}
            {trip.watchers.length === 1 && `1 човек ще те следи`}
            {trip.watchers.length > 1 &&
              `${trip.watchers.length} души ще те следят`}
          </h3>

          <div>
            <Button to={`/ongoing-trip/${trip._id}`}>Преглед</Button>
            {!!trip.watchers.length && (
              <Button onClick={props.onStartTrip(trip)}>Старт</Button>
            )}
          </div>
        </>
      )}
    </DataCard>
  );
};
export default OngoingTripDetails;
