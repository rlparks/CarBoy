const express = require("express");
const app = express();
const port = 8081;
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json({ extended: false }));

// TODO
const conn_str = "mongodb://root:example@172.19.174.2:27017/";

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
