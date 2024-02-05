import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { getDateTimeFormat, getVehicleDetails } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function CheckinPage() {
    const params = useParams();
    const { userData } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({});
    const [currentTrip, setCurrentTrip] = useState({});
    const navigate = useNavigate();

    const [endMileage, setEndMileage] = useState("");
    function endingMileageChangeHandler(event) {
        setEndMileage(event.target.value);
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!endMileage) {
            alert("Please enter an ending mileage.");
        } else {
            const vehicleObj = {
                vehicleNumber,
                userId: userData.user.id,
                endMileage,
            };

            // TODO
            const url = "http://localhost:8081/api/checkin/" + vehicleNumber;
            try {
                await axios.post(url, vehicleObj);
                navigate("/success");
            } catch (err) {
                console.log("POST error:\n" + err);
            }
        }
    }

    useEffect(() => {
        getVehicleDetails(vehicleNumber).then((vehicle) => {
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

    return vehicle ? (
        <div className="">
            <h2 className="text-center mb-3">Check In</h2>
            <div className="d-flex justify-content-center flex-column">
                <div className="d-flex justify-content-evenly">
                    <div className="">
                        <img
                            className="d-block mx-auto"
                            src={vehicle.pictureUrl}
                            alt={"Image of " + vehicleNumber}
                        />
                    </div>
                    <div className="w-25">
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
                        value={userData.user.username}
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
                <div className="mb-3">
                    <label className="form-label">Starting Mileage</label>
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
                        type="text"
                        className="form-control"
                        placeholder="1000001"
                    />
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>
        );
    }
}
