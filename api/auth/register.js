const db_users = require('../../proxy/db_users');

exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        await db_users.add({ name, password });
        res.status(201).send({ message: "User registered with success." });
    } catch (error) {
        console.error(error?.message || error);
        res.status(500).send({ message: "inscription failed." });
    }
};
