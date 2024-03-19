import axios from "axios";
import { useEffect, useState } from "react";
import {
    filterTripsByYYYYdashMMdashDD,
    sortVehicles,
} from "../../assets/helpers";

export default function DashboardPage() {
    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [totalTripCount, setTotalTripCount] = useState("");
    const [yearTripCount, setYearTripCount] = useState("");
    const [monthTripCount, setMonthTripCount] = useState("");
    const [dayTripCount, setDayTripCount] = useState("");

    useEffect(() => {
        document.title = "CarBoy · Dashboard";
        axios.get(SERVER_URL + "api/vehicles/").then((result) => {
            const sortedVehicles = result.data.sort(sortVehicles);
            setVehicles(sortedVehicles);

            setAvailableVehicles(
                sortedVehicles.filter(
                    (vehicle) => !vehicle.checkedOut && !vehicle.disabled
                )
            );
            setCheckedOutVehicles(
                sortedVehicles.filter(
                    (vehicle) => vehicle.checkedOut && !vehicle.disabled
                )
            );

            tripLogic(sortedVehicles);
        });
    }, []);

    function tripLogic(vehicleArr) {
        let megaTripsArray = [];

        for (const vehicle of vehicleArr) {
            megaTripsArray = megaTripsArray.concat(vehicle.trips);
        }
        setTotalTripCount(megaTripsArray.length);

        const now = new Date(Date.now());
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const currentDayFormatted =
            currentYear + "-" + currentMonth + "-" + currentDay;

        const tripsThisYear = filterTripsByYYYYdashMMdashDD(
            megaTripsArray,
            currentYear + "-01-01",
            currentDayFormatted
        );
        setYearTripCount(tripsThisYear.length);

        const tripsThisMonth = filterTripsByYYYYdashMMdashDD(
            megaTripsArray,
            currentYear + "-" + currentMonth + "-01",
            currentDayFormatted
        );
        setMonthTripCount(tripsThisMonth.length);

        const tripsThisDay = filterTripsByYYYYdashMMdashDD(
            megaTripsArray,
            currentDayFormatted,
            currentDayFormatted
        );
        setDayTripCount(tripsThisDay.length);
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <div>
                        <h1 className="text-center mb-3">Dashboard</h1>
                        <p>Available vehicles: {availableVehicles.length}</p>
                        <p>Checked out vehicles: {checkedOutVehicles.length}</p>
                        <br />
                        <p>Total trip count: {totalTripCount}</p>
                        <p>Completed trips year to date: {yearTripCount}</p>
                        <p>Completed trips month to date: {monthTripCount}</p>
                        <p>Completed trips day to date: {dayTripCount}</p>
                    </div>

                    {/* <div>
                    <h1 className="text-center m-3">In Use</h1>
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
                </div> */}
                </div>
            </div>
        </div>
    );
}
