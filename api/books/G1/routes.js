const express = require("express");
const addBook = require("./add_book");
const getBooks = require("./get_books");
const getBook = require("./get_book");
const updateBook = require("./put_book");
const deleteBook = require("./del_book");
const requireAuth = require("../../auth/auth.middleware");

const passthrough = (req, res, next) => next();

/**
 * Build router for books API version G1.
 * @param {Object} limiters
 * @param {Function} limiters.ONE_SEC
 * @param {Function} limiters.FIVE_SEC
 */
module.exports = (limiters = {}) => {
    const router = express.Router({ mergeParams: true });

    const readLimiter = limiters.FIVE_SEC || passthrough;
    const writeLimiter = limiters.ONE_SEC || readLimiter;

    /**
     * @swagger
     * components:
     *   schemas:
     *     Book:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *           example: 1
     *         title:
     *           type: string
     *           example: "Le Petit Prince"
     *         author:
     *           type: string
     *           example: "Antoine de Saint-Exupery"
     */

    /**
     * @swagger
     * /books/G1:
     *   get:
     *     summary: List all books (G1)
     *     tags: [books]
     *     responses:
     *       200:
     *         description: List of books.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Book'
     *       500:
     *         description: Server error.
     */
    router.get("/", readLimiter, getBooks.getAll);

    /**
     * @swagger
     * /books/G1/{id}:
     *   get:
     *     summary: Get a book by id (G1)
     *     tags: [books]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Book identifier.
     *     responses:
     *       200:
     *         description: Book found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Invalid identifier.
     *       404:
     *         description: Book not found.
     *       500:
     *         description: Server error.
     */
    router.get("/:id", readLimiter, getBook.get);

    /**
     * @swagger
     * /books/G1:
     *   post:
     *     summary: Create a book (G1)
     *     tags: [books]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - author
     *             properties:
     *               title:
     *                 type: string
     *                 example: "Clean Code"
     *               author:
     *                 type: string
     *                 example: "Robert C. Martin"
     *     responses:
     *       201:
     *         description: Book created.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Missing fields.
     *       401:
     *         description: Unauthorized.
     *       500:
     *         description: Server error.
     */
    router.post("/", writeLimiter, requireAuth, addBook.post);

    /**
     * @swagger
     * /books/G1/{id}:
     *   put:
     *     summary: Update a book (G1)
     *     tags: [books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Book identifier.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - author
     *             properties:
     *               title:
     *                 type: string
     *                 example: "Clean Code"
     *               author:
     *                 type: string
     *                 example: "Robert C. Martin"
     *     responses:
     *       200:
     *         description: Book updated.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Invalid payload or identifier.
     *       401:
     *         description: Unauthorized.
     *       404:
     *         description: Book not found.
     *       500:
     *         description: Server error.
     */
    router.put("/:id", writeLimiter, requireAuth, updateBook.put);

    /**
     * @swagger
     * /books/G1/{id}:
     *   delete:
     *     summary: Remove a book (G1)
     *     tags: [books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Book identifier.
     *     responses:
     *       200:
     *         description: Book removed.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Livre supprime"
     *                 deleted:
     *                   $ref: '#/components/schemas/Book'
     *       400:
     *         description: Invalid identifier.
     *       401:
     *         description: Unauthorized.
     *       404:
     *         description: Book not found.
     *       500:
     *         description: Server error.
     */
    router.delete("/:id", writeLimiter, requireAuth, deleteBook.delete);

    return router;
};
