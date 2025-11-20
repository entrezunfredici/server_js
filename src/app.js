const cors = require('cors');
require('dotenv').config();
const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const corsOptions = {
  origin: process.env.AUTHORIZED_URL || 'https://frontend.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204, // pour le preflight
};

// routes
const createBookRouter = require("./api/books/routes");
const createAuthRouter = require("./api/auth/routes");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiterOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de requetes, reessayez plus tard." },
};

const limiters = {
  ONE_SEC: rateLimit({ ...limiterOptions, max: 2, windowMs: 1000 }),
  FIVE_SEC: rateLimit({ ...limiterOptions, max: 2, windowMs: 7000 }),
};


// Middleware pour servir la documentation Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/books", createBookRouter(limiters));
createAuthRouter(app);

// Correction ici : utiliser (req, res) au lieu de ({ res })
app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

module.exports = app;
