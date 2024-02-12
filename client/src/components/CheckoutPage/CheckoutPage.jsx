import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { getVehicleDetails } from "../../assets/helpers";
import { SERVER_URL } from "../../../public/SERVER_URL";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function CheckoutPage() {
    const params = useParams();
    const { userData } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({});
    const navigate = useNavigate();

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

            const url = SERVER_URL + "api/checkout/" + vehicleNumber;
            try {
                const res = await axios.post(url, vehicleObj);
                navigate("/success");
            } catch (err) {
                console.log("POST error:\n" + err);
            }
        }
    }

    useEffect(() => {
        getVehicleDetails(vehicleNumber).then((vehicle) => setVehicle(vehicle));
    }, []);

    return vehicle ? (
        <div className="">
            <h2 className="text-center mb-3">Check Out</h2>
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
                        {vehicle.checkedOut ? (
                            <p className="text-center">
                                Error: Vehicle is already checked out.
                            </p>
                        ) : (
                            <CheckoutForm />
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
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
                <div className="mb-3">
                    <label className="form-label">Starting Mileage</label>
                    <input
                        disabled
                        value={vehicle.mileage}
                        className="form-control"
                    />
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>
        );
    }
}
