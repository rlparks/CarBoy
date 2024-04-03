const rateLimit = require("express-rate-limit");

// each IP is allowed to send 5 requests per minute
const limiter = rateLimit({
    windowMs: 60 * 1000, // 60 second window
    max: 5, // requests per window
    message: { error: "Too many requests, try again later" },
});

module.exports = limiter;
