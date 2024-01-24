const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    startMileage: Number,
    endMileage: Number,
    destination: String,
    employee: String,
});

module.exports.model = Trip = mongoose.model("trip", TripSchema);
module.exports.schema = TripSchema;
