import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getVehicleDetails } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";
import UserContext from "../../context/UserContext";

export default function EditVehicle() {
    const params = useParams();
    const navigate = useNavigate();
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({
        vehicleNumber: vehicleNumber,
        make: "",
        model: "",
        year: "",
        licensePlate: "",
        mileage: "",
        // pictureUrl: "",
        disabled: false,
        department: "",
    });
    const [image, setImage] = useState();
    const [error, setError] = useState("");
    const [vehicleExists, setVehicleExists] = useState(true);
    const { userData } = useContext(UserContext);

    useEffect(() => {
        getVehicleDetails(vehicleNumber, userData.token).then((vehicle) => {
            if (vehicle) {
                document.title =
                    "CarBoy · Edit Vehicle · " + vehicle.vehicleNumber;
                if (vehicle.make === "Departmental") {
                    vehicle.mileage = "";
                    vehicle.licensePlate = "";
                    vehicle.year = "";
                }
                if (!vehicle.disabled) {
                    vehicle.disabled = false;
                }
                setVehicle(vehicle);
            } else {
                setVehicleExists(false);
            }
        });

        // console.log(vehicle) here returns the intial state
        // hopefully that is just due to React state execution order
        // and won't affect anything if I don't worry about it :)
    }, []);

    function vehicleNumberChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 5);
        setVehicle({ ...vehicle, vehicleNumber: event.target.value });
    }

    function makeChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 15);
        setVehicle({ ...vehicle, make: event.target.value });
    }

    function modelChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 15);
        setVehicle({ ...vehicle, model: event.target.value });
    }

    function yearChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 4);
        setVehicle({ ...vehicle, year: event.target.value });
    }

    // function lastOilChangeTimeChangeHandler(event) {
    //     setVehicle({ ...vehicle, lastOilChangeTime: event.target.value });
    // }

    function licensePlateChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setVehicle({ ...vehicle, licensePlate: event.target.value });
    }

    // function pictureUrlChangeHandler(event) {
    //     setVehicle({ ...vehicle, pictureUrl: event.target.value });
    // }

    function mileageChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setVehicle({ ...vehicle, mileage: event.target.value });
    }

    function departmentChangeHandler(event) {
        setVehicle({ ...vehicle, department: event.target.value });
    }

    function imageChangeHandler(event) {
        setImage(event.target.files[0]);
    }

    function disabledChangeHandler(event) {
        setVehicle({ ...vehicle, disabled: event.target.checked });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (
            (!vehicle.vehicleNumber ||
                !vehicle.make ||
                !vehicle.model ||
                !vehicle.year ||
                !vehicle.licensePlate ||
                !vehicle.mileage) &&
            vehicle.make !== "Departmental"
        ) {
            alert("Please fill out all fields.");
        } else {
            if (image) {
                vehicle.image = image;
            }

            const url = SERVER_URL + "api/vehicles/" + vehicle._id;
            try {
                await axios.put(url, vehicle, {
                    headers: {
                        "x-auth-token": userData.token,
                        "Content-Type": "multipart/form-data",
                    },
                });
                navigate("/success/managevehicles");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    return vehicleExists ? (
        <div className="mb-3">
            <div className="d-flex justify-content-center">
                <div className="w-50">
                    <h2 className="text-center mb-3">
                        {"Edit: " + vehicleNumber}
                    </h2>
                    {error && (
                        <p className="text-center text-danger">{error}</p>
                    )}
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label className="form-label">Vehicle Number</label>
                            <input
                                autoFocus
                                value={vehicle.vehicleNumber}
                                onChange={vehicleNumberChangeHandler}
                                type="number"
                                className="form-control"
                                placeholder="94250"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Make</label>
                            <input
                                value={vehicle.make}
                                onChange={makeChangeHandler}
                                type="text"
                                className="form-control"
                                placeholder="Ford"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Model</label>
                            <input
                                value={vehicle.model}
                                onChange={modelChangeHandler}
                                type="text"
                                className="form-control"
                                placeholder="Explorer"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Year</label>
                            <input
                                value={vehicle.year}
                                onChange={yearChangeHandler}
                                type="number"
                                className="form-control"
                                placeholder="2002"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">License Plate</label>
                            <input
                                value={vehicle.licensePlate}
                                onChange={licensePlateChangeHandler}
                                type="text"
                                className="form-control"
                                placeholder="ABC1234"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Current Mileage
                            </label>
                            <input
                                value={vehicle.mileage}
                                onChange={mileageChangeHandler}
                                type="number"
                                className="form-control"
                                placeholder="1000000"
                            />
                        </div>
                        {/* <div className="mb-3">
                    <label className="form-label">Picture URL</label>
                    <input
                        value={vehicle.pictureUrl}
                        onChange={pictureUrlChangeHandler}
                        type="text"
                        className="form-control"
                        placeholder="https://www.example.com/image.png"
                    />
                </div> */}
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input
                                value={vehicle.department}
                                onChange={departmentChangeHandler}
                                type="text"
                                className="form-control"
                                placeholder="leave blank for none"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                accept=".jpeg, .jpg, .png"
                                className="form-control"
                                onChange={imageChangeHandler}
                            />
                        </div>
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    checked={vehicle.disabled}
                                    onChange={disabledChangeHandler}
                                    type="checkbox"
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    Disabled
                                </label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary">Submit</button>
                            <div className="btn-group">
                                <Link
                                    className="btn btn-outline-danger"
                                    to={
                                        "/managevehicles/delete/" +
                                        vehicle.vehicleNumber
                                    }
                                >
                                    {/* https://icons.getbootstrap.com/icons/trash/ */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash me-1"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                    Delete Vehicle
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
