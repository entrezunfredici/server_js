const express = require("express");
const login = require("./login");
const register = require("./register");

const passthrough = (req, res, next) => next();

const createUsersRouter = (limiters = {}) => {
    const router = express.Router();

    router.post("/login", login.login);
    router.post("/register", register.register);

    return router;
};

module.exports = createUsersRouter;
