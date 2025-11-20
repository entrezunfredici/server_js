const jwt = require('jsonwebtoken');
const db_users = require('../../proxy/db_users');
const is_type = require('../../utils/verifier');

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!is_type(name, "string") || !is_type(password, "string")) {
            return res.status(400).json({ message: "Title and author invalid types." });
        }
        const user = await db_users.getByName(name);
        if (!user) return res.status(404).send({ message: "Login failed" });
        const isPasswordValid = await db_users.verifyPassword(user.id, password);
        if (!isPasswordValid) return res.status(404).send({ message: "Login failed" });

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.AUTH_JWT_SECRET,
            { expiresIn: process.env.AUTH_JWT_EXPIRES_IN }
        );

        res.status(200).send({ token });
    } catch (error) {
        console.error(error?.message || error);
        res.status(500).send({ message: "Server Error." });
    }
};
