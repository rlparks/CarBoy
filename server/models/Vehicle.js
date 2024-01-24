const mongoose = require("mongoose");
const TripSchema = require("./Trip").schema;

const VehicleSchema = new mongoose.Schema({
    vehicleNumber: Number,
    make: String,
    model: String,
    year: Number,
    lastOilChangeTime: Date,
    licensePlate: String,
    pictureUrl: String,
    trips: [TripSchema],
    checkedOut: Boolean,
    mileage: Number,
});

module.exports.model = Vehicle = mongoose.model("vehicle", VehicleSchema);
