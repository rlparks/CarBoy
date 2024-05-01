import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function SSOCallbackPage({ oidcInfo, setUserData }) {
    const params = useSearchParams()[0];
    const code = params.get("code");
    const urlState = params.get("state");

    const cookieState = document.cookie
        .split("; ")
        .find((row) => row.startsWith("cb_oidc_state"))
        ?.split("=")[1];

    useEffect(() => {
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
            await axios
                .post(
                    SERVER_URL + "api/oidc/login",
                    {},
                    {
                        headers: {
                            "X-CB-Code": code,
                        },
                    }
                )
                .then((res) => {
                    if (res.data.token) {
                        localStorage.setItem("auth-token", res.data.token);
                        setUserData({
                            token: res.data.token,
                            user: res.data.user,
                        });
                    }
                });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <p className="text-center">Loading...</p>
        </div>
    );
}
