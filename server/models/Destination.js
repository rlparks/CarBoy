const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    buildingNumber: {
        type: String,
        unique: true,
        trim: true,
    },
    destinationName: String,
});

module.exports.model = Destination = mongoose.model(
    "destination",
    DestinationSchema
);