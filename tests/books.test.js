const request = require("supertest");

// Disable rate limiting and seed an in-memory database for predictable tests.
jest.mock("express-rate-limit", () => () => (req, res, next) => next());
jest.mock("../src/mock/bookDB", () => [
    { id: 1, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien" },
    { id: 2, title: "Dune", author: "Frank Herbert" },
]);

process.env.API_BYPASS_AUTH = "true";
const app = require("../src/app");

describe("BOOKS API", () => {
    test("GET /books returns available versions", async () => {
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.versions)).toBe(true);
        expect(res.body.versions[0]).toHaveProperty("id", "G1");
    });

    test("GET /books/G1 returns a collection", async () => {
        const res = await request(app).get("/books/G1");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items[0]).toEqual(
            expect.objectContaining({
                id: 1,
                title: "Le Seigneur des Anneaux",
                author: "J.R.R. Tolkien",
            })
        );
    });

    test("GET /books/G1/:id returns a book", async () => {
        const res = await request(app).get("/books/G1/1");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                id: 1,
                title: "Le Seigneur des Anneaux",
                author: "J.R.R. Tolkien",
            })
        );
    });

    let createdBookId;

    test("POST /books/G1 creates a book", async () => {
        const res = await request(app)
            .post("/books/G1")
            .send({ title: "New Book", author: "New Author" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                title: "New Book",
                author: "New Author",
            })
        );
        createdBookId = res.body.id;
        expect(typeof createdBookId).toBe("number");
    });

    test("GET /books/G1/:id returns the created book", async () => {
        const res = await request(app).get(`/books/G1/${createdBookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                id: createdBookId,
                title: "New Book",
                author: "New Author",
            })
        );
    });

    test("POST /books/G1 rejects invalid book payload", async () => {
        const res = await request(app)
            .post("/books/G1")
            .send({ title: 42, author: "New Author" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({ message: "Title and author invalid types." })
        );
        expect(res.body).not.toHaveProperty("id");
    });

    test("POST /books/G1 add only the required fields", async () => {
        const res = await request(app)
            .post("/books/G1")
            .send({ title: "MyBook", author: "New Author", ziguouiguoui: "trollface" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                title: "MyBook",
                author: "New Author",
            })
        );
        createdBookId = res.body.id;
        expect(typeof createdBookId).toBe("number");
    });

    test("GET /books/G1/:id returns the created book", async () => {
        const res = await request(app).get(`/books/G1/${createdBookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                id: createdBookId,
                title: "MyBook",
                author: "New Author",
            })
        );
    });
});
