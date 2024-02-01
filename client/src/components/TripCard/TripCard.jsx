import { useState } from "react";
import { getUser } from "../../assets/helpers";

export default function TripCard({ trip }) {
    const [employee, setEmployee] = useState({ fullName: "" });

    useState(() => {
        if (trip.employee != null) {
            getUser(trip.employee).then((user) => {
                // console.log(user);
                setEmployee(user);
            });
        }
    }, []);

    const startTime = new Date(trip.startTime).toString();
    console.log(employee);

    return (
        <div className="card" key={trip._id}>
            <div className="card-body">
                <h5 className="card-title">{trip.employee}</h5>
                <p className="card-text"></p>
            </div>
        </div>
    );
}
