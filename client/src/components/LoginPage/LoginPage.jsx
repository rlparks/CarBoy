import axios from "axios";
import UserContext from "../../context/UserContext";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { setUserData } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
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
            const loginRes = await axios.post(SERVER_URL + "api/login/login", {
                username,
                password,
            });

            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });

            localStorage.setItem("auth-token", loginRes.data.token);
            navigate("/");
        } catch (err) {
            // console.error("Login error:", err.response);

            if (err.response) {
                setError(err.response.data.error);
            }
        }
    }
    useEffect(() => {
        document.title = "CarBoy · Login";
    }, []);
    return (
        <div className="d-flex justify-content-center">
            <div className="w-50">
                <h2 className="text-center mb-3">Login</h2>
                {error && <p className="text-center text-danger">{error}</p>}
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
                    <button className="btn btn-primary mb-3">Submit</button>
                </form>
            </div>
        </div>
    );
}
