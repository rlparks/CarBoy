const express = require("express");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const resizeImage = require("../../middleware/resizeImage");

const Vehicle = require("../../models/Vehicle").model;

const imageLocation = "images/vehicles/";
const upload = multer({ dest: imageLocation });

function noCB() {}

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
router.post(
    "/",
    auth,
    isAdmin,
    upload.single("image"),
    resizeImage,
    (req, res) => {
        // console.log(req);
        req.body.checkedOut = false;
        if (req.body.vehicleNumber) {
            let fileName;
            if (req.file) {
                fileName =
                    req.body.vehicleNumber +
                    path.extname(req.file.originalname);
                req.body.pictureUrl =
                    process.env.CARBOY_PUBLIC_URL +
                    "api/images/vehicles/" +
                    fileName;
            }

            Vehicle.create(req.body)
                .then((item) => {
                    if (req.file) {
                        // console.log(req.file);
                        fs.rename(req.file.path, imageLocation + fileName, () =>
                            res.json({ msg: "Vehicle added successfully" })
                        );
                    } else {
                        return res.json({ msg: "Vehicle added successfully" });
                    }
                })
                .catch(async (err) => {
                    if (req.file) {
                        await fs.unlink(req.file.path, noCB);
                    }
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
    }
);
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
router.put(
    "/:id",
    auth,
    isAdmin,
    upload.single("image"),
    resizeImage,
    async (req, res) => {
        try {
            let oldVehicle = await Vehicle.findById(req.params.id);
            // console.log(oldVehicle);

            const vehicleNumberChangedAndTheVehicleHadAnExistingImage =
                req.body.vehicleNumber !== oldVehicle.vehicleNumber &&
                oldVehicle.pictureUrl;

            const prevName = oldVehicle.pictureUrl
                ? path.basename(oldVehicle.pictureUrl)
                : null;

            const newFileName = oldVehicle.pictureUrl
                ? req.body.vehicleNumber + path.extname(prevName)
                : null;
            // rename current image
            if (vehicleNumberChangedAndTheVehicleHadAnExistingImage) {
                await fs.rename(
                    imageLocation + prevName,
                    imageLocation + newFileName,
                    noCB
                );

                req.body.pictureUrl =
                    process.env.CARBOY_PUBLIC_URL +
                    "api/images/vehicles/" +
                    newFileName;
            }

            if (req.file) {
                const newNewFileName =
                    req.body.vehicleNumber +
                    path.extname(req.file.originalname);

                const newFileNameIsDifferentFromOldFileName =
                    newFileName !== newNewFileName;
                // vehicle already had image
                if (
                    oldVehicle.pictureUrl &&
                    newFileNameIsDifferentFromOldFileName
                ) {
                    // delete
                    console.log("Deleting: " + imageLocation + newFileName);
                    await fs.unlink(imageLocation + newFileName, noCB);
                }

                // finalize new image

                console.log(
                    "Renaming: " +
                        req.file.path +
                        " to " +
                        imageLocation +
                        newNewFileName
                );

                await fs.rename(
                    req.file.path,
                    imageLocation + newNewFileName,
                    noCB
                );
                req.body.pictureUrl =
                    process.env.CARBOY_PUBLIC_URL +
                    "api/images/vehicles/" +
                    newNewFileName;
            }

            await oldVehicle.updateOne(req.body);
            return res.status(200).json({ msg: "Updated successfully" });
        } catch (err) {
            if (req.file) {
                await fs.unlink(req.file.path, noCB);
            }
            console.log(err);
            return res.status(400).json({
                error: "Error updating vehicle. This is likely due to a duplicate vehicle number.",
            });
        }
    }
);
router.delete("/:vehicleNumber", auth, isAdmin, (req, res) => {
    Vehicle.findOneAndDelete({ vehicleNumber: req.params.vehicleNumber })
        .then(async (item) => {
            if (!item) {
                return res
                    .status(404)
                    .json({ error: "Error: No such vehicle." });
            }

            if (item.pictureUrl) {
                const fileName = path.basename(item.pictureUrl);
                await fs.unlink(imageLocation + fileName, noCB);
            }

            return res.json({ msg: "Vehicle entry deleted successfully" });
        })
        .catch((err) =>
            res.status(404).json({ error: "Error: No such vehicle." + err })
        );
});

module.exports = router;
