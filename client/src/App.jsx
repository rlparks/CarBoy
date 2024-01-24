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
                // TODO
                "http://localhost:8081/api/login/tokenIsValid",
                null,
                { headers: { "x-auth-token": token } }
            );

            if (tokenResponse.data) {
                const userRes = await axios.get(
                    "http://localhost:8081/api/login",
                    {
                        headers: { "x-auth-token": token },
                    }
                );
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
                        element={<VehicleList isAdmin={isAdmin} />}
                    />
                    <Route
                        path="/addvehicle"
                        element={
                            userData.user ? (
                                isAdmin ? (
                                    <AddVehicle />
                                ) : (
                                    <ErrorPage type={403} />
                                )
                            ) : (
                                <ErrorPage type={401} />
                            )
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
                            userData.user ? (
                                isAdmin ? (
                                    <UsersPage />
                                ) : (
                                    <ErrorPage type={403} />
                                )
                            ) : (
                                <ErrorPage type={401} />
                            )
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
                    <Route path="*" element={<ErrorPage type={404} />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}
