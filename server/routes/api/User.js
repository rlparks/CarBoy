const express = require("express");
const router = express.Router();

const User = require("../../models/User");

router.get("/", (req, res) => {
    User.find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ noitemsfound: "No users found" });
        });
});
router.get("/:id", (req, res) => {
    User.findById(req.params.id)
        .then((item) => res.json(item))
        .catch((err) =>
            res
                .status(404)
                .json({ noitemfound: "No user found with that ID: " + err })
        );
});
router.post("/", (req, res) => {
    req.body.checkedOut = false;
    User.create(req.body)
        .then((item) => res.json({ msg: "User added successfully" }))
        .catch((err) => {
            res.status(400).json({ error: "Unable to add this user" });
            console.log(err);
        });
});
router.put("/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({ error: "Unable to update the database" })
        );
});
router.delete("/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, req.body)
        .then((item) => res.json({ msg: "User entry deleted successfully" }))
        .catch((err) => res.status(404).json({ error: "No such user" }));
});

module.exports = router;
