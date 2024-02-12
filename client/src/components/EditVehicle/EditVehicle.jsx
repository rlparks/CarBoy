import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleDetails } from "../../assets/helpers";
import { SERVER_URL } from "../../../public/SERVER_URL";

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
        pictureUrl: "",
    });

    useEffect(() => {
        getVehicleDetails(vehicleNumber).then((vehicle) => setVehicle(vehicle));

        // console.log(vehicle) here returns the intial state
        // hopefully that is just due to React state execution order
        // and won't affect anything if I don't worry about it :)
    }, []);

    function vehicleNumberChangeHandler(event) {
        setVehicle({ ...vehicle, vehicleNumber: event.target.value });
    }

    function makeChangeHandler(event) {
        setVehicle({ ...vehicle, make: event.target.value });
    }

    function modelChangeHandler(event) {
        setVehicle({ ...vehicle, model: event.target.value });
    }

    function yearChangeHandler(event) {
        setVehicle({ ...vehicle, year: event.target.value });
    }

    function lastOilChangeTimeChangeHandler(event) {
        setVehicle({ ...vehicle, lastOilChangeTime: event.target.value });
    }

    function licensePlateChangeHandler(event) {
        setVehicle({ ...vehicle, licensePlate: event.target.value });
    }

    function pictureUrlChangeHandler(event) {
        setVehicle({ ...vehicle, pictureUrl: event.target.value });
    }

    function mileageChangeHandler(event) {
        setVehicle({ ...vehicle, mileage: event.target.value });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (
            !vehicle.vehicleNumber ||
            !vehicle.make ||
            !vehicle.model ||
            !vehicle.year ||
            !vehicle.licensePlate ||
            !vehicle.mileage
        ) {
            alert("Please fill out all fields.");
        } else {
            const url = SERVER_URL + "api/vehicles/" + vehicle._id;
            try {
                await axios.put(url, vehicle);
                navigate("/success");
            } catch (err) {
                console.log("PUT error");
            }
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Edit: " + vehicleNumber}</h2>
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
                        <label className="form-label">Current Mileage</label>
                        <input
                            value={vehicle.mileage}
                            onChange={mileageChangeHandler}
                            type="number"
                            className="form-control"
                            placeholder="1000000"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Picture URL</label>
                        <input
                            value={vehicle.pictureUrl}
                            onChange={pictureUrlChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="https://www.example.com/image.png"
                        />
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
