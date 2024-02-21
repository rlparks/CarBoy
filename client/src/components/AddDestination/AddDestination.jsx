import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDestination() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [destination, setDestination] = useState({
        buildingNumber: "",
        destinationName: "",
    });

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
        if (destination.buildingNumber) {
            destination.buildingNumber = destination.buildingNumber.padStart(
                4,
                "0"
            );
        }

        if (!destination.destinationName) {
            alert("Please add a name.");
        } else {
            const url = SERVER_URL + "api/destinations/";
            try {
                await axios.post(url, destination);
                navigate("/success");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Add Destination"}</h2>
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
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
