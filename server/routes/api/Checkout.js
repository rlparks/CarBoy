const express = require("express");
const router = express.Router();

const Vehicle = require("../../models/Vehicle").model;

router.post("/:vehicleNumber", (req, res) => {
    console.log("CHECK OUT: " + req.params.vehicleNumber);
    // console.log(req.body);
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((vehicle) => {
            const tripsArray = vehicle.trips;
            const now = new Date(Date.now());
            if (vehicle.currentUserId == null) {
                vehicle.currentUserId = req.body.userId;
                vehicle.checkedOut = true;

                const newTrip = {
                    startTime: now,
                    endTime: null,
                    startMileage: vehicle.mileage,
                    endMileage: null,
                    destination: req.body.destination,
                    employee: req.body.userId,
                };
                tripsArray.push(newTrip);

                // console.log(tripsArray);
                vehicle.trips = tripsArray;

                vehicle
                    .save()
                    .then((item) =>
                        res.json({ msg: "Successfully checked out" })
                    )
                    .catch((err) => console.log(err));
            }
        })
        .catch((err) => {
            res.status(404).json({ err: "No vehicle found with that number" });
            console.log(err);
        });
});

module.exports = router;
