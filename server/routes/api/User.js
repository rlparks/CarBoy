const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const User = require("../../models/User");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const resizeImage = require("../../middleware/resizeImage");

const imageLocation = "images/users/";
const upload = multer({ dest: imageLocation });

function noCB() {}

router.get("/", auth, (req, res) => {
    User.find()
        .select({ password: 0 })
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ noitemsfound: "No users found" });
        });
});
router.get("/:id", auth, (req, res) => {
    User.findById(req.params.id)
        .select({ password: 0 })
        .then((item) => {
            res.json(item);
        })
        .catch((err) =>
            res
                .status(404)
                .json({ noitemfound: "No user found with that ID: " + err })
        );
});

router.post(
    "/",
    auth,
    isAdmin,
    upload.single("image"),
    resizeImage,
    async (req, res) => {
        try {
            const { username, password, confirmPassword, admin, fullName } =
                req.body;
            if (!username || !password || !confirmPassword) {
                return res
                    .status(400)
                    .json({ msg: "Please fill out all fields" });
            }
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ msg: "Password should be at least 6 characters" });
            }
            if (confirmPassword !== password) {
                return res.status(400).json({ msg: "Passwords do not match" });
            }
            const existingUserWithUsername = await User.findOne({ username });
            if (existingUserWithUsername) {
                return res
                    .status(400)
                    .json({ msg: "User with username already exists" });
            }

            const passwordHash = await bcryptjs.hash(password, 8);

            const newUser = new User({
                username,
                password: passwordHash,
                admin,
                fullName,
            });
            // console.log(newUser);
            if (req.file) {
                fileName = newUser._id + path.extname(req.file.originalname);
                await fs.rename(req.file.path, imageLocation + fileName, noCB);

                newUser.pictureUrl =
                    process.env.CARBOY_PUBLIC_URL +
                    "api/images/users/" +
                    fileName;
            }

            const savedUser = await newUser.save();
            res.json(savedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// weird method? not sure which to use
// editing own profile
router.put("/", auth, upload.single("image"), resizeImage, async (req, res) => {
    const userId = req.user;
    if (userId !== req.body._id) {
        return res.status(401).json({ err: "Error: Not Authorized." });
    }

    try {
        let userObj = await User.findById(userId);

        if (req.body.newPassword) {
            const passwordHash = await bcryptjs.hash(req.body.newPassword, 8);
            userObj.password = passwordHash;
        }

        // specify which fields users can update
        // userObj.pictureUrl = req.body.pictureUrl;

        User.findByIdAndUpdate(userId, userObj)
            .then((item) => res.json({ msg: "Updated successfully" }))
            .catch((err) =>
                res.status(400).json({ error: "Unable to update the database" })
            );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put(
    "/:id",
    auth,
    isAdmin,
    upload.single("image"),
    resizeImage,
    async (req, res) => {
        if (req.body.newPassword && req.body.newPassword !== "") {
            // password change
            const passwordHash = await bcryptjs.hash(req.body.newPassword, 8);
            req.body.password = passwordHash;
        }

        // console.log(req.body);
        if (!req.body.admin) {
            // edit user submitted with admin == false
            // potential of un-admining the last one
            // can't have that!

            const admins = await User.find({ admin: true });
            if (
                admins.length === 1 &&
                admins[0]._id.toString() === req.body._id &&
                !req.body.admin
            ) {
                // trying to revoke last admin
                res.status(400).json({
                    error: "Error: Cannot revoke admin status of final admin",
                });
                return;
            }
        }

        try {
            const oldUser = await User.findById(req.params.id);
            if (req.file) {
                const fileName =
                    oldUser._id + path.extname(req.file.originalname);
                const oldFileName = oldUser.pictureUrl
                    ? path.basename(oldUser.pictureUrl)
                    : null;
                if (oldUser.pictureUrl && fileName !== oldFileName) {
                    // delete
                    await fs.unlink(imageLocation + oldFileName, noCB);
                }

                // finalize new image
                await fs.rename(req.file.path, imageLocation + fileName, noCB);
                req.body.pictureUrl =
                    process.env.CARBOY_PUBLIC_URL +
                    "api/images/users/" +
                    fileName;
            }

            await oldUser.updateOne(req.body);
            return res.json({ msg: "Updated successfully" });
        } catch (err) {
            console.log(err);
            return res
                .status(400)
                .json({ error: "Unable to update the database" });
        }
    }
);
router.delete("/:id", auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.admin) {
            // deleting an admin

            const admins = await User.find({ admin: true });
            if (
                admins.length === 1 &&
                admins[0]._id.toString() === user._id.toString()
            ) {
                // trying to delete last admin
                res.status(400).json({
                    error: "Error: Cannot delete final admin.",
                });
                return;
            }
        }

        if (user.pictureUrl) {
            const fileName = path.basename(user.pictureUrl);
            await fs.unlink(imageLocation + fileName, noCB);
        }
    } catch (err) {
        res.status(404).json({ error: "Error: No such user." });
        return;
    }

    User.findByIdAndDelete(req.params.id, req.body)
        .then((item) => res.json({ msg: "User entry deleted successfully." }))
        .catch((err) =>
            res.status(404).json({ error: "Error: No such user." })
        );
});

module.exports = router;
