import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ErrorPage({ type }) {
    useEffect(() => {
        document.title = "CarBoy · Error · " + type;
    }, []);
    return (
        <div className="d-flex justify-content-center">
            <div className="text-center">
                {type === 404 && (
                    <div>
                        <h1 className="mb-3">Error 404: Page Not Found</h1>
                        <p>
                            Please contact support if you expected to find a
                            page here.
                        </p>
                        <p>Otherwise, return home and try again.</p>
                        <Link className="btn btn-outline-primary" to="/">
                            Home
                        </Link>
                    </div>
                )}

                {type === 403 && (
                    <div>
                        <h1 className="mb-3">Error 403: Forbidden</h1>
                        <p>
                            Only administrator accounts can access this
                            resource.
                        </p>
                        <Link className="btn btn-outline-primary" to="/">
                            Home
                        </Link>
                    </div>
                )}

                {type === 401 && (
                    <div>
                        <h1 className="mb-3">Error 401: Not Authorized</h1>
                        <p>Please login to gain access.</p>
                        <Link className="btn btn-outline-primary" to="/">
                            Home
                        </Link>
                    </div>
                )}

                {type === 503 && (
                    <div>
                        <h1 className="mb-3">Error 503: Service Unavailable</h1>
                        <p>CarBoy is unable to access its server.</p>
                        <p>Please alert support.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
