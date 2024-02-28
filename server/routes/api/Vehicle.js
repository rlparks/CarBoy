const express = require("express");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Vehicle = require("../../models/Vehicle").model;
const upload = multer({ dest: "images/vehicles/" });

router.get("/", (req, res) => {
    Vehicle.find()
        .then((items) => {
            res.json(items);
        })
        .catch((err) => {
            res.status(404).json({ noitemsfound: "No vehicles found" });
        });
});
router.get("/:vehicleNumber", auth, (req, res) => {
    Vehicle.findOne({ vehicleNumber: req.params.vehicleNumber })
        .then((item) => res.json(item))
        .catch((err) =>
            res.status(404).json({
                noitemfound: "No vehicle found with that vehicle number",
            })
        );
});
router.post("/", auth, isAdmin, upload.single("image"), (req, res) => {
    // console.log(req);
    req.body.checkedOut = false;
    if (req.body.vehicleNumber) {
        let fileName;
        if (req.file) {
            fileName =
                req.body.vehicleNumber + path.extname(req.file.originalname);
            req.body.pictureUrl =
                process.env.CARBOY_PUBLIC_URL +
                "api/images/vehicles/" +
                fileName;
        }

        Vehicle.create(req.body)
            .then((item) => {
                if (req.file) {
                    console.log(req.file);
                    fs.renameSync(
                        req.file.path,
                        req.file.destination + fileName
                    );
                }
                return res.json({ msg: "Vehicle added successfully" });
            })
            .catch((err) => {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    error:
                        "Error adding vehicle. This is likely due to a duplicate vehicle number." +
                        err,
                });
                // console.log(err);
            });
    } else {
        return res.status(400).json({
            error: "Error adding vehicle. No request found.",
        });
    }
});
router.post("/import", auth, isAdmin, (req, res) => {
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
router.put("/:id", auth, isAdmin, (req, res) => {
    Vehicle.findByIdAndUpdate(req.params.id, req.body)
        .then((item) => res.json({ msg: "Updated successfully" }))
        .catch((err) =>
            res.status(400).json({
                error: "Error updating vehicle. This is likely due to a duplicate vehicle number.",
            })
        );
});
router.delete("/:vehicleNumber", auth, isAdmin, (req, res) => {
    Vehicle.findOneAndDelete({ vehicleNumber: req.params.vehicleNumber })
        .then((item) => {
            if (!item) {
                return res
                    .status(404)
                    .json({ error: "Error: No such vehicle." });
            }
            res.json({ msg: "Vehicle entry deleted successfully" });
        })
        .catch((err) =>
            res.status(404).json({ error: "Error: No such vehicle." })
        );
});

module.exports = router;
