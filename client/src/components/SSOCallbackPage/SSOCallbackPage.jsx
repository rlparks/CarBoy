import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SSOCallbackPage({ oidcInfo, setUserData }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [logoutIdToken, setLogoutIdToken] = useState("");

    const params = useSearchParams()[0];
    const code = params.get("code");
    const urlState = params.get("state");

    const cookieState = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cb_oidc_state"))
        ?.split("=")[1];
    document.cookie = `cb_oidc_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=strict; Secure;`;

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

                // used for logout hint
                // const cookieStr = `id_token=${loginResponse.data.idToken}; path=/; max-age=${
                //     60 * 60 * 24 * 365
                // }; SameSite=strict;`;
                // document.cookie = cookieStr;
                localStorage.setItem("cb-id-token", loginResponse.data.idToken);

                navigate("/");
            }
        } catch (err) {
            // console.error(err);
            setError(err.response.data.error);
            setLogoutIdToken(err.response.data.idToken);
        }
    }

    return (
        <div>
            {!error && <p className="text-center">Logging in...</p>}
            {error && (
                <div>
                    <p className="text-center text-danger">{error}</p>
                    <div className="d-flex justify-content-center w-100">
                        <a
                            href={
                                oidcInfo.logoutRedirectUrl +
                                `?${new URLSearchParams(
                                    `post_logout_redirect_uri=${SERVER_URL}&id_token_hint=${logoutIdToken}`
                                ).toString()}`
                            }
                            className="btn btn-primary"
                        >
                            SSO Logout
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
