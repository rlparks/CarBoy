import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { getVehicleDetails } from "../../assets/helpers";

export default function CheckoutPage() {
    const params = useParams();
    const { userData } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({});

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
        getVehicleDetails(vehicleNumber).then((vehicle) => setVehicle(vehicle));
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">Checkout</h2>
                {vehicle.checkedOut ? (
                    <p className="text-center">
                        Error: Vehicle is already checked out.
                    </p>
                ) : (
                    <CheckoutForm />
                )}
            </div>
        </div>
    );

    function CheckoutForm() {
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
        );
    }
}
