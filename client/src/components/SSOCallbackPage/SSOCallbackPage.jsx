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
    }

    return (
        <div>
            <p className="text-center">Loading...</p>
        </div>
    );
}
