import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVehicleDetails } from "../../assets/helpers";

export default function TripsPage() {
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
            setTrips(vehicle.trips);
        });
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">
                    {"Trips: " + vehicleNumber}
                </h2>
            </div>
        </div>
    );
}
