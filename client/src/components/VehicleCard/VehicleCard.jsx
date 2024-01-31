import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useContext, useState } from "react";
import { getUser } from "../../assets/helpers";

export default function VehicleCard({ vehicle, isAdmin, mode }) {
    const { userData } = useContext(UserContext);
    const [currentUser, setCurrentUser] = useState("");

    useState(() => {
        if (vehicle.currentUserId != "") {
            getUser(vehicle.currentUserId).then((user) => {
                console.log(user);
                setCurrentUser(user);
            });
        }
    }, []);

    return (
        <div className="card" key={vehicle._id}>
            <img
                className="card-img-top"
                src={vehicle.pictureUrl}
                alt={"Image of " + vehicle.vehicleNumber}
                style={({ width: "100%" }, { height: "150px" })}
            />
            <div className="card-body">
                <h5 className="card-title">{vehicle.vehicleNumber}</h5>
                <p className="card-text">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {/* <p className="card-text text-body-secondary">{vehicle.year}</p> */}
                {mode == "normal" && userData.user && (
                    <VehicleButton vehicle={vehicle} />
                )}

                {mode == "manage" && (
                    <AdminButtons isAdmin={isAdmin} vehicle={vehicle} />
                )}
            </div>
            {!userData.user && (
                <div className="card-footer text-body-secondary">
                    Login to use
                </div>
            )}

            {userData.user && vehicle.checkedOut && (
                <div className="card-footer text-body-secondary">
                    {currentUser.fullName}
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
            <div className="btn-group">
                {isAdmin && (
                    <Link
                        className="btn btn-warning"
                        to={"/editvehicle/" + vehicle.vehicleNumber}
                    >
                        {/* https://icons.getbootstrap.com/icons/pencil-square/ */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                        >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                                fillRule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
}
