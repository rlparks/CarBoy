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
    const { userData } = useContext(UserContext);

    useEffect(() => {
        getVehicleDetails(vehicleNumber, userData.token).then((vehicle) => {
            setVehicle(vehicle);
            if (vehicle) {
                setTrips(vehicle.trips.reverse());
            }
        });
    }, []);

    async function exportAllHandler(event) {
        event.preventDefault();

        // convert into more human-readable format
        let tempTrips = [...trips];
        // for oldest trips at end
        tempTrips.reverse();

        for (let trip of tempTrips) {
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

            const employee = await getUser(trip.employee, userData.token);
            trip.employee = employee.fullName
                ? employee.fullName
                : employee.username;
        }
        const tripsString = JSON.stringify(tempTrips);
        const now = new Date(Date.now()).toISOString();
        const fileName = "CarBoy_trips_" + now + ".csv";

        downloadCSVFileFromJSON(fileName, tripsString);
    }

    return vehicle ? (
        <div className="d-flex justify-content-center">
            <div className="w-50">
                <h2 className="text-center mb-3">
                    {"Trips: " + vehicleNumber}
                </h2>
                {trips.length > 0 ? (
                    <div>
                        <div className="d-flex justify-content-center mb-3">
                            <button
                                className="btn btn-secondary me-1"
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
                                Export CSV (All)
                            </button>
                            {/* <button
                                className="btn btn-secondary me-1"
                                onClick={null}
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
                                Export CSV (Month)
                            </button> */}
                        </div>
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4 card-deck"
                            }
                        >
                            {trips.map((trip) => (
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
