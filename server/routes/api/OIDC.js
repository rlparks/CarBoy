const express = require("express");
const oidcRouter = express.Router();
const jwt = require("jsonwebtoken");
const rateLimit = require("../../middleware/rateLimit");
const User = require("../../models/User");

const redirectUri = process.env.CARBOY_PUBLIC_URL + "login/sso/callback";

let OIDC_AUTH_ENDPOINT = undefined;
let OIDC_TOKEN_ENDPOINT = undefined;
let OIDC_USERINFO_ENDPOINT = undefined;
let OIDC_LOGOUT_ENDPOINT = undefined;
if (process.env.OIDC_ENABLED) {
    // hopefully no requests come in before the server can fetch this :)
    fetch(process.env.OIDC_DISCOVERY_ENDPOINT).then((response) => {
        response.json().then((data) => {
            OIDC_AUTH_ENDPOINT = data.authorization_endpoint;
            OIDC_TOKEN_ENDPOINT = data.token_endpoint;
            OIDC_USERINFO_ENDPOINT = data.userinfo_endpoint;
            OIDC_LOGOUT_ENDPOINT = data.end_session_endpoint;
        });
    });
}

oidcRouter.get("/info", (req, res) => {
    const oidcEnabled = process.env.OIDC_ENABLED;
    const defaultLoginWithSSO = process.env.DEFAULT_LOGIN_WITH_SSO;
    const oidcRedirectUrl =
        OIDC_AUTH_ENDPOINT +
        `?scope=openid&response_type=code&redirect_uri=${redirectUri}&client_id=${process.env.OIDC_CLIENT_ID}`;

    const obj = {
        enabled: oidcEnabled,
        defaultSSO: defaultLoginWithSSO,
        loginRedirectUrl: oidcRedirectUrl,
        logoutRedirectUrl: OIDC_LOGOUT_ENDPOINT,
    };

    res.json(obj);
});

oidcRouter.post("/login", rateLimit, async (req, res) => {
    const clientSecret = process.env.OIDC_CLIENT_SECRET;
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

    const tokenResponse = await fetch(OIDC_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });
    // console.log("Token response:");
    const tokenJson = await tokenResponse.json();

    if (!tokenResponse.ok) {
        console.error("Token response error:", tokenResponse);
        return res.status(400).json({ error: "Token response error" });
    }

    const userInfoResponse = await fetch(OIDC_USERINFO_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${tokenJson.access_token}`,
        },
    });
    const userInfoJson = await userInfoResponse.json();
    // console.log("User info response:");
    // console.log(userInfoJson);
    // {
    //   sub: 'ff78c6ed-79ab-47d9-8a1f-3148b57bb7a6',
    //   email_verified: false,
    //   name: 'CB Adm',
    //   preferred_username: 'cbadmin',
    //   given_name: 'CB',
    //   family_name: 'Adm',
    //   email: 'rpark@uga.edu'
    // }

    // surely we can trust this username, right?
    const verifiedUsername = userInfoJson.preferred_username;

    const user = await User.findOne({ username: verifiedUsername });
    if (!user) {
        console.log("SSO LOGIN FAILURE - " + req.ip + " - (NO USER): " + verifiedUsername);
        return res.status(403).json({
            error: "Login failure. Account does not exist in CarBoy.",
            idToken: tokenJson.id_token,
        });
    }

    if (user.disabled) {
        console.log("SSO LOGIN FAILURE - " + req.ip + " - (ACCOUNT DISABLED): " + user.username);
        return res.status(400).json({ error: "Invalid credentials", idToken: tokenJson.id_token });
    }

    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
        console.log("SSO LOGIN SUCCESS - " + req.ip + ": " + user.username);

        // idToken used for logout
        return res.json({
            token,
            user: { id: user._id, username: user.username },
            idToken: tokenJson.id_token,
        });
    } catch (err) {
        console.log("LOGIN ERROR: " + err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = oidcRouter;
