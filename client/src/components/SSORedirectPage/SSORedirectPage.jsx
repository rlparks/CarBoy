import { useEffect } from "react";

export default function SSORedirectPage({ redirectUrl }) {
    useEffect(() => {
        console.log(redirectUrl);
        if (redirectUrl) {
            window.location.replace(redirectUrl);
        }
    }, [redirectUrl]);
    return (
        <div>
            <p className="text-center">Loading...</p>
        </div>
    );
}
