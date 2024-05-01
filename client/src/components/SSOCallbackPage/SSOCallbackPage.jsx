import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SSOCallbackPage({ oidcInfo, setUserData }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const params = useSearchParams()[0];
    const code = params.get("code");
    const urlState = params.get("state");

    const cookieState = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cb_oidc_state"))
        ?.split("=")[1];

    useEffect(() => {
        document.title = "CarBoy · Logging in...";
        if (code) {
            if (urlState === cookieState) {
                loginWithCode();
            } else {
                console.error("State mismatch");
            }
        }
    }, [code]);

    async function loginWithCode() {
        console.log(code);
        try {
            const loginResponse = await axios.post(
                SERVER_URL + "api/oidc/login",
                {},
                {
                    headers: {
                        "X-CB-Code": code,
                    },
                }
            );
            if (loginResponse.data.token) {
                localStorage.setItem("auth-token", loginResponse.data.token);
                setUserData({
                    token: loginResponse.data.token,
                    user: loginResponse.data.user,
                });
                navigate("/");
            }
        } catch (err) {
            // console.error(err);
            setError(err.response.data.error);
        }
    }

    return (
        <div>
            {error && <p className="text-center text-danger">{error}</p>}
            <p className="text-center">Logging in...</p>
        </div>
    );
}
