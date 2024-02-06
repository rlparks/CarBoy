import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../assets/helpers";

export default function DeleteUser() {
    const params = useParams();
    const userId = params.userId;
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        admin: false,
    });

    useEffect(() => {
        getUser(userId).then((user) => {
            if (!user.fullName) {
                user.fullName = "";
            }
            setUser(user);
        });
    }, []);

    async function submitHandler(event) {
        event.preventDefault();

        // TODO
        const url = "http://localhost:8081/" + "api/users/" + user._id;
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
                <h2 className="text-center mb-3">
                    {"Delete: " + user.username}
                </h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <p className="text-center">
                    Are you sure you want to delete this user?
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
