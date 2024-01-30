import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 1000);
    }, []);

    return (
        <div className="d-flex justify-content-center">
            <div className="text-center">
                <div>
                    <h1 className="mb-3">Success!</h1>
                    <p>Please wait, or click to be redirected...</p>
                    <Link className="btn btn-outline-primary" to="/">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
