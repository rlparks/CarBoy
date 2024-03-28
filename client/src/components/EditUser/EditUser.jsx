import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";
import UserContext from "../../context/UserContext";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function EditUser({ mode }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        admin: false,
        // pictureUrl: "",
        disabled: false,
    });
    const [userExists, setUserExists] = useState(true);
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [image, setImage] = useState();
    const { userData, userCache, addUserToCache } = useContext(UserContext);

    const params = useParams();
    useEffect(() => {
        let userId;
        if (mode === "admin") {
            userId = params.userId;
        } else if (mode === "self") {
            // editing own profile
            userId = userData.user.id;
        }

        getUser(userId, userData.token, userCache, addUserToCache).then(
            (user) => {
                if (user) {
                    document.title = "CarBoy · Edit User · " + user.username;
                    if (!user.fullName) {
                        user.fullName = "";
                    }
                    // avoid uncontrolled state when user doesn't have this field
                    if (!user.hasOwnProperty("disabled")) {
                        user.disabled = false;
                    }
                    setUser(user);
                } else {
                    setUserExists(false);
                }
            }
        );
    }, []);

    function usernameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, username: event.target.value };
        });
    }

    function newPasswordChangeHandler(event) {
        setNewPassword(event.target.value);
    }

    function newConfirmPasswordChangeHandler(event) {
        setNewConfirmPassword(event.target.value);
    }

    function fullNameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, fullName: event.target.value };
        });
    }

    function adminChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, admin: event.target.checked };
        });
    }

    // function pictureUrlChangeHandler(event) {
    //     setUser((prevUser) => {
    //         return { ...prevUser, pictureUrl: event.target.value };
    //     });
    // }
    function imageChangeHandler(event) {
        setImage(event.target.files[0]);
    }

    function disabledChangeHandler(event) {
        setUser({ ...user, disabled: event.target.checked });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (!user.username || !user.fullName) {
            alert("Please fill out all fields.");
        } else {
            let userObj = user;
            if (newPassword) {
                userObj = {
                    ...userObj,
                    newPassword,
                };

                if (mode === "self") {
                    userObj = {
                        ...userObj,
                        newConfirmPassword,
                    };
                }
            }

            let url = SERVER_URL + "api/users/";
            if (mode === "admin") {
                url += user._id;
            }
            try {
                if (image) {
                    user.image = image;
                }
                await axios.put(url, userObj, {
                    headers: {
                        "x-auth-token": userData.token,
                        "Content-Type": "multipart/form-data",
                    },
                });

                addUserToCache(user._id, null);

                if (mode === "self") {
                    navigate("/success");
                } else {
                    navigate("/success/manageusers");
                }
            } catch (err) {
                setError(err.response.data.error);
            }
        }
    }

    return userExists ? (
        <div className="d-flex justify-content-center mb-3">
            <div className="w-50">
                <h2 className="text-center mb-3">{"Edit: " + user.username}</h2>
                {error && <p className="text-center text-danger">{error}</p>}
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            autoFocus={mode === "admin"}
                            disabled={mode !== "admin"}
                            value={user.username}
                            onChange={usernameChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="abc12345"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            disabled={mode !== "admin"}
                            value={user.fullName}
                            onChange={fullNameChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="Example User"
                        />
                    </div>
                    <div className="mb-3">
                        <label id="passwordLabel" className="form-label">
                            Password
                        </label>
                        {/* <input
                            value={newPassword}
                            onChange={newPasswordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder="leave blank to not change"
                        /> */}
                        <PasswordInput
                            value={newPassword}
                            onChange={newPasswordChangeHandler}
                            autoComplete="new-password"
                            id="new-password"
                            ariadescribedby="passwordLabel"
                        />
                    </div>
                    {mode === "self" && (
                        <div className="mb-3">
                            <label
                                id="confirmPasswordLabel"
                                className="form-label"
                            >
                                Confirm Password
                            </label>
                            {/* <input
                            value={newPassword}
                            onChange={newPasswordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder="leave blank to not change"
                        /> */}
                            <PasswordInput
                                value={newConfirmPassword}
                                onChange={newConfirmPasswordChangeHandler}
                                autoComplete="new-password"
                                id="new-password"
                                ariadescribedby="confirmPasswordLabel"
                            />
                        </div>
                    )}
                    {/* <div className="mb-3">
                    
                        <label className="form-label">Picture URL</label>
                        <input
                            value={user.pictureUrl}
                            onChange={pictureUrlChangeHandler}
                            type="text"
                            className="form-control"
                            placeholder="https://www.example.com/image.png"
                        />
                    </div> */}

                    {mode === "admin" && (
                        <div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <input
                                    disabled={mode !== "admin"}
                                    type="file"
                                    accept=".jpeg, .jpg, .png"
                                    className="form-control"
                                    onChange={imageChangeHandler}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        checked={user.admin}
                                        onChange={adminChangeHandler}
                                        type="checkbox"
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label">
                                        Admin
                                    </label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        checked={user.disabled}
                                        onChange={disabledChangeHandler}
                                        type="checkbox"
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label">
                                        Disabled
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary">Submit</button>
                        {mode === "admin" && (
                            <div className="btn-group">
                                <Link
                                    className="btn btn-outline-danger"
                                    to={"/manageusers/delete/" + user._id}
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
                                    Delete User
                                </Link>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
