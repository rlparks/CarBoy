const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    buildingNumber: {
        type: Number,
        unique: true,
        trim: true,
    },
    buildingName: String,
});

module.exports.model = Vehicle = mongoose.model("vehicle", VehicleSchema);
