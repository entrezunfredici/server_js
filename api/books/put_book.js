const db_books = require('../../proxy/db_books');

exports.put = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, author } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Identifiant invalide" });
  }

  if (!title || !author) {
    return res.status(400).json({ message: "Titre et auteur sont requis." });
  }

  const updatedBook = await db_books.updateById(id, { title, author });

  if (!updatedBook) {
    return res.status(404).json({ message: "Livre non trouve" });
  }

  res.json(updatedBook);
};
