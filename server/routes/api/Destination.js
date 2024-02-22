const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();

const Destination = require("../../models/Destination").model;

router.get("/", auth, (req, res) => {
    Destination.find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ error: "No destinations found" });
        });
});
router.get("/:id", auth, (req, res) => {
    Destination.findById(req.params.id)
        .then((item) => res.json(item))
        .catch((err) =>
            res.status(404).json({
                error: "No destination found with that ID",
            })
        );
});
router.post("/", auth, (req, res) => {
    Destination.create(req.body)
        .then((item) => res.json({ msg: "Destination added successfully" }))
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                error: "Error adding destination. This is likely due to a duplicate building number.",
            });
        });
});
router.post("/import", auth, (req, res) => {
    Destination.insertMany(req.body)
        .then((result) => {
            res.json({ msg: "Destinations successfully imported" });
        })
        .catch((err) => {
            res.status(400).json({
                error: "Error inserting destinations. This is likely due to a duplicate building ID in the imported data.",
            });
        });
});
router.put("/:id", auth, (req, res) => {
    Destination.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({
                error: "Error updating destination. This is likely due to a duplicate building number.",
            })
        );
});
router.delete("/:id", auth, (req, res) => {
    Destination.findByIdAndDelete(req.params.id)
        .then((item) => {
            if (!item) {
                return res
                    .status(404)
                    .json({ error: "Error: No such destination." });
            }
            res.json({ msg: "Destination entry deleted successfully" });
        })
        .catch((err) =>
            res.status(404).json({ error: "Error: No such destination." })
        );
});

module.exports = router;
