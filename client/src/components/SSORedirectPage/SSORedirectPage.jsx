import { useEffect } from "react";

export default function SSORedirectPage({ redirectUrl }) {
    useEffect(() => {
        // console.log(redirectUrl);
        if (redirectUrl) {
            let state = new Uint32Array(1);
            crypto.getRandomValues(state);

            const cookieStr = `cb_oidc_state=${state[0]}; path=/; max-age=60; SameSite=strict;`;
            document.cookie = cookieStr;

            console.log(state[0]);

            window.location.replace(redirectUrl + "&state=" + state[0]);
        }
    }, [redirectUrl]);
    return (
        <div>
            <p className="text-center">Loading...</p>
        </div>
    );
}
