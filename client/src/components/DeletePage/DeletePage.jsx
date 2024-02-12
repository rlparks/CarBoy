import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../assets/helpers";

export default function DeletePage({ mode }) {
    const params = useParams();
    let itemId;
    if (mode === "user") {
        itemId = params.userId;
    } else if (mode === "vehicle") {
        itemId = params.vehicleNumber;
    }
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        admin: false,
    });

    useEffect(() => {
        if (mode === "user") {
            getUser(itemId).then((user) => {
                if (!user.fullName) {
                    user.fullName = user.username;
                }
                setUser(user);
                setIdentifier(user.fullName);
            });
        } else if (mode === "vehicle") {
            setIdentifier(params.vehicleNumber);
        }
    }, []);

    async function submitHandler(event) {
        event.preventDefault();

        let url = SERVER_URL;
        if (mode === "user") {
            url += "api/users/" + user._id;
        } else if (mode === "vehicle") {
            url += "api/vehicles/" + params.vehicleNumber;
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

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Delete: " + identifier}</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <p className="text-center">
                    Are you sure you want to delete this {mode}?
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
    );
}
