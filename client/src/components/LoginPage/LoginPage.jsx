import axios from "axios";
import UserContext from "../../context/UserContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { setUserData } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function usernameChangeHandler(event) {
        setUsername(event.target.value);
    }

    function passwordChangeHandler(event) {
        setPassword(event.target.value);
    }

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const loginRes = await axios.post(
                // TODO
                "http://localhost:8081/api/login/login",
                {
                    username,
                    password,
                }
            );

            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });

            localStorage.setItem("auth-token", loginRes.data.token);
            navigate("/");
        } catch (err) {
            console.error("Login error:", err.response); // error message in console

            // for 404 error: usually wrong username or password
            if (err.response && err.response.status === 400) {
                setError(
                    "Invalid credentials. Please check your username and password."
                );
            }
        }
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="w-25">
                <h2 className="text-center mb-3">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            autoFocus
                            value={username}
                            onChange={usernameChangeHandler}
                            type="text"
                            className="form-control"
                            id="usernameInput"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            value={password}
                            onChange={passwordChangeHandler}
                            type="password"
                            className="form-control"
                        />
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
