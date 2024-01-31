const express = require("express");
const router = express.Router();

const Vehicle = require("../../models/Vehicle").model;

router.post("/:vehicleNumber", (req, res) => {
    console.log("CHECK IN: " + req.params.vehicleNumber);
    // console.log(req.body);
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((vehicle) => {
            const tripsArray = vehicle.trips;
            const now = new Date(Date.now());
            if (vehicle.currentUserId != "") {
                vehicle.currentUserId = null;
                vehicle.checkedOut = false;

                const currentTrip = tripsArray.pop();
                currentTrip.endTime = now;
                const endMileage = req.body.endMileage;
                if (endMileage) {
                    currentTrip.endMileage = endMileage;
                    vehicle.mileage = endMileage;
                }
                tripsArray.push(currentTrip);

                // console.log(tripsArray);
                vehicle.trips = tripsArray;

                vehicle
                    .save()
                    .then((item) =>
                        res.json({ msg: "Successfully checked in" })
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
