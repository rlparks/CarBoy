import { useEffect, useState } from "react";
import TripsList from "../TripsList/TripsList";
import axios from "axios";
import {
    filterTripsByYYYYdashMMdashDD,
    sortTripsByStartTime,
} from "../../assets/helpers";

export default function TripsTodayPage() {
    const [vehicles, setVehicles] = useState([]);
    const [status, setStatus] = useState("Loading...");

    const [unfinishedTripsToday, setUnfinishedTripsToday] = useState([]);
    const [finishedTripsToday, setFinishedTripsToday] = useState([]);

    useEffect(() => {
        document.title = "CarBoy · Trips Today ";
        setStatus("Loading...");
        axios
            .get(SERVER_URL + "api/vehicles/")
            .then((result) => {
                if (result.data !== vehicles) {
                    setVehicles(result.data);
                    findTripsToday(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
                setStatus("Error retrieving vehicles");
            });
    }, []);

    function findTripsToday(vehicleArr) {
        let megaTripsArray = [];

        for (const vehicle of vehicleArr) {
            megaTripsArray = megaTripsArray.concat(vehicle.trips);
        }

        const now = new Date(Date.now());
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const currentDayFormatted =
            currentYear + "-" + currentMonth + "-" + currentDay;

        const tripsThisDay = filterTripsByYYYYdashMMdashDD(
            megaTripsArray,
            currentDayFormatted,
            currentDayFormatted
        );

        const sortedTrips = tripsThisDay.toSorted(sortTripsByStartTime);

        if (sortedTrips.length > 0) {
            setStatus("");
        } else {
            setStatus("No trips have been taken today.");
        }

        const groups = Object.groupBy(sortedTrips, (trip) =>
            Boolean(trip.endTime)
        );

        console.log(groups);

        setUnfinishedTripsToday(groups.false);
        setFinishedTripsToday(groups.true);
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="">
                    <h2 className="text-center mb-1">{"Trips Today"}</h2>
                    {/* <div className="d-flex justify-content-center"> */}
                    {status ? (
                        <p className="text-center">{status}</p>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="row row-cols-1 row-cols-lg-2 w-100">
                                <div className="col mx-auto mb-3">
                                    <h3 className="text-center">In Progress</h3>
                                    <div className="w-100 d-flex justify-content-center">
                                        <div className="w-75">
                                            <TripsList
                                                showVehicleNumbers={true}
                                                trips={unfinishedTripsToday}
                                                sort={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <h3 className="text-center">Completed</h3>
                                    <div className="d-flex justify-content-center">
                                        <div className="w-75">
                                            <TripsList
                                                showVehicleNumbers={true}
                                                trips={finishedTripsToday}
                                                sort={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}
