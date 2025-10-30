const db_books = require('../../../proxy/db_books');
const { formatCollection } = require("./hateoas");

exports.getAll = async (req, res) => {
  const books = await db_books.getAll();
  res.json(formatCollection(books));
};
