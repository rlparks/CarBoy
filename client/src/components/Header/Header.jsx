import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

    const url = useLocation();
    const [link, setLink] = useState(url.pathname);
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" onClick={() => setLink("/")}>
                    <Title />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {userData.user && (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/"
                                    onClick={() => setLink("/")}
                                    className={link === "/" && "active"}
                                >
                                    Home
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/trips"
                                    onClick={() => setLink("/trips")}
                                    className={
                                        link.includes("/trips") && "active"
                                    }
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
                                    onClick={() => setLink("/managevehicles")}
                                    className={
                                        link.includes("/managevehicles") &&
                                        "active"
                                    }
                                >
                                    Manage Vehicles
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/managedestinations"
                                    onClick={() =>
                                        setLink("/managedestinations")
                                    }
                                    className={
                                        link.includes("/managedestinations") &&
                                        "active"
                                    }
                                >
                                    Manage Destinations
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/manageusers"
                                    onClick={() => setLink("/manageusers")}
                                    className={
                                        link.includes("/manageusers") &&
                                        "active"
                                    }
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
                                    <Nav.Link
                                        as={NavLink}
                                        to="/manageself"
                                        onClick={() => setLink("/manageself")}
                                        className={
                                            link === "/manageself" && "active"
                                        }
                                    >
                                        {user.fullName}
                                    </Nav.Link>
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
                                        onClick={() => setLink("/login")}
                                        className={
                                            link.includes("/login") && "active"
                                        }
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
