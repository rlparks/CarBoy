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

    const refreshSeconds = 5;
    const [numRefreshes, setNumRefreshes] = useState(0);

    useEffect(() => {
        document.title = "CarBoy · Dashboard";

        // console.log("GET DATA");
        axios.get(SERVER_URL + "api/vehicles/").then((result) => {
            const sortedVehicles = result.data.sort(sortVehicles);
            if (vehicles !== sortedVehicles) {
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
                setTimeout(
                    () => setNumRefreshes((prev) => prev + 1),
                    refreshSeconds * 1000
                );

                if (numRefreshes >= 999) {
                    // can't have any overflow, can we?
                    setNumRefreshes(0);
                }
            }
        });
    }, [numRefreshes]);

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
        setMostPopularVehicleObj(
            findVehicleObjInVehicleArrayFromVehicleNumber(
                vehicleArr,
                maxVehicleNumber
            )
        );
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
                    <hr className="mx-4 my-1" />
                    <div className="mb-1">
                        <h2 className="text-center mt-1 mb-3">In Use</h2>
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
                                        <VehicleCard vehicle={vehicle} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">
                                No vehicles are currently checked out.
                            </p>
                        )}
                    </div>
                    <hr className="mx-4 my-4" />
                    <div>
                        {/* <h2 className="text-center mb-3">Statistics</h2> */}
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4"
                            }
                        >
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-car-front-fill me-1"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
                                            </svg>
                                            Vehicles
                                        </h5>
                                        <div>
                                            <p className="card-text">
                                                <b>
                                                    {vehicles.length.toLocaleString()}
                                                </b>{" "}
                                                total vehicle
                                                {vehicles.length !== 1 && "s"}
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {availableVehicles.length.toLocaleString()}
                                                </b>{" "}
                                                available vehicle
                                                {availableVehicles.length !==
                                                    1 && "s"}
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {checkedOutVehicles.length.toLocaleString()}
                                                </b>{" "}
                                                checked out vehicle
                                                {checkedOutVehicles.length !==
                                                    1 && "s"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-sign-turn-right-fill me-1"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM9 8.466V7H7.5A1.5 1.5 0 0 0 6 8.5V11H5V8.5A2.5 2.5 0 0 1 7.5 6H9V4.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L9.41 8.658A.25.25 0 0 1 9 8.466" />
                                            </svg>
                                            Trips
                                        </h5>
                                        <div>
                                            <p className="card-text">
                                                <b>
                                                    {totalTripCount.toLocaleString()}
                                                </b>{" "}
                                                total trip
                                                {totalTripCount !== 1 && "s"}
                                            </p>
                                            {/* <p className="card-text">
                                            <b>{yearTripCount}</b> trip{yearTripCount !== 1 && "s"} this
                                            year
                                        </p> */}
                                            <p className="card-text">
                                                <b>
                                                    {monthTripCount.toLocaleString()}
                                                </b>{" "}
                                                trip
                                                {monthTripCount !== 1 &&
                                                    "s"}{" "}
                                                this month
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {dayTripCount.toLocaleString()}
                                                </b>{" "}
                                                trip
                                                {dayTripCount !== 1 && "s"}{" "}
                                                today
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-fuel-pump-fill me-1"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907.295.655.294 1.465.294 2.081V7.5a.5.5 0 0 1-.5.5H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm2.5 0a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z" />
                                            </svg>
                                            Mileage
                                        </h5>
                                        <div>
                                            <p className="card-text">
                                                <b>
                                                    {totalMileage.toLocaleString()}
                                                </b>{" "}
                                                total mile
                                                {totalMileage !== 1 && "s"}
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {monthMileage.toLocaleString()}
                                                </b>{" "}
                                                mile
                                                {monthTripCount !== 1 &&
                                                    "s"}{" "}
                                                this month
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {dayMileage.toLocaleString()}
                                                </b>{" "}
                                                mile
                                                {dayMileage !== 1 && "s"} today
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card h-100">
                                    {/* <img
                                        className="card-img-top"
                                        src={mostPopularVehicleObj.pictureUrl}
                                        alt={
                                            "Image of " +
                                            mostPopularVehicleNumber
                                        }
                                    /> */}
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-stars me-1"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                                            </svg>
                                            Favorite Vehicle
                                        </h5>
                                        <div>
                                            <p className="card-text">
                                                <b>
                                                    {mostPopularVehicleNumber}
                                                </b>
                                            </p>
                                            <p className="card-text">
                                                {mostPopularVehicleObj.year}{" "}
                                                {mostPopularVehicleObj.make}{" "}
                                                {mostPopularVehicleObj.model}
                                            </p>
                                            <p className="card-text">
                                                <b>
                                                    {popularVehicleTrips.toLocaleString()}
                                                </b>{" "}
                                                total trip
                                                {popularVehicleTrips !== 1 &&
                                                    "s"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5 className="card-title">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-signpost-fill me-1"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M7.293.707A1 1 0 0 0 7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414A1 1 0 0 0 7.293.707" />
                                            </svg>
                                            Favorite Destination
                                        </h5>
                                        {/* <div> */}
                                        <p className="card-text">
                                            <b>{mostPopularDestination}</b>
                                        </p>
                                        <p className="card-text">
                                            <b>
                                                {popularDestinationTrips.toLocaleString()}
                                            </b>{" "}
                                            total trip
                                            {popularDestinationTrips !== 1 &&
                                                "s"}
                                        </p>
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // avoids a GET for this vehicle
    function findVehicleObjInVehicleArrayFromVehicleNumber(
        vehicleArray,
        vehicleNumber
    ) {
        for (const vehicle of vehicleArray) {
            // console.log(
            //     typeof vehicle.vehicleNumber + ", " + typeof vehicleNumber
            // );
            // the above comment tells a story
            if (vehicle.vehicleNumber === Number(vehicleNumber)) {
                return vehicle;
            }
        }

        return {};
    }
}
