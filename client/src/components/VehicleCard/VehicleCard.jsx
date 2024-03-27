import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useContext, useState } from "react";
import { getUser } from "../../assets/helpers";

export default function VehicleCard({ vehicle, isAdmin, mode }) {
    const { userData, userCache, addUserToCache } = useContext(UserContext);
    const [currentUser, setCurrentUser] = useState({ fullName: "" });
    const [currentDestination, setCurrentDestination] = useState("");

    useState(() => {
        if (userData.user && vehicle.currentUserId != null) {
            // console.log(userCache);
            getUser(
                vehicle.currentUserId,
                userData.token,
                userCache,
                addUserToCache
            )
                .then((user) => {
                    // console.log(user);
                    setCurrentUser(user);
                })
                .catch((err) => {
                    console.log(err);
                    setCurrentUser({ fullName: "Unknown User" });
                });

            const currentTrip = vehicle.trips[vehicle.trips.length - 1];
            setCurrentDestination(currentTrip.destination);
        }
    }, [userData]);

    return (
        <div className="card h-100 mb-3" key={vehicle._id}>
            <img
                className="card-img-top"
                src={vehicle.pictureUrl}
                alt={"Image of " + vehicle.vehicleNumber}
                // style={({ width: "75%" }, { height: "75%" })}
            />
            <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 className="card-title">{vehicle.vehicleNumber}</h5>
                    <p className="card-text">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                </div>
                <div>
                    {mode === "normal" && userData.user && (
                        <VehicleButton vehicle={vehicle} />
                    )}

                    {mode === "manage" && (
                        <AdminButtons isAdmin={isAdmin} vehicle={vehicle} />
                    )}

                    {mode === "trips" && <TripButtons vehicle={vehicle} />}
                </div>
            </div>
            {!userData.user && (
                <Link to="/login" className="card-footer text-body-secondary">
                    Login to use
                </Link>
            )}

            {/* display current destination if vehicle is checked out */}
            {userData.user && vehicle.checkedOut && currentDestination && (
                <div className="card-footer text-body-secondary text-truncate">
                    {currentDestination}
                </div>
            )}

            {/* display current employee responsible if vehicle is checked out */}
            {userData.user &&
                vehicle.checkedOut &&
                currentUser &&
                currentUser.fullName && (
                    <div className="card-footer text-body-secondary">
                        {currentUser.fullName
                            ? currentUser.fullName
                            : "Invalid User"}
                    </div>
                )}
        </div>
    );
}

function VehicleButton({ vehicle }) {
    if (vehicle.checkedOut) {
        return (
            <div className="btn-group me-1">
                <Link
                    className="btn btn-primary"
                    to={"/checkin/" + vehicle.vehicleNumber}
                >
                    Check In
                </Link>
            </div>
        );
    } else {
        return (
            <div className="btn-group me-1">
                <Link
                    className="btn btn-success"
                    to={"/checkout/" + vehicle.vehicleNumber}
                >
                    Check Out
                </Link>
            </div>
        );
    }
}

function AdminButtons({ isAdmin, vehicle }) {
    return (
        <div>
            <div className="btn-group me-1">
                {isAdmin && (
                    <Link
                        className="btn btn-warning"
                        to={"/managevehicles/" + vehicle.vehicleNumber}
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
                )}
            </div>
            <div className="btn-group">
                <Link
                    className="btn btn-danger"
                    to={"/managevehicles/delete/" + vehicle.vehicleNumber}
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
    );
}

function TripButtons({ vehicle }) {
    return (
        <div>
            <div className="btn-group">
                <Link
                    className="btn btn-primary"
                    to={"/trips/" + vehicle.vehicleNumber}
                >
                    {/* https://icons.getbootstrap.com/icons/sign-turn-right/ */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-sign-turn-right me-1"
                        viewBox="0 0 16 16"
                    >
                        <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6H9V4.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L9.41 8.658A.25.25 0 0 1 9 8.466V7H7.5A1.5 1.5 0 0 0 6 8.5V11H5z" />
                        <path
                            fillRule="evenodd"
                            d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134Z"
                        />
                    </svg>
                    Trips
                </Link>
            </div>
        </div>
    );
}
