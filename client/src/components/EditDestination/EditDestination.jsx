import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        <div className="d-flex justify-content-center">
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
                    <button className="btn btn-primary mb-3">Submit</button>
                </form>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
