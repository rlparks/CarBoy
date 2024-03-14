import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../assets/helpers";
import ErrorPage from "../ErrorPage/ErrorPage";
import UserContext from "../../context/UserContext";

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
    const [image, setImage] = useState();
    const { userData } = useContext(UserContext);

    const params = useParams();
    useEffect(() => {
        let userId;
        if (mode === "admin") {
            userId = params.userId;
        } else if (mode === "self") {
            // editing own profile
            userId = userData.user.id;
        }

        getUser(userId, userData.token).then((user) => {
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
        });
    }, []);

    function usernameChangeHandler(event) {
        setUser((prevUser) => {
            return { ...prevUser, username: event.target.value };
        });
    }

    function newPasswordChangeHandler(event) {
        setNewPassword(event.target.value);
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
        <div className="d-flex justify-content-center">
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
                        <label className="form-label">Password</label>
                        <input
                            value={newPassword}
                            onChange={newPasswordChangeHandler}
                            type="password"
                            className="form-control"
                            placeholder="leave blank to not change"
                        />
                    </div>
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
                    {mode === "admin" && (
                        <div>
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
                    <button className="btn btn-primary mb-3">Submit</button>
                </form>
            </div>
        </div>
    ) : (
        <ErrorPage type={404} />
    );
}
