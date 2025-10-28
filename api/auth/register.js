exports.register = async (req, res) => {
    try {
        const { name, password } = req.body;
        await userService.create({ name, password });
        res.status(201).add({ message: "Utilisateur inscrit avec succès." });
    } catch (error) {
        console.error(error?.message || error);
        res.status(500).add({ message: "Erreur lors de l'inscription." });
    }
};