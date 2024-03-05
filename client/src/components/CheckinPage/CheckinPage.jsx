import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import {
    getDateTimeFormat,
    getUser,
    getVehicleDetails,
} from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function CheckinPage() {
    const params = useParams();
    const { userData } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({});
    const [currentTrip, setCurrentTrip] = useState({});
    const [error, setError] = useState(null);
    const [currentTripEmployeeUser, setCurrentTripEmployeeUser] = useState({
        fullName: "",
        admin: false,
        username: null,
    });
    const navigate = useNavigate();

    const [endMileage, setEndMileage] = useState("");
    function endingMileageChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setEndMileage(event.target.value);
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!endMileage && vehicle.make !== "Departmental") {
            alert("Please enter an ending mileage.");
        } else {
            if (endMileage - currentTrip.startMileage > 250) {
                // check if user meant to enter a large distance
                const userConfirmed = confirm(
                    "Distance is greater than 250 miles. Are you sure this is correct?"
                );
                if (!userConfirmed) {
                    return;
                }
            }

            const vehicleObj = {
                vehicleNumber,
                userId: userData.user.id,
                endMileage,
            };

            const url = SERVER_URL + "api/checkin/" + vehicleNumber;
            try {
                await axios.post(url, vehicleObj, {
                    headers: { "x-auth-token": userData.token },
                });
                navigate("/success");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    useEffect(() => {
        getVehicleDetails(vehicleNumber, userData.token).then((vehicle) => {
            setVehicle(vehicle);
            if (vehicle) {
                if (vehicle.trips) {
                    setCurrentTrip(vehicle.trips[vehicle.trips.length - 1]);
                } else {
                    alert("Error: vehicle has no trips.");
                }
            }
        });
    }, []);

    useEffect(() => {
        if (currentTrip) {
            if (currentTrip.employee) {
                getUser(currentTrip.employee, userData.token)
                    .then((employeeObj) => {
                        setCurrentTripEmployeeUser(employeeObj);
                    })
                    .catch((err) => console.log("Error in getUser"));
            }

            if (currentTrip.startMileage) {
                setEndMileage(currentTrip.startMileage);
            }
        }
    }, [currentTrip]);

    return vehicle ? (
        <div className="">
            <h2 className="text-center mb-3">Check In</h2>
            {error && <p className="text-center text-danger">{error}</p>}
            <div className="d-flex justify-content-center">
                <div className="w-75">
                    <div className="row row-cols-1 row-cols-lg-2">
                        <div className="col">
                            <img
                                className="img-fluid"
                                src={vehicle.pictureUrl}
                                alt={"Image of " + vehicleNumber}
                                style={{ width: "500px" }}
                            />
                        </div>
                        <div className="col">
                            {!vehicle.checkedOut ? (
                                <p className="text-center">
                                    Error: Vehicle is already checked in.
                                </p>
                            ) : (
                                <CheckinForm />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );

    function CheckinForm() {
        let startTime = new Date(currentTrip.startTime);
        startTime = getDateTimeFormat().format(startTime);

        return (
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label className="form-label">Vehicle Number</label>
                    <input
                        disabled
                        value={vehicleNumber}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Employee</label>
                    <input
                        disabled
                        value={currentTripEmployeeUser.fullName}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input
                        disabled
                        value={currentTrip.destination}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Starting Time</label>
                    <input
                        disabled
                        value={startTime}
                        className="form-control"
                    />
                </div>
                {vehicle.make !== "Departmental" && (
                    <div>
                        <div className="mb-3">
                            <label className="form-label">
                                Starting Mileage
                            </label>
                            <input
                                disabled
                                value={currentTrip.startMileage}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ending Mileage</label>
                            <input
                                autoFocus
                                value={endMileage}
                                onChange={endingMileageChangeHandler}
                                type="number"
                                className="form-control"
                                placeholder="1000001"
                            />
                        </div>
                    </div>
                )}

                <button className="btn btn-primary mb-3">Submit</button>
            </form>
        );
    }
}
