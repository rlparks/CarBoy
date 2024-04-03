const express = require("express");
const bcryptjs = require("bcryptjs");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const isAdmin = require("../../middleware/isAdmin");
const rateLimit = require("../../middleware/rateLimit");

if (process.env.CREATE_DEFAULT_ADMIN) {
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
}

userRouter.post("/", rateLimit, async (req, res) => {
    try {
        // const xff = req.headers["x-forwarded-for"];
        // console.log(xff);
        const reqIP = req.ip;
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Please fill out all fields" });
        }
        const user = await User.findOne({ username });
        // return same error message as to not give any info
        if (!user) {
            console.log(
                "LOGIN FAILURE - " + reqIP + " - (NO USER): " + username
            );
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const passwordsMatch = await bcryptjs.compare(password, user.password);
        if (!passwordsMatch) {
            console.log(
                "LOGIN FAILURE - " +
                    reqIP +
                    " - (INVALID PASSWORD): " +
                    username
            );
            return res.status(400).json({ error: "Invalid credentials" });
        }

        if (user.disabled) {
            console.log(
                "LOGIN FAILURE - " +
                    reqIP +
                    " - (ACCOUNT DISABLED): " +
                    username
            );
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
        console.log("LOGIN SUCCESS - " + reqIP + ": " + username);
        res.json({
            token,
            user: { id: user._id, username: user.username },
        });
    } catch (err) {
        console.log("LOGIN ERROR: " + err);
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
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
    });
});

module.exports = userRouter;
