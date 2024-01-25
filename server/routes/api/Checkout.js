const express = require("express");
const router = express.Router();

const Vehicle = require("../../models/Vehicle").model;

router.post("/:vehicleNumber", (req, res) => {
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((vehicle) => {
            const tripsArray = vehicle.trips;
            const now = new Date(Date.now());
            if (vehicle.currentUserId == "") {
                vehicle.currentUserId = req.body.userId;
                vehicle.checkedOut = true;
            }
            const newTrip = {
                startTime: now,
                endTime: null,
                startMileage: vehicle.mileage,
                endMileage: null,
                destination: req.body.destination,
                employee: req.body.userId,
            };
            tripsArray.push(newTrip);

            console.log(tripsArray);

            vehicle.save().catch((err) => console.log(err));
        })
        .catch((err) =>
            res.status(404).json({ err: "No vehicle found with that number" })
        );
});

module.exports = router;
