import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../UserCard/UserCard";
import { Link } from "react-router-dom";
import { sortUsers } from "../../assets/helpers";

export default function UsersPage() {
    const numColumns = 4;

    const [users, setUsers] = useState([]);

    const refreshUsers = async () => {
        axios
            .get(SERVER_URL + "api/users/")
            .then((result) => setUsers(result.data.sort(sortUsers)))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <h2 className="text-center mb-3">Users</h2>
                    <div
                        className={
                            "row row-cols-lg-" + numColumns + " g-4 card-deck"
                        }
                    >
                        {users.map((user) => (
                            <div className="col" key={user._id}>
                                <UserCard user={user} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <Link className="btn btn-primary" to="/adduser">
                    Add User
                </Link>
            </div>
        </div>
    );
}
