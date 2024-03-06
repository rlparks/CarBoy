import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function AddVehicle() {
    const navigate = useNavigate();
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    // const [lastOilChangeTime, setLastOilChangeTime] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    // const [pictureUrl, setPictureUrl] = useState("");
    const [mileage, setMileage] = useState("");
    const [department, setDepartment] = useState("");
    const [image, setImage] = useState();
    const [error, setError] = useState("");
    const [isDP, setIsDP] = useState(false);
    const { userData } = useContext(UserContext);

    function vehicleNumberChangeHandler(event) {
        if (isDP) {
            event.target.value = event.target.value.slice(0, 8);
        } else {
            event.target.value = event.target.value.slice(0, 5);
        }
        setVehicleNumber(event.target.value);
    }

    function makeChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 15);
        setMake(event.target.value);
    }

    function modelChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 15);
        setModel(event.target.value);
    }

    function yearChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 4);
        setYear(event.target.value);
    }

    // function lastOilChangeTimeChangeHandler(event) {
    //     setLastOilChangeTime(event.target.value);
    // }

    function licensePlateChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setLicensePlate(event.target.value);
    }

    // function pictureUrlChangeHandler(event) {
    //     setPictureUrl(event.target.value);
    // }

    function mileageChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setMileage(event.target.value);
    }
    function departmentChangeHandler(event) {
        setDepartment(event.target.value);
    }

    function imageChangeHandler(event) {
        setImage(event.target.files[0]);
    }

    function isDPChangeHandler(event) {
        setIsDP(event.target.checked);
        if (event.target.checked) {
            setMake("Departmental");
            setModel("Permit");
        } else {
            setMake("");
            setModel("");
        }
    }

    async function addVehicleHandler(event) {
        event.preventDefault();

        if (!vehicleNumber || !make || !model) {
            alert("Please fill out all fields");
        } else {
            const newVehicle = {
                vehicleNumber: vehicleNumber,
                make: make,
                model: model,
                year: year,
                // lastOilChangeTime: lastOilChangeTime,
                licensePlate: licensePlate,
                // pictureUrl: pictureUrl,
                mileage: mileage,
                image: image,
                department: department,
            };

            try {
                await axios.post(SERVER_URL + "api/vehicles/", newVehicle, {
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

    useEffect(() => {
        document.title = "CarBoy · Add Vehicle";
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <div className="w-50">
                <h2 className="text-center mb-3">Add Vehicle</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <form onSubmit={addVehicleHandler}>
                    {!isDP && (
                        <div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Vehicle Number
                                </label>
                                <input
                                    autoFocus
                                    value={vehicleNumber}
                                    onChange={vehicleNumberChangeHandler}
                                    type="number"
                                    className="form-control"
                                    placeholder="94250"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Make</label>
                                <input
                                    value={make}
                                    onChange={makeChangeHandler}
                                    type="text"
                                    className="form-control"
                                    placeholder="Ford"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Model</label>
                                <input
                                    value={model}
                                    onChange={modelChangeHandler}
                                    type="text"
                                    className="form-control"
                                    placeholder="Explorer"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Year</label>
                                <input
                                    value={year}
                                    onChange={yearChangeHandler}
                                    type="number"
                                    className="form-control"
                                    placeholder="2002"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    License Plate
                                </label>
                                <input
                                    value={licensePlate}
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
                                    value={mileage}
                                    onChange={mileageChangeHandler}
                                    type="number"
                                    className="form-control"
                                    placeholder="1000000"
                                />
                            </div>
                        </div>
                    )}

                    {isDP && (
                        <div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Permit Number
                                </label>
                                <input
                                    autoFocus
                                    value={vehicleNumber}
                                    onChange={vehicleNumberChangeHandler}
                                    type="number"
                                    className="form-control"
                                    placeholder="24445042"
                                />
                            </div>
                        </div>
                    )}
                    {/* <div className="mb-3">
                        <label className="form-label">Picture URL</label>
                        <input
                            value={pictureUrl}
                            onChange={pictureUrlChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="https://www.example.com/image.png"
                        />
                    </div> */}

                    <div className="mb-3">
                        <label className="form-label">Department</label>
                        <input
                            value={department}
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
                                checked={isDP}
                                onChange={isDPChangeHandler}
                                type="checkbox"
                                className="form-check-input"
                            />
                            <label className="form-check-label">
                                Departmental Permit
                            </label>
                        </div>
                    </div>
                    <button className="btn btn-primary mb-3">Submit</button>
                </form>
            </div>
        </div>
    );
}
