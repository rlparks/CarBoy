import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function SuccessPage() {
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        let url = "/";
        if (params.redirectUrl) {
            url += params.redirectUrl;
        }
        setTimeout(() => {
            navigate(url);
        }, 1000);
        document.title = "CarBoy · Success";
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
