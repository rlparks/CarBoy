import axios from "axios";
import { useEffect, useState } from "react";
import VehicleCard from "../VehicleCard/VehicleCard";

export default function VehicleList({ isAdmin }) {
    const numColumns = 4;

    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);

    const refreshVehicles = async () => {
        // TODO
        axios
            .get("http://localhost:8081/api/vehicles/")
            .then((result) => setVehicles(result.data));
    };

    useEffect(() => {
        refreshVehicles();
    }, []);

    useEffect(() => {
        setAvailableVehicles(vehicles.filter((vehicle) => !vehicle.checkedOut));
        setCheckedOutVehicles(vehicles.filter((vehicle) => vehicle.checkedOut));
    }, [vehicles]);

    return (
        <div className="d-flex justify-content-center">
            <div className="w-75">
                <div>
                    <h2 className="text-center mb-3">Available</h2>

                    <div
                        className={
                            "row row-cols-1 row-cols-md-" +
                            numColumns +
                            " g-4 card-deck"
                        }
                    >
                        {availableVehicles.map((vehicle) => (
                            <div className="col" key={vehicle._id}>
                                <VehicleCard
                                    isAdmin={isAdmin}
                                    vehicle={vehicle}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-center m-3">In Use</h2>
                    <div
                        className={
                            "row row-cols-1 row-cols-md-" + numColumns + " g-4"
                        }
                    >
                        {checkedOutVehicles.map((vehicle) => (
                            <div className="col" key={vehicle._id}>
                                <VehicleCard
                                    isAdmin={isAdmin}
                                    vehicle={vehicle}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
