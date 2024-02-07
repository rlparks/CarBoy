import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddVehicle from "./components/AddVehicle/AddVehicle";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Header from "./components/Header/Header";
import LoginPage from "./components/LoginPage/LoginPage";
import VehicleList from "./components/VehicleList/VehicleList";
import UserContext from "./context/UserContext";
import UsersPage from "./components/UsersPage/UsersPage";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage";
import EditVehicle from "./components/EditVehicle/EditVehicle";
import CheckinPage from "./components/CheckinPage/CheckinPage";
import SuccessPage from "./components/SuccessPage/SuccessPage";
import TripsPage from "./components/TripsPage/TripsPage";
import EditUser from "./components/EditUser/EditUser";
import AddUser from "./components/AddUser/AddUser";
import DeletePage from "./components/DeletePage/DeletePage";
import { SERVER_URL } from "./assets/helpers";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        async function checkLoggedIn() {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }

            const tokenResponse = await axios.post(
                SERVER_URL + "api/login/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            );

            if (tokenResponse.data) {
                const userRes = await axios.get(SERVER_URL + "api/login", {
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        }

        checkLoggedIn();
    }, []);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        try {
            if (userData.user) {
                setIsAdmin(userData.user.admin);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.log(err);
        }
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <BrowserRouter>
                <Header setUserData={setUserData} isAdmin={isAdmin} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <VehicleList isAdmin={isAdmin} mode={"normal"} />
                        }
                    />
                    <Route
                        path="/addvehicle"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <AddVehicle />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/managevehicles"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <VehicleList isAdmin={isAdmin} mode="manage" />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/managevehicles/delete/:vehicleNumber"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <DeletePage mode="vehicle" />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/trips"
                        element={
                            userData.user ? (
                                <VehicleList isAdmin={isAdmin} mode="trips" />
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
                        path="/editVehicle/:vehicleNumber"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <EditVehicle />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            userData.user ? <Navigate to="/" /> : <LoginPage />
                        }
                    />
                    <Route
                        path="/manageusers"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <UsersPage />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/manageusers/:userId"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <EditUser />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/adduser"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
                                <AddUser />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/manageusers/delete/:userId"
                        element={
                            <RequireAdmin userData={userData} isAdmin={isAdmin}>
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
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="*" element={<ErrorPage type={404} />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
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
