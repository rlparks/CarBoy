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
            <div className="d-flex justify-content-center mt-3 mb-2">
                <Link className="btn btn-primary" to="/adduser">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-plus"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                    Add User
                </Link>
            </div>
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
        </div>
    );
}
