import { useContext, useState } from "react";
import { getDateTimeFormat, getUser } from "../../assets/helpers";
import UserContext from "../../context/UserContext";

export default function TripCard({ trip }) {
    const [employeeOut, setEmployeeOut] = useState({
        fullName: "Error retrieving user",
    });
    const [employeeIn, setEmployeeIn] = useState("");
    const { userData } = useContext(UserContext);

    useState(() => {
        if (trip.employee[0] != null) {
            const differentOutIn = trip.employee[1]
                ? trip.employee[0] !== trip.employee[1]
                : false;

            getUser(trip.employee[0], userData.token).then((empOut) => {
                setEmployeeOut(empOut);

                if (differentOutIn) {
                    getUser(trip.employee[1], userData.token).then((empIn) =>
                        setEmployeeIn(empIn)
                    );
                } else {
                    setEmployeeIn(empOut);
                }
            });
        }
    }, [userData]);

    const startTime = getDateTimeFormat().format(new Date(trip.startTime));
    const endTime = trip.endTime
        ? getDateTimeFormat().format(new Date(trip.endTime))
        : "Now";
    const distance = trip.endMileage ? trip.endMileage - trip.startMileage : -1;

    return (
        <div className="card" key={trip._id}>
            <div className="card-body d-flex flex-row justify-content-between">
                <div>
                    <h5 className="card-title">
                        {startTime + " - " + endTime}
                    </h5>
                    <h6 className="card-subtitle text-body-secondary">
                        {employeeOut.fullName}
                    </h6>
                    {employeeIn && employeeOut._id !== employeeIn._id && (
                        <>
                            <br />
                            <h6 className="card-subtitle text-warning">
                                Checked in by: {employeeIn.fullName}
                            </h6>
                        </>
                    )}
                </div>
                {employeeOut.pictureUrl && (
                    <img
                        className="img-fluid rounded-circle"
                        src={employeeOut.pictureUrl}
                        alt={"Image of " + employeeOut.username}
                        style={{ height: "75px" }}
                    />
                )}
            </div>

            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    {"Destination: " + trip.destination}
                </li>
                {trip.startMileage && (
                    <li className="list-group-item">
                        {"Starting Mileage: " + trip.startMileage}
                    </li>
                )}
                {trip.endMileage && (
                    <li className="list-group-item">
                        {"Ending Mileage: " + trip.endMileage}
                    </li>
                )}
                {/* duplicate for style reasons */}
                {trip.endMileage && (
                    <li className="list-group-item">
                        {"Distance: " + distance}
                    </li>
                )}
            </ul>
        </div>
    );
}
