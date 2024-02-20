import axios from "axios";
import { useEffect, useState } from "react";
import VehicleCard from "../VehicleCard/VehicleCard";
import { Link } from "react-router-dom";
import { downloadJSONFile, readJSONFromFile } from "../../assets/helpers";

export default function VehicleList({ isAdmin, mode }) {
    const numColumns = 5;

    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);
    const [error, setError] = useState("");

    const refreshVehicles = async () => {
        axios
            .get(SERVER_URL + "api/vehicles/")
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
        const fileName = "CarBoy_vehicles_" + now + ".json";

        downloadJSONFile(fileName, vehiclesString);
    }

    async function importVehiclesHandler(event) {
        event.preventDefault();
        const jsonString = await readJSONFromFile();
        const vehiclesArray = JSON.parse(jsonString);

        try {
            const url = SERVER_URL + "api/vehicles/import/";
            await axios.post(url, vehiclesArray);
            setError("");
            await refreshVehicles();
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
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
                <div>
                    <div className="d-flex justify-content-center mb-3">
                        <Link className="btn btn-primary me-1" to="/addvehicle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-plus"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                            Add Vehicle
                        </Link>
                        <button
                            className="btn btn-secondary me-1"
                            onClick={exportVehiclesHandler}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-file-earmark-arrow-down"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                            Export
                        </button>
                        <button
                            className="btn btn-secondary me-1"
                            onClick={importVehiclesHandler}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-file-earmark-arrow-up"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                            Import
                        </button>
                    </div>
                    {error && (
                        <p className="text-center text-danger">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
