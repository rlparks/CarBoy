import axios from "axios";
import { useEffect, useState } from "react";
import VehicleCard from "../VehicleCard/VehicleCard";
import { Link } from "react-router-dom";
import { downloadJSONFile, readJSONFromFile } from "../../assets/helpers";
import DestinationCard from "../DestinationCard/DestinationCard";

export default function DestinationsPage({ isAdmin, mode }) {
    const numColumns = 5;

    const [destinations, setDestinations] = useState([]);
    const [error, setError] = useState("");

    const refreshDestinations = async () => {
        axios
            .get(SERVER_URL + "api/destinations/")
            .then((result) => setDestinations(result.data));
    };

    useEffect(() => {
        refreshDestinations();
    }, []);

    function exportDestinationsHandler(event) {
        event.preventDefault();
        const destinationsString = JSON.stringify(destinations);
        const now = new Date(Date.now()).toISOString();
        const fileName = "CarBoy_destinations_" + now + ".json";

        downloadJSONFile(fileName, destinationsString);
    }

    async function importDestinationsHandler(event) {
        event.preventDefault();
        const jsonString = await readJSONFromFile();
        const vehiclesArray = JSON.parse(jsonString);

        try {
            const url = SERVER_URL + "api/destinations/import/";
            await axios.post(url, vehiclesArray);
            setError("");
            await refreshDestinations();
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <div>
                        <h2 className="text-center mb-3">Destinations</h2>

                        {destinations.length > 0 ? (
                            <div
                                className={
                                    "row row-cols-1 row-cols-md-" +
                                    numColumns +
                                    " g-4 card-deck"
                                }
                            >
                                {destinations.map((destination) => (
                                    <div className="col" key={destination._id}>
                                        <DestinationCard
                                            destination={destination}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">
                                No destinations are currently available.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div className="d-flex justify-content-center mb-3">
                    <Link className="btn btn-primary me-1" to="/adddestination">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-plus"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                        Add Destination
                    </Link>
                    <button
                        className="btn btn-secondary me-1"
                        onClick={exportDestinationsHandler}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-file-earmark-arrow-down"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                        </svg>
                        Export
                    </button>
                    <button
                        className="btn btn-secondary me-1"
                        onClick={importDestinationsHandler}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-file-earmark-arrow-up"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                        </svg>
                        Import
                    </button>
                </div>
                {error && <p className="text-center text-danger">{error}</p>}
            </div>
        </div>
    );
}
