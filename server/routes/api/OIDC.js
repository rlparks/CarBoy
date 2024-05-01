const express = require("express");
const bcryptjs = require("bcryptjs");
const oidcRouter = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const rateLimit = require("../../middleware/rateLimit");

oidcRouter.get("/info", (req, res) => {
    // TODO
    const oidcEnabled = process.env.OIDC_ENABLED;
    const defaultLoginWithSSO = process.env.DEFAULT_LOGIN_WITH_SSO;
    const oidcRedirectUrl =
        process.env.OIDC_AUTH_ENDPOINT + `&client_id=${process.env.OIDC_CLIENT_ID}`;

    const obj = {
        enabled: oidcEnabled,
        defaultSSO: defaultLoginWithSSO,
        loginRedirectUrl: oidcRedirectUrl,
    };

    res.json(obj);
});

oidcRouter.post("/login", rateLimit, async (req, res) => {
    const clientSecret = process.env.OIDC_CLIENT_SECRET;
    // TODO
    const redirectUri = process.env.CARBOY_PUBLIC_URL + "api/login/sso/callback";
    const authCode = req.headers["x-cb-code"];
    // console.log(req.headers);
    const body = new URLSearchParams({
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: clientSecret,
        code: authCode,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
    });
    // console.log(body);

    const tokenResponse = await fetch(process.env.OIDC_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    console.log(await tokenResponse.json());

    res.status(500).json({ error: "Not yet implemented" });
});

module.exports = oidcRouter;
