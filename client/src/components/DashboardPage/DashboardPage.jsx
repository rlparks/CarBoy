import axios from "axios";
import { useEffect, useState } from "react";
import {
    filterTripsByYYYYdashMMdashDD,
    sortVehicles,
} from "../../assets/helpers";
import VehicleCard from "../VehicleCard/VehicleCard";
import Title from "../Title/Title";

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

    const [mostPopularVehicleNumber, setMostPopularVehicleNumber] =
        useState("");
    const [popularVehicleTrips, setPopularVehicleTrips] = useState("");
    const [mostPopularVehicleObj, setMostPopularVehicleObj] = useState({});

    const [mostPopularDestination, setMostPopularDestination] = useState("");
    const [popularDestinationTrips, setPopularDestinationTrips] = useState("");

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
        let destinationOccurences = {};
        let vehicleOccurences = {};
        for (const trip of megaTripsArray) {
            const tripDistance = trip.endMileage
                ? trip.endMileage - trip.startMileage
                : 0;
            mileageAllTimeTemp += tripDistance;

            // collect popularity of destinations
            if (destinationOccurences[trip.destination]) {
                destinationOccurences[trip.destination]++;
            } else {
                destinationOccurences[trip.destination] = 1;
            }

            // collect popularity of vehicles
            if (vehicleOccurences[trip.vehicleNumber]) {
                vehicleOccurences[trip.vehicleNumber]++;
            } else {
                vehicleOccurences[trip.vehicleNumber] = 1;
            }
        }
        setTotalMileage(mileageAllTimeTemp);

        // my first ever usage of this kind of for loop
        let maxOccurences = -1;
        let maxVehicleNumber = null;
        for (const vehicleKey in vehicleOccurences) {
            if (vehicleOccurences[vehicleKey] > maxOccurences) {
                maxOccurences = vehicleOccurences[vehicleKey];
                maxVehicleNumber = vehicleKey;
            }
        }
        setMostPopularVehicleNumber(maxVehicleNumber);
        setPopularVehicleTrips(maxOccurences);

        let maxDestinationCount = -1;
        let maxDestinationName = null;
        for (const destinationKey in destinationOccurences) {
            if (destinationOccurences[destinationKey] > maxDestinationCount) {
                maxDestinationCount = destinationOccurences[destinationKey];
                maxDestinationName = destinationKey;
            }
        }
        // console.log(destinationOccurences);
        setMostPopularDestination(maxDestinationName);
        setPopularDestinationTrips(maxDestinationCount);

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
                        <h2 className="text-center mb-3">Statistics</h2>
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4"
                            }
                        >
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Vehicles</h5>
                                        <p className="card-text">
                                            <b>{vehicles.length}</b> total
                                            vehicle
                                            {vehicles.length !== 1 && "s"}
                                        </p>
                                        <p className="card-text">
                                            <b>{availableVehicles.length}</b>{" "}
                                            available vehicle
                                            {availableVehicles.length !== 1 &&
                                                "s"}
                                        </p>
                                        <p className="card-text">
                                            <b>{checkedOutVehicles.length}</b>{" "}
                                            checked out vehicle
                                            {checkedOutVehicles.length !== 1 &&
                                                "s"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Trips</h5>
                                        <p className="card-text">
                                            <b>{totalTripCount}</b> total trip
                                            {totalTripCount !== 1 && "s"}
                                        </p>
                                        {/* <p className="card-text">
                                            <b>{yearTripCount}</b> trip{yearTripCount !== 1 && "s"} this
                                            year
                                        </p> */}
                                        <p className="card-text">
                                            <b>{monthTripCount}</b> trip
                                            {monthTripCount !== 1 && "s"} this
                                            month
                                        </p>
                                        <p className="card-text">
                                            <b>{dayTripCount}</b> trip
                                            {dayTripCount !== 1 && "s"} today
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Mileage</h5>
                                        <p className="card-text">
                                            <b>{totalMileage}</b> total mile
                                            {totalMileage !== 1 && "s"}
                                        </p>
                                        <p className="card-text">
                                            <b>{monthMileage}</b> mile
                                            {monthTripCount !== 1 && "s"} this
                                            month
                                        </p>
                                        <p className="card-text">
                                            <b>{dayMileage}</b> mile
                                            {dayMileage !== 1 && "s"} today
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <p>
                                    Most popular vehicle:{" "}
                                    {mostPopularVehicleNumber} with{" "}
                                    {popularVehicleTrips} trips all time
                                </p>
                            </div>
                            <div className="col">
                                <p>
                                    Most popular destination:{" "}
                                    {mostPopularDestination} with{" "}
                                    {popularDestinationTrips} trips all time
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
