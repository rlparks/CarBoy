const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 1000, // 60 second window
    max: 10, // requests per window
    message: { error: "Try again later" },
});

module.exports = limiter;
