const express = require("express");
const app = express();
const port = 8081;
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json({ extended: false }));
mongoose.set("sanitizeFilter", true); // protects against bobby

// TODO
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoUrl = process.env.MONGO_URL;
const conn_str = "mongodb://" + mongoUser + ":" + mongoPass + "@" + mongoUrl;
// const conn_str = "mongodb://root:example@172.19.174.2:27016/";

mongoose
    .connect(conn_str, { dbName: "carlog" })
    .then(() => {
        console.log("MongoDB Connection Succeeded");

        app.listen(port, () => console.log(`Server running on port ${port}`));

        // for checking if server alive
        app.get("/api", (req, res) =>
            res.status(200).json({ message: "Server is running!" })
        );

        // image server
        app.use("/api/images", express.static("images"));

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

        const destinations = require("./routes/api/Destination");
        app.use("/api/destinations", destinations);
    })
    .catch((err) => {
        console.log(`Error in DB Connection ${err}`);
        return process.exit(1);
    });
