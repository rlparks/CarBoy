const mongoose = require("mongoose");
const TripSchema = require("./Trip").schema;

const VehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: Number,
        unique: true,
        trim: true,
    },
    make: String,
    model: String,
    year: Number,
    // lastOilChangeTime: Date,
    licensePlate: String,
    pictureUrl: String,
    trips: [TripSchema],
    checkedOut: Boolean,
    mileage: Number,
    currentUserId: String,
    disabled: Boolean,
});

module.exports.model = Vehicle = mongoose.model("vehicle", VehicleSchema);
