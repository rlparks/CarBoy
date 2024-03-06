const mongoose = require("mongoose");
const TripSchema = require("./Trip").schema;

const VehicleSchema = new mongoose.Schema({
    vehicleNumber: {
        type: Number,
        unique: true,
        trim: true,
        required: true,
    },
    make: {
        type: String,
        trim: true,
    },
    model: {
        type: String,
        trim: true,
    },
    year: Number,
    // lastOilChangeTime: Date,
    licensePlate: {
        type: String,
        trim: true,
    },
    pictureUrl: String,
    trips: [TripSchema],
    checkedOut: Boolean,
    mileage: Number,
    currentUserId: String,
    disabled: Boolean,
    department: {
        type: String,
        trim: true,
    },
});

module.exports.model = Vehicle = mongoose.model("vehicle", VehicleSchema);
