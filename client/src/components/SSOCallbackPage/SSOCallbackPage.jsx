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
    document.cookie = `cb_oidc_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=strict;`;

    useEffect(() => {
        document.title = "CarBoy · Logging in...";
        if (code) {
            if (urlState === cookieState) {
                loginWithCode();
            } else {
                console.error("State mismatch");
                localStorage.setItem("auth-token", "");
                setUserData({
                    token: undefined,
                    user: undefined,
                });
                navigate("/");
            }
        }
    }, [code]);

    async function loginWithCode() {
        // console.log(code);
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
                // const cookieStr = `id_token=${loginResponse.data.idToken}; path=/; max-age=${
                //     60 * 60 * 24 * 365
                // }; SameSite=strict;`;

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
            {!error && <p className="text-center">Logging in...</p>}
        </div>
    );
}
