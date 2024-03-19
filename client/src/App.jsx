import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddUser from "./components/AddUser/AddUser";
import AddVehicle from "./components/AddVehicle/AddVehicle";
import CheckinPage from "./components/CheckinPage/CheckinPage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import DeletePage from "./components/DeletePage/DeletePage";
import EditUser from "./components/EditUser/EditUser";
import EditVehicle from "./components/EditVehicle/EditVehicle";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import SuccessPage from "./components/SuccessPage/SuccessPage";
import TripsPage from "./components/TripsPage/TripsPage";
import UsersPage from "./components/UsersPage/UsersPage";
import VehicleList from "./components/VehicleList/VehicleList";
import UserContext from "./context/UserContext";
import { getUser } from "./assets/helpers";
import DestinationsPage from "./components/DestinationsPage/DestinationsPage";
import AddDestination from "./components/AddDestination/AddDestination";
import EditDestination from "./components/EditDestination/EditDestination";
import DashboardPage from "./components/DashboardPage/DashboardPage";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });
    const [user, setUser] = useState({
        fullName: null,
        admin: false,
        username: null,
    });
    const [serverRunning, setServerRunning] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(SERVER_URL + "api/")
            .then((response) => {
                setServerRunning(true);
            })
            .catch((err) => setServerRunning(false));
    }, []);

    useEffect(() => {
        async function checkLoggedIn() {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }

            if (serverRunning) {
                try {
                    const tokenResponse = await axios.get(
                        SERVER_URL + "api/login/tokenIsValid",
                        { headers: { "x-auth-token": token } }
                    );

                    if (tokenResponse.data) {
                        const userRes = await axios.get(
                            SERVER_URL + "api/login",
                            {
                                headers: { "x-auth-token": token },
                            }
                        );
                        setUserData({
                            token,
                            user: userRes.data,
                        });
                    }
                } catch (err) {
                    localStorage.clear();
                    setUserData({
                        token: undefined,
                        user: undefined,
                    });
                }

                setLoading(false);
            }
        }

        checkLoggedIn();
    }, [serverRunning]);

    useEffect(() => {
        try {
            if (userData.user) {
                getUser(userData.user.id, userData.token).then((userObj) => {
                    if (!userObj.fullName) {
                        userObj.fullName = userObj.username;
                    }
                    setUser(userObj);
                });
            } else {
                setUser({
                    fullName: null,
                    admin: false,
                    username: null,
                });
            }
        } catch (err) {
            console.log("ERROR IN SETUSER");
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData, user }}>
            {serverRunning ? (
                !loading && <NormalBrowserRouter />
            ) : (
                <NoServerBrowserRouter />
            )}
        </UserContext.Provider>
    );

    function NoServerBrowserRouter() {
        return (
            <BrowserRouter>
                <Header serverDown={true} />
                <Routes>
                    <Route path="*" element={<ErrorPage type={503} />} />
                </Routes>
            </BrowserRouter>
        );
    }

    function NormalBrowserRouter() {
        {
            return (
                <BrowserRouter>
                    <Header setUserData={setUserData} isAdmin={user.admin} />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <VehicleList
                                    isAdmin={user.admin}
                                    mode={"normal"}
                                />
                            }
                        />
                        <Route
                            path="/addvehicle"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <AddVehicle />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/managevehicles"
                            element={
                                // not using RequireAdmin to avoid component refresh when navigating
                                userData.user ? (
                                    user.admin ? (
                                        <VehicleList
                                            isAdmin={user.admin}
                                            mode="manage"
                                        />
                                    ) : (
                                        <ErrorPage type={403} />
                                    )
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/managevehicles/delete/:vehicleNumber"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <DeletePage mode="vehicle" />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/trips"
                            element={
                                userData.user ? (
                                    <VehicleList
                                        isAdmin={user.admin}
                                        mode="trips"
                                    />
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/trips/:vehicleNumber"
                            element={
                                userData.user ? (
                                    <TripsPage />
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/managevehicles/:vehicleNumber"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <EditVehicle />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                userData.user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <LoginPage />
                                )
                            }
                        />
                        <Route
                            path="/manageusers"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <UsersPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/manageusers/:userId"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <EditUser mode="admin" />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/manageself"
                            element={
                                userData.user ? (
                                    <EditUser mode="self" />
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/adduser"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <AddUser />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/manageusers/delete/:userId"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <DeletePage mode="user" />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/checkout/:vehicleNumber"
                            element={
                                userData.user ? (
                                    <CheckoutPage />
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/checkin/:vehicleNumber"
                            element={
                                userData.user ? (
                                    <CheckinPage />
                                ) : (
                                    <ErrorPage type={401} />
                                )
                            }
                        />
                        <Route
                            path="/adddestination"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <AddDestination />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/managedestinations"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <DestinationsPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/managedestinations/:destinationId"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <EditDestination />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/managedestinations/delete/:destinationId"
                            element={
                                <RequireAdmin
                                    userData={userData}
                                    isAdmin={user.admin}
                                >
                                    <DeletePage mode="destination" />
                                </RequireAdmin>
                            }
                        />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route
                            path="/success/:redirectUrl"
                            element={<SuccessPage />}
                        />
                        <Route path="*" element={<ErrorPage type={404} />} />
                    </Routes>
                </BrowserRouter>
            );
        }
    }
}

function RequireAdmin(props) {
    return props.userData.user ? (
        props.isAdmin ? (
            props.children
        ) : (
            <ErrorPage type={403} />
        )
    ) : (
        <ErrorPage type={401} />
    );
}
