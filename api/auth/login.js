const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await userService.findByName(name);
        if (!user) return res.status(404).send({ message: "Utilisateur introuvable." });

        const isPasswordValid = await userService.verifyPassword(user.userId, password);
        if (!isPasswordValid) return res.status(401).send({ message: "Mot de passe incorrect." });

        const token = jwt.sign(
            { id: user.userId, name: user.name },
            process.env.AUTH_JWT_SECRET,
            { expiresIn: process.env.AUTH_JWT_EXPIRES_IN }
        );

        await userService.updateLoginDate(user.userId);

        res.status(200).send({ token });
    } catch (error) {
        console.error(error?.message || error);
        res.status(500).send({ message: "Erreur lors de la connexion." });
    }
};
