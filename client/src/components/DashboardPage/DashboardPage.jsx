import axios from "axios";
import { useEffect, useState } from "react";
import {
    filterTripsByYYYYdashMMdashDD,
    sortVehicles,
} from "../../assets/helpers";
import VehicleCard from "../VehicleCard/VehicleCard";

export default function DashboardPage() {
    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [checkedOutVehicles, setCheckedOutVehicles] = useState([]);
    const numColumns = 5;

    const [totalTripCount, setTotalTripCount] = useState("");
    const [yearTripCount, setYearTripCount] = useState("");
    const [monthTripCount, setMonthTripCount] = useState("");
    const [dayTripCount, setDayTripCount] = useState("");

    const [totalMileage, setTotalMileage] = useState("");
    const [yearMileage, setYearMileage] = useState("");
    const [monthMileage, setMonthMileage] = useState("");
    const [dayMileage, setDayMileage] = useState("");

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

        // calculate mileage stats
        let mileageAllTimeTemp = 0;
        for (const trip of megaTripsArray) {
            const tripDistance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : 0;
            mileageAllTimeTemp += tripDistance;
        }
        setTotalMileage(mileageAllTimeTemp);

        let mileageYearTemp = 0;
        for (const trip of tripsThisYear) {
            const tripDistance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : 0;
            mileageYearTemp += tripDistance;
        }
        setYearMileage(mileageYearTemp);

        let mileageMonthTemp = 0;
        for (const trip of tripsThisMonth) {
            const tripDistance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : 0;
            mileageMonthTemp += tripDistance;
        }
        setMonthMileage(mileageMonthTemp);

        let mileageDayTemp = 0;
        for (const trip of tripsThisDay) {
            const tripDistance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : 0;
            mileageDayTemp += tripDistance;
        }
        setDayMileage(mileageDayTemp);
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <div>
                        <h2 className="text-center mb-3">In Use</h2>
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
                                            vehicle={vehicle}
                                            mode="dashboard"
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
                    <div>
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4"
                            }
                        >
                            <div className="col">
                                <p>Total vehicles: {vehicles.length}</p>
                                <p>
                                    Available vehicles:{" "}
                                    {availableVehicles.length}
                                </p>
                                <p>
                                    Checked out vehicles:{" "}
                                    {checkedOutVehicles.length}
                                </p>
                            </div>
                            <div className="col">
                                <p>Total trip count: {totalTripCount}</p>
                                <p>Trips year to date: {yearTripCount}</p>
                                <p>Trips month to date: {monthTripCount}</p>
                                <p>Trips day to date: {dayTripCount}</p>
                            </div>
                            <div className="col">
                                <p>Total mileage: {totalMileage}</p>
                                <p>Mileage year to date: {yearMileage}</p>
                                <p>Mileage month to date: {monthMileage}</p>
                                <p>Mileage day to date: {dayMileage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
