const db_books = require('../../../proxy/db_books');
const { formatBook } = require("./hateoas");
const is_type = require('../../../utils/verifier');

exports.post = async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author required." });
  }
  if (!is_type(title, "string") || !is_type(author, "string")) {
    return res.status(400).json({ message: "Title and author invalid types." });
  }

  const newBook = await db_books.add({ title, author });
  res.status(201).json(formatBook(newBook));
};
