import axios from "axios";
import UserContext from "../../context/UserContext";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function LoginPage({ oidcInfo }) {
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
            const loginRes = await axios.post(SERVER_URL + "api/login", {
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
                        <label id="passwordLabel" className="form-label">
                            Password
                        </label>
                        <div className="input-group">
                            <PasswordInput
                                value={password}
                                onChange={passwordChangeHandler}
                                autoComplete="current-password"
                                id="current-password"
                                ariadescribedby="passwordLabel"
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary">Submit</button>
                        {oidcInfo.enabled && (
                            <div className="btn-group">
                                <Link className="btn btn-outline-primary" to={"/login/sso"}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-key me-1"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                    </svg>
                                    Login with SSO
                                </Link>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
