import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddVehicle() {
    const navigate = useNavigate();
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [lastOilChangeTime, setLastOilChangeTime] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [pictureUrl, setPictureUrl] = useState("");
    const [mileage, setMileage] = useState("");
    const [image, setImage] = useState();
    const [error, setError] = useState("");

    function vehicleNumberChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 5);
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

    function lastOilChangeTimeChangeHandler(event) {
        setLastOilChangeTime(event.target.value);
    }

    function licensePlateChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setLicensePlate(event.target.value);
    }

    function pictureUrlChangeHandler(event) {
        setPictureUrl(event.target.value);
    }

    function mileageChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 10);
        setMileage(event.target.value);
    }

    function imageChangeHandler(event) {
        setImage(event.target.files[0]);
    }

    async function addVehicleHandler(event) {
        event.preventDefault();

        if (!vehicleNumber || !make || !model || !year || !licensePlate) {
            alert("Please fill out all fields");
        } else {
            const newVehicle = {
                vehicleNumber: vehicleNumber,
                make: make,
                model: model,
                year: year,
                lastOilChangeTime: lastOilChangeTime,
                licensePlate: licensePlate,
                pictureUrl: pictureUrl,
                mileage: mileage,
            };

            try {
                await axios.post(SERVER_URL + "api/vehicles/", newVehicle);
                navigate("/success");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }
    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">Add Vehicle</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <form onSubmit={addVehicleHandler}>
                    <div className="mb-3">
                        <label className="form-label">Vehicle Number</label>
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
                        <label className="form-label">License Plate</label>
                        <input
                            value={licensePlate}
                            onChange={licensePlateChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="ABC1234"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Current Mileage</label>
                        <input
                            value={mileage}
                            onChange={mileageChangeHandler}
                            type="number"
                            className="form-control"
                            placeholder="1000000"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Picture URL</label>
                        <input
                            value={pictureUrl}
                            onChange={pictureUrlChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="https://www.example.com/image.png"
                        />
                    </div>
                    {/* <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            className="form-control"
                        />
                    </div> */}
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
