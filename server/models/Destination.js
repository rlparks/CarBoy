const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    buildingNumber: {
        type: String,
        trim: true,
    },
    destinationName: String,
});

module.exports.model = Destination = mongoose.model(
    "destination",
    DestinationSchema
);
