import { useContext, useState } from "react";
import { getDateTimeFormat, getUser } from "../../assets/helpers";
import UserContext from "../../context/UserContext";

export default function TripCard({ trip }) {
    // const [employee, setEmployee] = useState({
    //     fullName: "Error retrieving user",
    // });
    const { userData } = useContext(UserContext);

    // useState(() => {
    //     if (trip.employee != null) {
    //         getUser(trip.employee, userData.token)
    //             .then((user) => {
    //                 // console.log(user);
    //                 if (user !== null) {
    //                     setEmployee(user);
    //                 }
    //             })
    //             .catch((err) =>
    //                 setEmployee({ fullName: "Error retrieving user" })
    //             );
    //     }
    // }, [userData]);

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
                        {trip.employee[0].fullName}
                    </h6>
                    {trip.employee[1] &&
                        trip.employee[0]._id !== trip.employee[1]._id && (
                            <>
                                <br />
                                <h6 className="card-subtitle text-warning">
                                    Checked in by: {trip.employee[1].fullName}
                                </h6>
                            </>
                        )}
                </div>
                {trip.employee[0].pictureUrl && (
                    <img
                        className="img-fluid rounded-circle"
                        src={trip.employee[0].pictureUrl}
                        alt={"Image of " + trip.employee[0].username}
                        style={{ height: "75px" }}
                    />
                )}
            </div>

            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    {"Destination: " + trip.destination}
                </li>
                {trip.startMileage !== null && (
                    <li className="list-group-item">
                        {"Starting Mileage: " + trip.startMileage}
                    </li>
                )}
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
