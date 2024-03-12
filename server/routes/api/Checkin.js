const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();

const Vehicle = require("../../models/Vehicle").model;

router.post("/:vehicleNumber", auth, (req, res) => {
    console.log("CHECK IN: " + req.params.vehicleNumber);
    // console.log(req.body);
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((vehicle) => {
            if (!vehicle.checkedOut) {
                // checkin POST sent to already checked in vehicle
                res.status(400).json({
                    error: "Error: Vehicle already checked in.",
                });
                return;
            }
            const tripsArray = vehicle.trips;
            const now = new Date(Date.now());
            if (vehicle.currentUserId != "") {
                vehicle.currentUserId = null;
                vehicle.checkedOut = false;

                const currentTrip = tripsArray.pop();
                currentTrip.endTime = now;
                const endMileage = req.body.endMileage;
                if (endMileage) {
                    if (endMileage < currentTrip.startMileage) {
                        res.status(400).json({
                            error: "Error: Ending Mileage less than Starting Mileage",
                        });
                        return;
                    }
                    currentTrip.endMileage = endMileage;
                    // track who checked in vehicle
                    currentTrip.employee[1] = req.user;
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
