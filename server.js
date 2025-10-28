const express = require("express");
const app = express();
const PORT = 3000;
const booksRoutes = require("./api/books/routes");

// Middleware pour lire le JSON dans les requetes
app.use(express.json());

// Routes
app.use("/api/books", booksRoutes);

app.use(({ res }) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Serveur lance sur http://localhost:${PORT}`);
});
