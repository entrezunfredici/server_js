const db_books = require('../../../proxy/db_books');
const { formatBook } = require("./hateoas");
const is_type = require('../../../utils/verifier');

exports.get = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Identifiant invalide" });
  }

  const book = await db_books.getById(id);

  if (!book) {
    return res.status(404).json({ message: "Livre non trouve" });
  }

  res.json(formatBook(book));
};
