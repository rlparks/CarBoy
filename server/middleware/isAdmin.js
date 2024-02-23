const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    try {
        const reqUser = await User.findById(req.user);
        if (!reqUser.admin) {
            return res
                .status(403)
                .json({
                    error: "Only admin accounts may perform this action.",
                });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = isAdmin;
