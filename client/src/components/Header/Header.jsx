import { NavLink, useNavigate } from "react-router-dom";
import Title from "../Title/Title";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { getUser } from "../../assets/helpers";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

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
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand as={Nav.Link} href="/">
                    {/* fails at updating active NavLink, so forcing page load */}
                    <Title />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {userData.user && (
                            <>
                                <Nav.Link as={NavLink} to="/" href="/">
                                    Home
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/trips"
                                    href="/trips"
                                >
                                    Trips
                                </Nav.Link>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/managevehicles"
                                    href="managevehicles"
                                >
                                    Manage Vehicles
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/managedestinations"
                                    href="managedestinations"
                                >
                                    Manage Destinations
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/manageusers"
                                    href="/manageusers"
                                >
                                    Manage Users
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                    {!serverDown && (
                        <Nav>
                            {userData.user ? (
                                <div className="d-flex">
                                    <Nav.Link>{user.fullName}</Nav.Link>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <Nav.Link
                                        as={NavLink}
                                        to="/login"
                                        href="/login"
                                    >
                                        <Button variant="secondary">
                                            Login
                                        </Button>
                                    </Nav.Link>
                                </div>
                            )}
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
