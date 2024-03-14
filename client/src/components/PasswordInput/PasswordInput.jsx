import { useState } from "react";

export default function PasswordInput(props) {
    const [passwordInputType, setPasswordInputType] = useState("password");
    const [showButtonText, setShowButtonText] = useState("Show");
    function togglePassword(event) {
        event.preventDefault();
        if (showButtonText === "Show") {
            // revealing password
            setShowButtonText("Hide");
            setPasswordInputType("text");
        } else {
            // hiding password
            setShowButtonText("Show");
            setPasswordInputType("password");
        }
    }

    return (
        <div className="input-group">
            <input
                value={props.value}
                onChange={props.onChange}
                type={passwordInputType}
                className="form-control"
                autoComplete={props.autoComplete}
                id={props.id}
                aria-describedby={props.ariadescribedby}
            />
            <button
                className="btn btn-outline-secondary"
                onClick={togglePassword}
                type="button"
            >
                {showButtonText}
            </button>
        </div>
    );
}
