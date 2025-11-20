const request = require("supertest");

// Disable rate limiting for predictable tests.
jest.mock("express-rate-limit", () => () => (req, res, next) => next());

// In-memory user store for auth tests.
jest.mock("../src/proxy/db_users", () => {
    const users = [];

    return {
        getByName: async (name) => users.find((user) => user.name === name),
        add: async ({ name, password }) => {
            if (users.find((user) => user.name === name)) {
                throw new Error("User already exists");
            }
            if (!name || !password) {
                throw new Error("Forgetten fields");
            }
            const newUser = { id: users.length + 1, name, password };
            users.push(newUser);
            return { status: "created", name };
        },
        verifyPassword: async (id, password) => {
            const user = users.find((u) => u.id === id);
            if (!user) return false;
            return user.password === password;
        },
    };
});

process.env.AUTH_JWT_SECRET = "test-secret";
process.env.AUTH_JWT_EXPIRES_IN = "1h";

const app = require("../src/app");

describe("AUTH API", () => {
    test("POST /auth/register creates a user", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ name: "alice", password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: "User registered with success." });
    });

    test("POST /auth/login returns a JWT for valid credentials", async () => {
        await request(app)
            .post("/auth/register")
            .send({ name: "bob", password: "passbob" });

        const res = await request(app)
            .post("/auth/login")
            .send({ name: "bob", password: "passbob" });

        expect(res.statusCode).toBe(200);
        expect(typeof res.body.token).toBe("string");
        expect(res.body.token.length).toBeGreaterThan(10);
    });

    test("POST /auth/login rejects invalid password", async () => {
        await request(app)
            .post("/auth/register")
            .send({ name: "carol", password: "secret123" });

        const res = await request(app)
            .post("/auth/login")
            .send({ name: "carol", password: "wrong" });

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Login failed" });
    });

    test("POST /auth/register fails with missing fields", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({ name: "", password: "" });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "inscription failed." });
    });
});
