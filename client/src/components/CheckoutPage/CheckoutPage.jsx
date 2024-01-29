import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";

export default function CheckoutPage() {
    const params = useParams();
    const { userData } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;

    const [destination, setDestination] = useState("");

    function destinationChangeHander(event) {
        setDestination(event.target.value);
    }
    async function submitHandler(event) {
        event.preventDefault();
        if (!destination) {
            alert("Please enter a destination.");
        } else {
            const vehicleObj = {
                vehicleNumber,
                destination,
                userId: userData.user.id,
            };

            // TODO
            const url = "http://localhost:8081/api/checkout/" + vehicleNumber;
            try {
                await axios.post(url, vehicleObj);
            } catch (err) {
                console.log("POST error");
            }
        }
    }

    useEffect(() => {
        getVehicleDetails(vehicleNumber);
    }, []);

    async function getVehicleDetails(vehicleNumber) {
        // TODO
        const url = "http://localhost:8081/api/vehicles/" + vehicleNumber;
        try {
            const vehicle = await axios.get(url);
            console.log(vehicle);
        } catch (err) {
            console.log("Vehicle not found");
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">Checkout</h2>
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
                            autoFocus
                            value={destination}
                            onChange={destinationChangeHander}
                            type="text"
                            className="form-control"
                            placeholder="STEM I"
                        />
                    </div>

                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
