import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
    downloadCSVFileFromJSON,
    getDateTimeFormat,
    getUser,
    getVehicleDetails,
    makeHumanReadable,
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
    const [loading, setLoading] = useState(true);
    const [endIndex, setEndIndex] = useState(3);

    useEffect(() => {
        if (loading) {
            getVehicleDetails(vehicleNumber, userData.token).then((vehicle) => {
                setVehicle(vehicle);
            });
        }
    }, []);

    useEffect(() => {
        populateTrips(vehicle);
    }, [vehicle]);

    async function populateTrips(vehicle) {
        if (vehicle) {
            setTrips(vehicle.trips.reverse());
            setFilteredTrips(vehicle.trips.slice(0, endIndex));
            document.title = "CarBoy · Trips · " + vehicle.vehicleNumber;

            setLoading(false);
        }
    }

    useEffect(() => {
        if (startFilter && endFilter) {
            const filtered = trips.filter((trip) => {
                let startDate = new Date(trip.startTime);

                // very high end date if not supplied
                let endDate = trip.endTime
                    ? new Date(trip.endTime)
                    : new Date(3000, 1, 1);

                const startFilterSplit = startFilter.split("-");
                const endFilterSplit = endFilter.split("-");

                // sketchy relying on this
                // not sure
                let startFilterDate = new Date(0);
                startFilterDate.setFullYear(
                    startFilterSplit[0],
                    startFilterSplit[1] - 1,
                    startFilterSplit[2]
                );
                let endFilterDate = new Date(0);
                endFilterDate.setFullYear(
                    endFilterSplit[0],
                    endFilterSplit[1] - 1,
                    endFilterSplit[2]
                );

                startFilterDate.setHours(0, 0, 0);
                endFilterDate.setHours(23, 59, 59);

                // oh yea, this is a .filter
                return startFilterDate <= startDate && endFilterDate >= endDate;
            });

            setFilteredTrips(filtered);
        } else {
            setFilteredTrips(trips.slice(0, endIndex));
        }
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
        await makeHumanReadable(tripsArray, userData.token);

        const tripsString = JSON.stringify(tripsArray);
        const now = new Date(Date.now()).toISOString();
        const fileName =
            "CarBoy_trips_" + vehicle.vehicleNumber + "_" + now + ".csv";

        downloadCSVFileFromJSON(fileName, tripsString);
    }

    function clearFilter(event) {
        event.preventDefault();
        setStartFilter("");
        setEndFilter("");
    }

    function loadMoreTrips(event) {
        event.preventDefault();
        setEndIndex((prev) => {
            const newVal = prev + 3;
            setFilteredTrips(vehicle.trips.slice(0, newVal));
            return newVal;
        });
    }

    return vehicle ? (
        <div className="d-flex justify-content-center mb-3">
            <div className="w-50">
                <h2 className="text-center mb-3">
                    {"Trips: " + vehicleNumber}
                </h2>
                {!loading ? (
                    trips.length > 0 ? (
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
                                                        setEndFilter(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="btn btn-outline-secondary me-1"
                                                    onClick={clearFilter}
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
                                                    Clear Filter
                                                </button>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={
                                                        exportFilteredHandler
                                                    }
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
                            {endIndex < trips.length &&
                                !(endFilter && startFilter) && (
                                    <div className="d-flex justify-content-center m-3">
                                        <button
                                            className="btn btn-secondary me-1"
                                            onClick={loadMoreTrips}
                                        >
                                            {/* https://icons.getbootstrap.com/icons/arrow-down/ */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-arrow-down"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
                                                />
                                            </svg>
                                            Load More
                                        </button>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <p className="text-center">
                            No trips are currently available.
                        </p>
                    )
                ) : (
                    <p className="text-center">Loading...</p>
                )}
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
