require('dotenv').config();
const express = require("express");
const app = express();
const PORT = 3000;
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

// routes
const createBookRouter = require("./api/books/routes");
const createAuthRouter = require("./api/auth/routes");

// Middleware pour lire le JSON dans les requetes
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`);
});

module.exports = app;
