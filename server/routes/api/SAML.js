const express = require("express");
const bcryptjs = require("bcryptjs");
const samlRouter = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const passport = require("passport");
const saml = require("passport-saml");

fs.readFile("./redacted-metadata.xml", (err, metadata) => {
    if (err) {
        console.error(err);
        return;
    }

    fs.readFile("./certscert.pem", "utf-8", (err, cert) => {
        if (err) {
            console.error(err);
            return;
        }

        // help

        passport.use(strategy);
    });
});

samlRouter.get("/info", (req, res) => {
    // TODO
    const samlEnabled = process.env.SAML_ENABLED || true;
    const obj = { enabled: samlEnabled };

    res.json(obj);
});

module.exports = samlRouter;
