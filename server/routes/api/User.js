const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

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
// router.post("/", async (req, res) => {
//     const passwordHash = await bcryptjs.hash(req.body.newPassword, 8);
//     if (req.body.newPassword !== "") {
//         req.body.password = passwordHash;
//     } else {
//         res.status(400).json({ error: "No password provided" });
//         return;
//     }
//     User.create(req.body)
//         .then((item) => res.json({ msg: "User added successfully" }))
//         .catch((err) => {
//             res.status(400).json({ error: "Unable to add this user" });
//             console.log(err);
//         });
// });
router.put("/:id", auth, async (req, res) => {
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

    await User.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({ error: "Unable to update the database" })
        );
});
router.delete("/:id", auth, async (req, res) => {
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
