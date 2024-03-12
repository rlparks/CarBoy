const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    startMileage: Number,
    endMileage: Number,
    destination: String,
    employee: [String],
    vehicleNumber: {
        type: Number,
        trim: true,
        required: true,
    },
});

// module.exports.model = Trip = mongoose.model("trip", TripSchema);
module.exports.schema = TripSchema;
