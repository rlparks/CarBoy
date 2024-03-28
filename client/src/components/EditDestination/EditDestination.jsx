import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDestination } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";
import UserContext from "../../context/UserContext";

export default function EditDestination() {
    const params = useParams();
    const navigate = useNavigate();
    const destinationId = params.destinationId;
    const [error, setError] = useState("");
    const [destination, setDestination] = useState({
        destinationName: "",
        buildingNumber: "",
    });
    const { userData } = useContext(UserContext);
    const [destinationExists, setDestinationExists] = useState(true);

    useEffect(() => {
        getDestination(destinationId, userData.token).then((destination) => {
            if (destination) {
                document.title =
                    "CarBoy · Edit Destination · " +
                    destination.destinationName;
                if (!destination.buildingNumber) {
                    // force not-null to make React happy
                    destination.buildingNumber = "";
                }
                setDestination(destination);
            } else {
                setDestinationExists(false);
            }
        });
    }, []);

    function buildingNumberChangeHandler(event) {
        event.target.value = event.target.value.slice(0, 4);
        setDestination((prevDestination) => {
            return { ...prevDestination, buildingNumber: event.target.value };
        });
    }
    function destinationNameChangeHandler(event) {
        setDestination((prevDestination) => {
            return { ...prevDestination, destinationName: event.target.value };
        });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!destination.destinationName) {
            alert("Please add a name.");
        } else {
            const url = SERVER_URL + "api/destinations/" + destination._id;
            try {
                await axios.put(url, destination, {
                    headers: { "x-auth-token": userData.token },
                });
                navigate("/success/managedestinations");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    return destinationExists ? (
        <div className="d-flex justify-content-center mb-3">
            <div className="w-50">
                <h2 className="text-center mb-3">
                    {"Edit: " + destination.destinationName}
                </h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label">Destination Name</label>
                        <input
                            autoFocus
                            value={destination.destinationName}
                            onChange={destinationNameChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="Environmental Safety Division"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Building Number</label>
                        <input
                            value={destination.buildingNumber}
                            onChange={buildingNumberChangeHandler}
                            type="number"
                            className="form-control"
                            placeholder="2118"
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary">Submit</button>
                        <div className="btn-group">
                            <Link
                                className="btn btn-outline-danger"
                                to={
                                    "/managedestinations/delete/" +
                                    destination._id
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
                                Delete Destination
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
