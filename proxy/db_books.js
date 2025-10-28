const books = require("../mockDB/bookDB");

const nextId = () => {
  if (books.length === 0) {
    return 1;
  }

  const highestId = books.reduce((maxId, book) => {
    return book.id > maxId ? book.id : maxId;
  }, 0);

  return highestId + 1;
};

module.exports = {
  getAll: async () => books,

  getById: async (id) => books.find((book) => book.id === id),

  add: async ({ title, author }) => {
    const newBook = { id: nextId(), title, author };
    books.push(newBook);
    return newBook;
  },

  updateById: async (id, updates) => {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return null;
    }

    books[index] = { ...books[index], ...updates, id };
    return books[index];
  },

  deleteById: async (id) => {
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return null;
    }

    const [removed] = books.splice(index, 1);
    return removed;
  },
};
