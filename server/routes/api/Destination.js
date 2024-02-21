const express = require("express");
const router = express.Router();

const Destination = require("../../models/Destination").model;

router.get("/", (req, res) => {
    Destination.find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ error: "No destinations found" });
        });
});
router.get("/:id", (req, res) => {
    Destination.findById(req.params.id)
        .then((item) => res.json(item))
        .catch((err) =>
            res.status(404).json({
                error: "No destination found with that ID",
            })
        );
});
router.post("/", (req, res) => {
    if (!req.body.buildingNumber) {
        // prevents duplicate building number ""
        req.body.buildingNumber = null;
    }
    Destination.create(req.body)
        .then((item) => res.json({ msg: "Destination added successfully" }))
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                error: "Error adding destination. This is likely due to a duplicate building number.",
            });
        });
});
router.post("/import", (req, res) => {
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
router.put("/:id", (req, res) => {
    Destination.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({
                error: "Error updating destination. This is likely due to a duplicate building number.",
            })
        );
});
router.delete("/:id", (req, res) => {
    Destination.findByIdAndDelete(req.params.id)
        .then((item) =>
            res.json({ msg: "Destination entry deleted successfully" })
        )
        .catch((err) => res.status(404).json({ error: "No such destination" }));
});

module.exports = router;
