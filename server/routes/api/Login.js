const express = require("express");
const bcryptjs = require("bcryptjs");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

async function createDefaultAdmin() {
    try {
        const username = process.env.DEFAULT_ADMIN_USERNAME;
        const password = process.env.DEFAULT_ADMIN_PASSWORD;
        const fullName = process.env.DEFAULT_ADMIN_FULLNAME;

        const existingUserWithUsername = await User.findOne({ username });
        if (existingUserWithUsername) {
            console.log("Default admin already exists, skipping");
            return;
        }

        const passwordHash = await bcryptjs.hash(password, 8);
        const newUser = new User({
            username,
            password: passwordHash,
            admin: true,
            fullName,
        });

        await newUser.save();
    } catch (err) {
        console.log(err);
    }
}

createDefaultAdmin();

userRouter.post("/signup", async (req, res) => {
    try {
        const { username, password, confirmPassword, admin, fullName } =
            req.body;
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ msg: "Please fill out all fields" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ msg: "Password should be at least 6 characters" });
        }
        if (confirmPassword !== password) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }
        const existingUserWithUsername = await User.findOne({ username });
        if (existingUserWithUsername) {
            return res
                .status(400)
                .json({ msg: "User with username already exists" });
        }

        const passwordHash = await bcryptjs.hash(password, 8);
        const newUser = new User({
            username,
            password: passwordHash,
            admin,
            fullName,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("LOGIN ATTEMPT: " + username);
        if (!username || !password) {
            return res.status(400).json({ msg: "Please fill out all fields" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "User with username does not exist" });
        }

        const passwordsMatch = await bcryptjs.compare(password, user.password);
        if (!passwordsMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // TODO
        const token = jwt.sign({ id: user._id }, "passwordKey");
        console.log("LOGIN SUCCESS: " + username);
        res.json({
            token,
            user: { id: user._id, username: user.username, admin: user.admin },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        // TODO
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
        admin: user.admin,
    });
});

module.exports = userRouter;
