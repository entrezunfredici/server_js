const db_books = require('../../../proxy/db_books');

exports.post = async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author required." });
  }

  const newBook = await db_books.add({ title, author });
  res.status(201).json(newBook);
};
