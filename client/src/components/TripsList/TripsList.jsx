import { sortTripsByStartTime } from "../../assets/helpers";
import TripCard from "../TripCard/TripCard";

export default function TripsList({ trips, sort, showVehicleNumbers }) {
    const numColumns = 1;

    if (sort) {
        // toSorted(sortTripsByStartTime) will return an array
        // where the newest trips are the last element
        //
        // wacky assignment so as to not mutate the original array
        trips = trips.toSorted(sortTripsByStartTime).toReversed();
    }

    return (
        <div
            className={
                "row row-cols-1 row-cols-lg-" + numColumns + " g-4 card-deck"
            }
        >
            {trips.map((trip) => (
                <div className="col" key={trip._id}>
                    <TripCard
                        showVehicleNumber={showVehicleNumbers}
                        trip={trip}
                    />
                </div>
            ))}
        </div>
    );
}
