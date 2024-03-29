const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({ error: "No token, access denied" });

        const verified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        if (!verified)
            return res
                .status(401)
                .json({ error: "Token verification failed, access denied" });

        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;
