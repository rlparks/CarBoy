const express = require("express");
const app = express();
const port = 8081;
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json({ extended: false }));
mongoose.set("sanitizeFilter", true); // protects against bobby

// TODO
const mongoUser = "root";
const mongoPass = "example";
const mongoUrl = "172.19.174.2:27017/";
const conn_str = "mongodb://" + mongoUser + ":" + mongoPass + "@" + mongoUrl;

mongoose
    .connect(conn_str, { dbName: "carlog" })
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
        console.log("MongoDB Connection Succeeded");
    })
    .catch((err) => {
        console.log(`Error in DB Connection ${err}`);
    });

const vehicles = require("./routes/api/Vehicle");
app.use("/api/vehicles", vehicles);

const logins = require("./routes/api/Login");
app.use("/api/login", logins);

const users = require("./routes/api/User");
app.use("/api/users", users);

const checkout = require("./routes/api/Checkout");
app.use("/api/checkout", checkout);

const checkin = require("./routes/api/Checkin");
app.use("/api/checkin", checkin);
