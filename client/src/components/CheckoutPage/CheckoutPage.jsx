import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { getVehicleDetails, sortDestinations } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function CheckoutPage() {
    const params = useParams();
    const { userData, user } = useContext(UserContext);
    const vehicleNumber = params.vehicleNumber;
    const [vehicle, setVehicle] = useState({ pictureUrl: "", mileage: "" });
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [destinationArray, setDestinationArray] = useState([]);

    const [destination, setDestination] = useState("");
    const [name, setName] = useState("");

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
            };

            const url = SERVER_URL + "api/checkout/" + vehicleNumber;
            try {
                const res = await axios.post(url, vehicleObj, {
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
            document.title = "CarBoy · Check Out · " + vehicle.vehicleNumber;
        });

        // setDestinationArray([
        //     "1131 - STEM I",
        //     "1132 - STEM II",
        //     "1020 - Food Science",
        //     "1025 - Poultry Science",
        //     "0678 - Sanford Stadium",
        //     "0631 - Administration Building",
        //     "0023 - Terrell Hall",
        //     "0043 - Law School",
        //     "0040 - Jackson Street Building",
        //     "0046 - Caldwell Hall",
        //     "0031 - Candler Hall",
        // ]);

        axios
            .get(SERVER_URL + "api/destinations/", {
                headers: { "x-auth-token": userData.token },
            })
            .then((res) => {
                setDestinationArray(res.data.sort(sortDestinations));
            });
    }, []);

    useEffect(() => {
        if (user && user.fullName) {
            setName(user.fullName);
        }
    }, [user]);

    return vehicle ? (
        <div className="">
            <h2 className="text-center mb-3">Check Out</h2>
            {error && <p className="text-center text-danger">{error}</p>}
            <div className="d-flex justify-content-center">
                <div className="w-75">
                    <div className="row row-cols-1 row-cols-lg-2">
                        <div className="col">
                            <img
                                className="img-fluid mx-auto"
                                src={vehicle.pictureUrl}
                                alt={"Image of " + vehicleNumber}
                                style={{ width: "500px" }}
                            />
                        </div>
                        <div className="col">
                            {vehicle.checkedOut ? (
                                <p className="text-center">
                                    Error: Vehicle is already checked out.
                                </p>
                            ) : (
                                <form onSubmit={submitHandler}>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Vehicle Number
                                        </label>
                                        <input
                                            disabled
                                            value={vehicleNumber}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Employee
                                        </label>
                                        <input
                                            disabled
                                            value={name}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Destination
                                        </label>
                                        <input
                                            autoFocus
                                            value={destination}
                                            onChange={destinationChangeHander}
                                            type="text"
                                            className="form-control"
                                            placeholder="Type to search, or enter your own"
                                            list="destinationDatalist"
                                        />
                                        <datalist id="destinationDatalist">
                                            {destinationArray.map(
                                                (destination) => {
                                                    const destDisplay =
                                                        destination.buildingNumber
                                                            ? destination.buildingNumber +
                                                              " - " +
                                                              destination.destinationName
                                                            : destination.destinationName;
                                                    return (
                                                        <option
                                                            key={
                                                                destination._id
                                                            }
                                                            value={destDisplay}
                                                        />
                                                    );
                                                }
                                            )}
                                        </datalist>
                                    </div>
                                    {vehicle.make !== "Departmental" && (
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Starting Mileage
                                            </label>
                                            <input
                                                disabled
                                                value={vehicle.mileage}
                                                className="form-control"
                                            />
                                        </div>
                                    )}

                                    <button className="btn btn-primary mb-3">
                                        Submit
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
