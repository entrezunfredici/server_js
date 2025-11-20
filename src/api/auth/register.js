const db_users = require('../../proxy/db_users');
const is_type = require('../../utils/verifier');

exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!is_type(name, "string") || !is_type(password, "string")) {
            return res.status(400).json({ message: "Title and author invalid types." });
        }
        await db_users.add({ name, password });
        res.status(201).send({ message: "User registered with success." });
    } catch (error) {
        console.error(error?.message || error);
        res.status(500).send({ message: "inscription failed." });
    }
};
