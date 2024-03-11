import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
    downloadCSVFileFromJSON,
    getDateTimeFormat,
    getUser,
    getVehicleDetails,
} from "../../assets/helpers";
import TripCard from "../TripCard/TripCard";
import UserContext from "../../context/UserContext";
import ErrorPage from "../ErrorPage/ErrorPage";

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
    const [filteredTrips, setFilteredTrips] = useState("");
    const { userData } = useContext(UserContext);

    const [startFilter, setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");

    useEffect(() => {
        getVehicleDetails(vehicleNumber, userData.token).then(
            async (vehicle) => {
                setVehicle(vehicle);
                if (vehicle) {
                    for (let trip of vehicle.trips) {
                        let employee = await getUser(
                            trip.employee,
                            userData.token
                        );
                        trip.employee = employee;
                    }
                    setTrips(vehicle.trips);
                    setFilteredTrips(vehicle.trips.reverse());
                    document.title =
                        "CarBoy · Trips · " + vehicle.vehicleNumber;
                }
            }
        );
    }, []);

    useEffect(() => {
        console.log("Filter changed!");
    }, [startFilter, endFilter]);

    async function exportAllHandler(event) {
        event.preventDefault();

        // convert into more human-readable format
        let tempTrips = structuredClone(trips);
        exportTrips(tempTrips.reverse());
    }

    async function exportFilteredHandler(event) {
        event.preventDefault();

        // convert into more human-readable format
        let tempTrips = structuredClone(filteredTrips);
        exportTrips(tempTrips.reverse());
    }

    async function exportTrips(tripsArray) {
        await makeHumanReadable(tripsArray);

        const tripsString = JSON.stringify(tripsArray);
        const now = new Date(Date.now()).toISOString();
        const fileName =
            "CarBoy_trips_" + vehicle.vehicleNumber + "_" + now + ".csv";

        downloadCSVFileFromJSON(fileName, tripsString);
    }

    // mutates array
    async function makeHumanReadable(tripsArray) {
        for (let trip of tripsArray) {
            delete trip._id;
            trip.startTime = getDateTimeFormat().format(
                new Date(trip.startTime)
            );
            trip.endTime = trip.endTime
                ? getDateTimeFormat().format(new Date(trip.endTime))
                : "";

            trip.distance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : "";

            trip.employee = trip.employee.fullName
                ? trip.employee.fullName
                : trip.employee.username;
            trip.vehicleNumber = vehicleNumber;
        }
    }

    return vehicle ? (
        <div className="d-flex justify-content-center">
            <div className="w-50">
                <h2 className="text-center mb-3">
                    {"Trips: " + vehicleNumber}
                </h2>
                {filteredTrips.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-center mb-3">
                            <button
                                className="btn btn-primary me-1"
                                onClick={exportAllHandler}
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
                            <button
                                className="btn btn-outline-secondary me-1"
                                data-bs-toggle="collapse"
                                data-bs-target="#filterBar"
                                aria-expanded="false"
                                aria-controls="filterBar"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-filter"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                                </svg>
                                Filter
                            </button>
                        </div>
                        <div className="collapse" id="filterBar">
                            <div className="mb-3">
                                <div className="row row-cols-1 row-cols-lg-3">
                                    {/* <div className="d-flex justify-content-center mb-3"> */}
                                    <div className="col">
                                        <div className="input-group">
                                            <span
                                                id="startingFrom"
                                                className="input-group-text"
                                            >
                                                Starting from:
                                            </span>
                                            <input
                                                className="form-control me-1"
                                                type="date"
                                                aria-describedby="startingFrom"
                                                value={startFilter}
                                                onChange={(e) =>
                                                    setStartFilter(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <span
                                                id="endingOn"
                                                className="input-group-text"
                                            >
                                                Ending on:
                                            </span>
                                            <input
                                                className="form-control me-1"
                                                type="date"
                                                aria-describedby="endingOn"
                                                value={endFilter}
                                                onChange={(e) =>
                                                    setEndFilter(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={exportFilteredHandler}
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
                                                Export Filtered CSV
                                            </button>
                                        </div>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4 card-deck"
                            }
                        >
                            {filteredTrips.map((trip) => (
                                <div className="col" key={trip._id}>
                                    <TripCard trip={trip} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center">
                        No trips are currently available.
                    </p>
                )}
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
