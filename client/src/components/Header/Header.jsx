import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Title from "../Title/Title";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

export default function Header({ setUserData, isAdmin, serverDown, oidcInfo }) {
    const { userData, user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loginUrl, setLoginUrl] = useState("/login");
    const [logoutIdToken, setLogoutIdToken] = useState(localStorage.getItem("cb-id-token"));

    function handleLogout() {
        // const cookieIdToken = document.cookie
        //     .split("; ")
        //     .find((row) => row.startsWith("id_token"))
        //     ?.split("=")[1];

        localStorage.clear();

        if (oidcInfo && oidcInfo.enabled && oidcInfo.logoutRedirectUrl && logoutIdToken) {
            // document.cookie = `id_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=strict;`;
            const redirectUrl =
                oidcInfo.logoutRedirectUrl +
                `?${new URLSearchParams(
                    `post_logout_redirect_uri=${SERVER_URL}&id_token_hint=${logoutIdToken}`
                ).toString()}`;

            setUserData({
                token: undefined,
                user: undefined,
            });
            window.location.href = redirectUrl;
        } else {
            setUserData({
                token: undefined,
                user: undefined,
            });
            navigate("/");
        }
    }

    const [expanded, setExpanded] = useState(false);

    function handleClick(url) {
        // setLink(url);
        setExpanded(false);
    }
    const url = useLocation();
    const [link, setLink] = useState(url.pathname);

    // no dependencies, so this runs EVERY rerender
    // meaning link is always accurate! :)
    // thankfully React is smart enough to not rerender
    // on every setLink call...
    useEffect(() => {
        if (link !== url.pathname) {
            setLink(url.pathname);
        }
        if (oidcInfo && oidcInfo.enabled && oidcInfo.defaultSSO && oidcInfo.loginRedirectUrl) {
            setLoginUrl("/login/sso");
        }
    });

    useEffect(() => {
        if (url.pathname === "/") {
            // slightly hide client_id after SSO logout
            const query = new URLSearchParams(url.search);
            if (query.has("client_id")) {
                navigate("/", { replace: true });
            }
        }
    }, []);

    if (link.includes("/dashboard") && userData.user) {
        return (
            <div className="d-flex justify-content-center mt-3 mb-1">
                <Navbar.Brand as={NavLink} to="/" onClick={() => handleClick("/")}>
                    <Title />
                </Navbar.Brand>
            </div>
        );
    }

    return (
        <Navbar expanded={expanded} expand="lg" className="bg-body-tertiary mb-1">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" onClick={() => handleClick("/")}>
                    <Title />
                </Navbar.Brand>
                <Navbar.Toggle
                    onClick={() => setExpanded((prev) => !prev)}
                    aria-controls="responsive-navbar-nav"
                />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {userData.user && (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/"
                                    onClick={() => handleClick("/")}
                                    className={link === "/" && "active"}
                                >
                                    Home
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/trips"
                                    onClick={() => handleClick("/trips")}
                                    className={link.includes("/trips") && "active"}
                                >
                                    Trips
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/dashboard"
                                    onClick={() => handleClick("/dashboard")}
                                >
                                    Dashboard
                                </Nav.Link>
                            </>
                        )}
                        {/* <div className="vr" /> */}
                        {isAdmin && (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/managevehicles"
                                    onClick={() => handleClick("/managevehicles")}
                                    className={link.includes("/managevehicles") && "active"}
                                >
                                    Manage Vehicles
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/managedestinations"
                                    onClick={() => handleClick("/managedestinations")}
                                    className={link.includes("/managedestinations") && "active"}
                                >
                                    Manage Destinations
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/manageusers"
                                    onClick={() => handleClick("/manageusers")}
                                    className={link.includes("/manageusers") && "active"}
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
                                    {logoutIdToken ? (
                                        <p className="nav-link mb-0">{user.fullName}</p>
                                    ) : (
                                        <Nav.Link
                                            as={NavLink}
                                            to="/manageself"
                                            onClick={() => handleClick("/manageself")}
                                            className={link === "/manageself" && "active"}
                                        >
                                            {user.fullName}
                                        </Nav.Link>
                                    )}
                                    <button className="btn btn-secondary" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <Nav.Link
                                        as={NavLink}
                                        to={loginUrl}
                                        onClick={() => handleClick("/login")}
                                        className={link.includes("/login") && "active"}
                                    >
                                        <Button variant="secondary">Login</Button>
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
