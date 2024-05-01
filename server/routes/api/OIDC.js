const express = require("express");
const bcryptjs = require("bcryptjs");
const oidcRouter = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");

oidcRouter.get("/info", (req, res) => {
    // TODO
    const oidcEnabled = process.env.OIDC_ENABLED || true;
    const defaultLoginWithSSO = process.env.DEFAULT_LOGIN_WITH_SSO || true;
    const oidcRedirectUrl = process.env.OIDC_LOGIN_REDIRECT_URL || "http://google.com";

    const obj = {
        enabled: oidcEnabled,
        defaultSSO: defaultLoginWithSSO,
        loginRedirectUrl: oidcRedirectUrl,
    };

    res.json(obj);
});

module.exports = oidcRouter;
