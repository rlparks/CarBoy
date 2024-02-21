import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVehicleDetails } from "../../assets/helpers";
import TripCard from "../TripCard/TripCard";

export default function TripsPage() {
    const numColumns = 1;

    const params = useParams();
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({
        vehicleNumber: vehicleNumber,
        make: "",
        model: "",
        year: "",
        licensePlate: "",
        mileage: "",
        pictureUrl: "",
        trips: [],
    });
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        getVehicleDetails(vehicleNumber).then((vehicle) => {
            setVehicle(vehicle);
            setTrips(vehicle.trips.reverse());
        });
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <div className="w-50">
                <h2 className="text-center mb-3">
                    {"Trips: " + vehicleNumber}
                </h2>
                {trips.length > 0 ? (
                    <div
                        className={
                            "row row-cols-lg-" + numColumns + " g-4 card-deck"
                        }
                    >
                        {trips.map((trip) => (
                            <div className="col" key={trip._id}>
                                <TripCard trip={trip} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">
                        No trips are currently available.
                    </p>
                )}
            </div>
        </div>
    );
}
