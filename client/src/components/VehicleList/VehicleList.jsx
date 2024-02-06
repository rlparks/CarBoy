import axios from "axios";
import { useEffect, useState } from "react";
import VehicleCard from "../VehicleCard/VehicleCard";
import { Link } from "react-router-dom";
import { downloadJSONFile } from "../../assets/helpers";

export default function VehicleList({ isAdmin, mode }) {
    const numColumns = 4;

    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);

    const refreshVehicles = async () => {
        // TODO
        axios
            .get("http://localhost:8081/" + "api/vehicles/")
            .then((result) => setVehicles(result.data));
    };

    useEffect(() => {
        refreshVehicles();
    }, []);

    useEffect(() => {
        setAvailableVehicles(vehicles.filter((vehicle) => !vehicle.checkedOut));
        setCheckedOutVehicles(vehicles.filter((vehicle) => vehicle.checkedOut));
    }, [vehicles]);

    function exportVehiclesHandler(event) {
        event.preventDefault();
        const vehiclesString = JSON.stringify(vehicles);
        const now = new Date(Date.now()).toISOString();
        const fileName = "CarBoy_Vehicles_" + now + ".json";

        downloadJSONFile(fileName, vehiclesString);
    }

    return (
        <div>
            <div className="d-flex justify-content-center">
                <div className="w-75">
                    <div>
                        <h2 className="text-center mb-3">Available</h2>

                        {availableVehicles.length > 0 ? (
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
                                            mode={mode}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">
                                No vehicles are currently available.
                            </p>
                        )}
                    </div>

                    <div>
                        <h2 className="text-center m-3">In Use</h2>
                        {checkedOutVehicles.length > 0 ? (
                            <div
                                className={
                                    "row row-cols-1 row-cols-md-" +
                                    numColumns +
                                    " g-4"
                                }
                            >
                                {checkedOutVehicles.map((vehicle) => (
                                    <div className="col" key={vehicle._id}>
                                        <VehicleCard
                                            isAdmin={isAdmin}
                                            vehicle={vehicle}
                                            mode={mode}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">
                                No vehicles are currently checked out.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {mode == "manage" && (
                <div className="d-flex justify-content-center">
                    <Link className="btn btn-primary" to="/addvehicle">
                        Add Vehicle
                    </Link>
                    <button className="btn" onClick={exportVehiclesHandler}>
                        Export
                    </button>
                </div>
            )}
        </div>
    );
}
