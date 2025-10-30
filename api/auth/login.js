const jwt = require('jsonwebtoken');
const db_users = require('../../proxy/db_users');

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

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
