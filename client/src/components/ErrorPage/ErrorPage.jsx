import { Link } from "react-router-dom";

export default function ErrorPage({ type }) {
    return (
        <div className="d-flex justify-content-center">
            <div className="text-center">
                {type === 404 && (
                    <div>
                        <h1 className="mb-3">Error 404: Page Not Found</h1>
                        <p>
                            Please contact ESD IT if you expected to find a page
                            here.
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
                        <p>Please contact ESD IT to gain access.</p>
                        <Link className="btn btn-outline-primary" to="/">
                            Home
                        </Link>
                    </div>
                )}

                {type === 401 && (
                    <div>
                        <h1 className="mb-3">Error 401: Not Authorized</h1>
                        <p>
                            Please login with an admin account to gain access.
                        </p>
                        <Link className="btn btn-outline-primary" to="/">
                            Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
