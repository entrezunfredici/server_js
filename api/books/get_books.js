const db_books = require('../../proxy/db_books');

exports.getAll = async (req, res) => {
  const books = await db_books.getAll();
  res.json(books);
};
