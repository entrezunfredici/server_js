const express = require("express");
const addBook = require("./add_book");
const getBooks = require("./get_books");
const getBook = require("./get_book");
const updateBook = require("./put_book");
const deleteBook = require("./del_book");

const passthrough = (req, res, next) => next();

const createBooksRouter = (limiters = {}) => {
    const router = express.Router();

    const readLimiter = limiters.FIVE_SEC || passthrough;
    const writeLimiter = limiters.ONE_SEC || readLimiter;

    router.get("/", readLimiter, getBooks.getAll);
    router.get("/:id", readLimiter, getBook.get);
    router.post("/", writeLimiter, addBook.post);
    router.put("/:id", writeLimiter, updateBook.put);
    router.delete("/:id", writeLimiter, deleteBook.delete);

    return router;
};

module.exports = createBooksRouter;
