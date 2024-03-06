import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../UserCard/UserCard";
import { Link } from "react-router-dom";
import { sortUsers } from "../../assets/helpers";
import UserContext from "../../context/UserContext";

export default function UsersPage() {
    const numColumns = 4;
    const { userData } = useContext(UserContext);

    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [disabledUsers, setDisabledUsers] = useState([]);

    const refreshUsers = async () => {
        axios
            .get(SERVER_URL + "api/users/", {
                headers: { "x-auth-token": userData.token },
            })
            .then((result) => setUsers(result.data.sort(sortUsers)))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        refreshUsers();
        document.title = "CarBoy · Manage Users";
    }, []);

    useEffect(() => {
        setActiveUsers(users.filter((user) => !user.disabled));
        setDisabledUsers(users.filter((user) => user.disabled));
    }, [users]);

    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <div className="w-75">
                    <div>
                        <h2 className="text-center mb-3">Users</h2>
                        <div
                            className={
                                "row row-cols-1 row-cols-lg-" +
                                numColumns +
                                " g-4 card-deck"
                            }
                        >
                            {activeUsers.map((user) => (
                                <div className="col" key={user._id}>
                                    <UserCard user={user} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {disabledUsers.length > 0 && (
                        <div>
                            <h2 className="text-center m-3">
                                Disabled Accounts
                            </h2>
                            <div
                                className={
                                    "row row-cols-1 row-cols-lg-" +
                                    numColumns +
                                    " g-4 card-deck"
                                }
                            >
                                {disabledUsers.map((user) => (
                                    <div className="col" key={user._id}>
                                        <UserCard user={user} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-center mb-3">
                <Link className="btn btn-primary" to="/adduser">
                    Add User
                </Link>
            </div>
        </div>
    );
}
