import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function AddUser() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        admin: false,
        pictureUrl: "",
    });
    const { userData } = useContext(UserContext);

    function usernameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, username: event.target.value };
        });
    }
    function passwordChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, password: event.target.value };
        });
    }
    function confirmPasswordChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, confirmPassword: event.target.value };
        });
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

    function pictureUrlChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, pictureUrl: event.target.value };
        });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!user.username || !user.fullName) {
            alert("Please fill out all fields.");
        } else {
            const url = SERVER_URL + "api/login/signup/";
            try {
                await axios.post(url, user, {
                    headers: { "x-auth-token": userData.token },
                });
                navigate("/success/manageusers");
            } catch (err) {
                setError(err.response.data.msg);
            }
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">{"Add User"}</h2>
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
                            value={user.password}
                            onChange={passwordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder=""
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            value={user.confirmPassword}
                            onChange={confirmPasswordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder=""
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
                        <label className="form-label">Picture URL</label>
                        <input
                            value={user.pictureUrl}
                            onChange={pictureUrlChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="https://www.example.com/image.png"
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
