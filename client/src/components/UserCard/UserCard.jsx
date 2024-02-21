import { Link } from "react-router-dom";

export default function UserCard({ user }) {
    return (
        <div className="card" key={user._id}>
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{user.username}</h5>
                        <h6 className="card-subtitle text-body-secondary mb-3">
                            {user.fullName}
                        </h6>
                        {user.admin && <p className="card-text">Admin</p>}
                        <div className="btn-group me-1">
                            <Link
                                className="btn btn-warning"
                                to={"/manageusers/" + user._id}
                            >
                                {/* https://icons.getbootstrap.com/icons/pencil-square/ */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-square me-1"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                </svg>
                                Edit
                            </Link>
                        </div>

                        <div className="btn-group">
                            <Link
                                className="btn btn-danger"
                                to={"/manageusers/delete/" + user._id}
                            >
                                {/* https://icons.getbootstrap.com/icons/trash/ */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-trash me-1"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                                Delete
                            </Link>
                        </div>
                    </div>
                </div>
                {user.pictureUrl && (
                    <div className="col-md-4">
                        <img
                            className="img-fluid rounded-end"
                            src={user.pictureUrl}
                            alt={"Image of " + user.username}
                            style={({ width: "100%" }, { height: "100%" })}
                        />
                    </div>
                )}
            </div>
            {/* {true && <div className="card-footer">Current vehicles</div>} */}
        </div>
    );
}
