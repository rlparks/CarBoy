import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../assets/helpers";

export default function EditUser() {
    const params = useParams();
    const navigate = useNavigate();
    const userId = params.userId;
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        admin: false,
    });
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        getUser(userId).then((user) => {
            if (!user.fullName) {
                user.fullName = "";
            }
            setUser(user);
        });
    }, []);

    function usernameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, username: event.target.value };
        });
    }

    function newPasswordChangeHandler(event) {
        setNewPassword(event.target.value);
    }

    function fullNameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, fullName: event.target.value };
        });
    }

    function adminChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, admin: event.target.checked };
        });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!user.username || !user.fullName) {
            alert("Please fill out all fields.");
        } else {
            const userObj = {
                ...user,
                newPassword,
            };

            // TODO
            const url = "http://localhost:8081/" + "api/users/" + user._id;
            try {
                await axios.put(url, userObj);
                navigate("/success");
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Edit: " + user.username}</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            autoFocus
                            value={user.username}
                            onChange={usernameChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="abc12345"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            value={newPassword}
                            onChange={newPasswordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder="leave blank to not change"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            value={user.fullName}
                            onChange={fullNameChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="Example User"
                        />
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                checked={user.admin}
                                onChange={adminChangeHandler}
                                type="checkbox"
                                className="form-check-input"
                            />
                            <label className="form-check-label">Admin</label>
                        </div>
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
