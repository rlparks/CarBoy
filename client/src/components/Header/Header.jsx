import { Link, useNavigate } from "react-router-dom";
import Title from "../Title/Title";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { getUser } from "../../assets/helpers";

export default function Header({ setUserData, isAdmin, serverDown }) {
    const { userData, user } = useContext(UserContext);
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.clear();
        setUserData({
            token: undefined,
            user: undefined,
        });
        navigate("/");
    }

    return (
        <nav className="navbar bg-body-tertiary navbar-expand-lg mb-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <Title />
                </Link>{" "}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {userData.user && (
                            <>
                                <Link className="nav-link" to="/">
                                    Home
                                </Link>

                                <Link className="nav-link" to="/trips">
                                    Trips
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Link className="nav-link" to="/managevehicles">
                                    Manage Vehicles
                                </Link>

                                <Link className="nav-link" to="/manageusers">
                                    Manage Users
                                </Link>

                                <Link
                                    className="nav-link"
                                    to="/managedestinations"
                                >
                                    Manage Destinations
                                </Link>
                            </>
                        )}
                    </ul>

                    {!serverDown && (
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            {userData.user ? (
                                <div className="d-flex">
                                    <Link className="nav-link me-1">
                                        {user.fullName}
                                    </Link>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <Link
                                        className="btn btn-secondary"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </div>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}
