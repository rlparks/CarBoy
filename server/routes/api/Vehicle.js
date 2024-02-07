const express = require("express");
const router = express.Router();

const Vehicle = require("../../models/Vehicle").model;

router.get("/", (req, res) => {
    Vehicle.find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ noitemsfound: "No vehicles found" });
        });
});
router.get("/:vehicleNumber", (req, res) => {
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((item) => res.json(item))
        .catch((err) =>
            res
                .status(404)
                .json({ noitemfound: "No vehicle found with that ID" })
        );
});
router.post("/", (req, res) => {
    req.body.checkedOut = false;
    Vehicle.create(req.body)
        .then((item) => res.json({ msg: "Vehicle added successfully" }))
        .catch((err) => {
            res.status(400).json({ error: "Unable to add this vehicle" });
            console.log(err);
        });
});
router.post("/import", (req, res) => {
    Vehicle.insertMany(req.body)
        .then((result) => {
            res.json({ msg: "Vehicles successfully imported" });
        })
        .catch((err) => {
            res.status(400).json({
                error: "Error inserting vehicles. This is likely due to a duplicate vehicle ID in the imported data.",
            });
        });
});
router.put("/:id", (req, res) => {
    Vehicle.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({ error: "Unable to update the database" })
        );
});
router.delete("/:id", (req, res) => {
    Vehicle.findByIdAndDelete(req.params.id, req.body)
        .then((item) => res.json({ msg: "Vehicle entry deleted successfully" }))
        .catch((err) => res.status(404).json({ error: "No such vehicle" }));
});

module.exports = router;
