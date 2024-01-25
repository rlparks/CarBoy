import { Link } from "react-router-dom";
import Title from "../Title/Title";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";

export default function Header({ setUserData, isAdmin }) {
    const { userData } = useContext(UserContext);

    // console.log(userData);

    function handleLogout() {
        localStorage.clear();
        setUserData({
            token: undefined,
            user: undefined,
        });
    }

    return (
        <nav className="navbar bg-body-tertiary navbar-expand-lg mb-3">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <Title />
                </Link>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        {isAdmin && (
                            <>
                                <Link className="nav-link" to="/addvehicle">
                                    Add Vehicle
                                </Link>

                                <Link className="nav-link" to="/manageusers">
                                    Manage Users
                                </Link>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {userData.user ? (
                            <button
                                className="btn btn-secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link className="btn btn-secondary" to="/login">
                                Login
                            </Link>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
