import { useState } from "react";
import { getDateTimeFormat, getUser } from "../../assets/helpers";

export default function TripCard({ trip }) {
    const [employee, setEmployee] = useState({ fullName: "Deleted User" });

    useState(() => {
        if (trip.employee != null) {
            getUser(trip.employee)
                .then((user) => {
                    // console.log(user);
                    if (user !== null) {
                        setEmployee(user);
                    }
                })
                .catch((err) => setEmployee({ fullName: "Deleted User" }));
        }
    }, []);

    const startTime = getDateTimeFormat().format(new Date(trip.startTime));
    const endTime =
        trip.endTime !== null
            ? getDateTimeFormat().format(new Date(trip.endTime))
            : "Now";
    const distance = trip.endMileage ? trip.endMileage - trip.startMileage : -1;

    return (
        <div className="card" key={trip._id}>
            <div className="card-body">
                <h5 className="card-title">{startTime + " - " + endTime}</h5>
                <h6 className="card-subtitle text-body-secondary">
                    {employee.fullName}
                </h6>
            </div>

            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    {"Destination: " + trip.destination}
                </li>
                <li className="list-group-item">
                    {"Starting Mileage: " + trip.startMileage}
                </li>
                {trip.endMileage !== null && (
                    <li className="list-group-item">
                        {"Ending Mileage: " + trip.endMileage}
                    </li>
                )}
                {/* duplicate for style reasons */}
                {trip.endMileage !== null && (
                    <li className="list-group-item">
                        {"Distance: " + distance}
                    </li>
                )}
            </ul>
        </div>
    );
}
