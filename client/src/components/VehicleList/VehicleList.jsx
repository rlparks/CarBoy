import axios from "axios";
import { useContext, useEffect, useState } from "react";
import VehicleCard from "../VehicleCard/VehicleCard";
import { Link } from "react-router-dom";
import {
    downloadCSVFileFromJSON,
    downloadJSONFile,
    makeHumanReadable,
    readJSONFromFile,
    sortVehicles,
    getUser,
} from "../../assets/helpers";
import UserContext from "../../context/UserContext";
import VehicleSubList from "../VehicleSubList/VehicleSubList";

export default function VehicleList({ isAdmin, mode }) {
    const numColumns = 5;

    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);
    const [disabledVehicles, setDisabledVehicles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState("");
    const { userData } = useContext(UserContext);

    const refreshVehicles = async () => {
        axios
            .get(SERVER_URL + "api/vehicles/")
            .then((result) => setVehicles(result.data.sort(sortVehicles)));
    };

    useEffect(() => {
        refreshVehicles();
    }, []);

    useEffect(() => {
        switch (mode) {
            case "normal":
                document.title = "CarBoy";
                break;
            case "manage":
                document.title = "CarBoy · Manage Vehicles";
                break;
            case "trips":
                document.title = "CarBoy · Trips";
                break;
        }
    }, [mode]);

    useEffect(() => {
        setAvailableVehicles(
            vehicles.filter(
                (vehicle) => !vehicle.checkedOut && !vehicle.disabled
            )
        );
        setCheckedOutVehicles(
            vehicles.filter(
                (vehicle) => vehicle.checkedOut && !vehicle.disabled
            )
        );
        setDisabledVehicles(vehicles.filter((vehicle) => vehicle.disabled));
    }, [vehicles]);

    useEffect(() => {
        // set unique departments only from available vehicles to save CPU time
        if (availableVehicles && availableVehicles.length > 0) {
            // using temp array to prevent duplicates due to async state
            let tempDepartments = [];
            for (const vehicle of availableVehicles) {
                if (!vehicle.department) {
                    vehicle.department = "";
                }
                if (!tempDepartments.includes(vehicle.department)) {
                    tempDepartments.push(vehicle.department);
                }
            }
            setDepartments(tempDepartments.sort());
        }
    }, [availableVehicles]);

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
            await axios.post(url, vehiclesArray, {
                headers: { "x-auth-token": userData.token },
            });
            setError("");
            await refreshVehicles();
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    async function megaExportTripsHandler(event) {
        event.preventDefault();
        let megaTripsArray = [];

        for (const vehicle of vehicles) {
            megaTripsArray = megaTripsArray.concat(vehicle.trips);
        }
        const tempTrips = structuredClone(megaTripsArray);
        for (let trip of tempTrips) {
            trip.employee[0] = await getUser(trip.employee[0], userData.token);
            if (trip.employee[1]) {
                trip.employee[1] = await getUser(
                    trip.employee[1],
                    userData.token
                );
            }
        }
        await makeHumanReadable(tempTrips);

        const now = new Date(Date.now()).toISOString();
        const fileName = "CarBoy_trips_" + now + ".csv";
        downloadCSVFileFromJSON(fileName, tempTrips);
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <div>
                        <h2 className="text-center mb-3">Available</h2>

                        {availableVehicles.length > 0 ? (
                            departments.map((department) => {
                                const deptArray = availableVehicles.filter(
                                    (vehicle) =>
                                        vehicle.department === department
                                );

                                return (
                                    <VehicleSubList
                                        key={department}
                                        items={deptArray}
                                        title={department}
                                        numColumns={numColumns}
                                        isAdmin={isAdmin}
                                        mode={mode}
                                    />
                                );
                            })
                        ) : (
                            // <div
                            //     className={
                            //         "row row-cols-1 row-cols-lg-" +
                            //         numColumns +
                            //         " g-4 card-deck"
                            //     }
                            // >
                            //     {availableVehicles.map((vehicle) => (
                            //         <div className="col" key={vehicle._id}>
                            //             <VehicleCard
                            //                 isAdmin={isAdmin}
                            //                 vehicle={vehicle}
                            //                 mode={mode}
                            //             />
                            //         </div>
                            //     ))}
                            // </div>
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
                                    "row row-cols-1 row-cols-lg-" +
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

                    {(mode === "manage" || mode === "trips") &&
                        disabledVehicles.length > 0 && (
                            <div>
                                <h2 className="text-center m-3">Disabled</h2>
                                <div
                                    className={
                                        "row row-cols-1 row-cols-lg-" +
                                        numColumns +
                                        " g-4"
                                    }
                                >
                                    {disabledVehicles.map((vehicle) => (
                                        <div className="col" key={vehicle._id}>
                                            <VehicleCard
                                                isAdmin={isAdmin}
                                                vehicle={vehicle}
                                                mode={mode}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {mode === "manage" && (
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

            {mode === "trips" && (
                <div className="d-flex justify-content-center mb-3">
                    <button
                        className="btn btn-primary me-1"
                        onClick={megaExportTripsHandler}
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
                        Export CSV
                    </button>
                </div>
            )}
        </div>
    );
}
