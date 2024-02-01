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
    // console.log(employee);

    return (
        <div className="card" key={trip._id}>
            <div className="card-body">
                <h5 className="card-title">{employee.fullName}</h5>
                <p className="card-text"></p>
            </div>
        </div>
    );
}
