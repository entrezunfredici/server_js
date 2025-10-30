const express = require("express");
const login = require("./login");
const register = require("./register");

const createAuthRouter = (limiters = {}) => {
    const router = express.Router();
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: login and get JWT
     *     tags: [auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Michel"
     *               password:
     *                 type: string
     *                 example: "fougères123"
     *     responses:
     *       200:
     *         description: JWT généré.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       404:
     *         description: login failed.
     *       500:
     *         description: Server Error.
     */
    router.post("/login", login.login);
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: register
     *     tags: [auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: "mathieu"
     *               password:
     *                 type: string
     *                 example: "mypassword123"
     *     responses:
     *       201:
     *         description: register success.
     *       500:
     *         description: register failed.
     */
    router.post("/register", register.register);

    return router;
};

module.exports = (app) => {
    /**
     * @swagger
     * tags:
     *   - name: auth
     *     description: authentification
     */
    app.use("/auth", createAuthRouter);
};
