const express = require("express");
const add_book = require("./add_book");
const get_books = require("./get_books");
const get_book = require("./get_book");
const put_book = require("./put_book");
const del_book = require("./del_book");

const router = express.Router();

router.get("/", get_books.getAll);
router.get("/:id", get_book.get);
router.post("/", add_book.post);
router.put("/:id", put_book.put);
router.delete("/:id", del_book.delete);

module.exports = router;
