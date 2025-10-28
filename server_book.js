const express = require("express");
const app = express();
const PORT = 3000;

// Middleware pour lire le JSON dans les requÃªtes
app.use(express.json());

// Données stockées en mémoire
let mockBookDB = [
  { id: 1, title: "Le Seigneur des Anneaux", author: "J.R.R. Tolkien" },
  { id: 2, title: "Dune", author: "Frank Herbert" },
];

// ==========================
//        ROUTES CRUD
// ==========================

// GET - Récupérer tous les livres
app.get("/api/books", (req, res) => {
  res.json(mockBookDB);
});

// GET (par ID) - Récupérer un livre spécifique
app.get("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = mockBookDB.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  res.json(book);
});

// POST - Ajouter un nouveau livre
/*
exemple ajout:
{
  "title": "Neuromancien",
  "author": "William Gibson"
}
*/
app.post("/api/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Titre et auteur sont requis." });
  }

  const newBook = {
    id: mockBookDB.length ? mockBookDB[mockBookDB.length - 1].id + 1 : 1,
    title,
    author,
  };

  mockBookDB.push(newBook);
  res.status(201).json(newBook);
});

// PUT - Mettre Ã  jour un livre existant
/*
exemple 
{
  "title": "Dune (Ã‰dition révisée)",
  "author": "Frank Herbert"
}
*/
app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author } = req.body;

  const bookIndex = mockBookDB.findIndex((b) => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  if (!title || !author) {
    return res.status(400).json({ message: "Titre et auteur sont requis." });
  }

  mockBookDB[bookIndex] = { id, title, author };
  res.json(mockBookDB[bookIndex]);
});

// DELETE - Supprimer un livre
// /api/books/:id
app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = mockBookDB.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  const deletedBook = mockBookDB.splice(bookIndex, 1);
  res.json({ message: "Livre supprimé", deleted: deletedBook[0] });
});


app.listen(PORT, () => {
  console.log(`ðŸš€ Serveur lancé sur http://localhost:${PORT}`);
});
