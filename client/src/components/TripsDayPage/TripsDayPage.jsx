import { useEffect, useState } from "react";
import TripsList from "../TripsList/TripsList";
import axios from "axios";
import {
    filterTripsByYYYYdashMMdashDD,
    sortTripsByStartTime,
} from "../../assets/helpers";

export default function TripsDayPage() {
    const [vehicles, setVehicles] = useState([]);
    const [status, setStatus] = useState("Loading...");

    const [megaTripsArray, setMegaTripsArray] = useState([]);
    const [unfinishedTripsToday, setUnfinishedTripsToday] = useState([]);
    const [finishedTripsToday, setFinishedTripsToday] = useState([]);

    const [date, setDate] = useState("");

    useEffect(() => {
        document.title = "CarBoy · Trips by Day ";
        setStatus("Loading...");
        axios
            .get(SERVER_URL + "api/vehicles/")
            .then((result) => {
                if (result.data !== vehicles) {
                    setVehicles(result.data);

                    let tempTripsArray = [];

                    for (const vehicle of result.data) {
                        tempTripsArray = tempTripsArray.concat(vehicle.trips);
                    }
                    setMegaTripsArray(tempTripsArray);

                    const now = new Date(Date.now());
                    const currentYear = now
                        .getFullYear()
                        .toString()
                        .padStart(4, "0");
                    const currentMonth = (now.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                    const currentDay = now
                        .getDate()
                        .toString()
                        .padStart(2, "0");
                    const currentDayFormatted =
                        currentYear + "-" + currentMonth + "-" + currentDay;
                    setDate(currentDayFormatted);
                }
            })
            .catch((err) => {
                console.log(err);
                setStatus("Error retrieving vehicles");
            });
    }, []);

    useEffect(() => {
        const tripsThisDay = filterTripsByYYYYdashMMdashDD(
            megaTripsArray,
            date,
            date
        );

        const sortedTrips = tripsThisDay.toSorted(sortTripsByStartTime);

        if (sortedTrips.length > 0) {
            setStatus("");
        } else {
            setStatus("No trips have been taken on this day.");
        }

        const groups = Object.groupBy(sortedTrips, (trip) =>
            Boolean(trip.endTime)
        );

        setUnfinishedTripsToday(groups.false);
        setFinishedTripsToday(groups.true);
    }, [date]);

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-100">
                    <h2 className="text-center mb-1">{"Trips by Day"}</h2>
                    <div className="d-flex justify-content-center mt-3 mb-2">
                        <div className="input-group" style={{ width: "200px" }}>
                            <input
                                className="form-control"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                    {status ? (
                        <p className="text-center">{status}</p>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="row row-cols-1 row-cols-lg-2 w-100">
                                <div className="col mx-auto mb-3">
                                    <h3 className="text-center">In Progress</h3>
                                    <div className="w-100 d-flex justify-content-center">
                                        <div className="w-75">
                                            {unfinishedTripsToday &&
                                            unfinishedTripsToday.length > 0 ? (
                                                <TripsList
                                                    showVehicleNumbers={true}
                                                    trips={unfinishedTripsToday}
                                                    sort={true}
                                                />
                                            ) : (
                                                <p className="text-center">
                                                    There are no in progress
                                                    trips on this day.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <h3 className="text-center">Completed</h3>
                                    <div className="d-flex justify-content-center">
                                        <div className="w-75">
                                            {finishedTripsToday &&
                                            finishedTripsToday.length > 0 ? (
                                                <TripsList
                                                    showVehicleNumbers={true}
                                                    trips={finishedTripsToday}
                                                    sort={true}
                                                />
                                            ) : (
                                                <p className="text-center">
                                                    There are no completed trips
                                                    on this day.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
