import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDestination,
    getUser,
    getVehicleDetails,
} from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function DeletePage({ mode }) {
    const params = useParams();
    let itemId;
    if (mode === "user") {
        itemId = params.userId;
    } else if (mode === "vehicle") {
        itemId = params.vehicleNumber;
    } else if (mode === "destination") {
        itemId = params.destinationId;
    }
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [item, setItem] = useState({});

    useEffect(() => {
        if (itemId) {
            if (mode === "user") {
                getUser(itemId).then((user) => {
                    if (user) {
                        if (!user.fullName) {
                            user.fullName = user.username;
                        }

                        setIdentifier(user.fullName);
                    }
                    setItem(user);
                });
            } else if (mode === "vehicle") {
                getVehicleDetails(itemId).then((vehicle) => {
                    setItem(vehicle);
                });
                setIdentifier(params.vehicleNumber);
            } else if (mode === "destination") {
                getDestination(itemId).then((destination) => {
                    setItem(destination);

                    if (destination) {
                        setIdentifier(destination.destinationName);
                    }
                });
            }
        }
    }, [itemId]);

    async function submitHandler(event) {
        event.preventDefault();

        let url = SERVER_URL;
        if (mode === "user") {
            url += "api/users/" + item._id;
        } else if (mode === "vehicle") {
            url += "api/vehicles/" + params.vehicleNumber;
        } else if (mode === "destination") {
            url += "api/destinations/" + item._id;
        }

        try {
            await axios.delete(url);
            navigate("/success");
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    function backHandler(event) {
        event.preventDefault();
        navigate(-1);
    }

    return item ? (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Delete: " + identifier}</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <p className="text-center">
                    Are you sure you want to delete this {mode}?
                </p>
                <p className="text-center text-danger">
                    This will affect past trips.
                </p>
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-danger mx-2"
                        onClick={submitHandler}
                    >
                        Delete
                    </button>
                    <button className="btn btn-secondary" onClick={backHandler}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
