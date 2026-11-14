const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const validStatuses = [
  "Want to Play",
  "Currently Playing",
  "Completed"
];

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "GameVault API is working!"
  });
});

app.get("/api/games", (req, res) => {
  const search = req.query.search || "";

  const games = db.prepare(`
    SELECT * FROM games
    WHERE title LIKE ?
    ORDER BY created_at DESC
  `).all(`%${search}%`);

  res.json(games);
});

app.post("/api/games", (req, res) => {
  const {
    title,
    genre = "",
    platform = "",
    status = "Want to Play",
    rating = null
  } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Game title is required."
    });
  }
  if (typeof genre !== "string" || typeof platform !== "string") {
    return res.status(400).json({
      error: "Genre and platform must be text."
    });
  }
  

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid game status."
    });
  }

  if (
    rating !== null &&
    (!Number.isInteger(rating) || rating < 1 || rating > 10)
  ) {
    return res.status(400).json({
      error: "Rating must be between 1 and 10."
    });
  }

  const result = db.prepare(`
    INSERT INTO games (title, genre, platform, status, rating)
    VALUES (?, ?, ?, ?, ?)
  `).run(title.trim(), genre, platform, status, rating);

  const newGame = db.prepare(
    "SELECT * FROM games WHERE id = ?"
  ).get(result.lastInsertRowid);

  res.status(201).json(newGame);
});

app.put("/api/games/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    genre = "",
    platform = "",
    status,
    rating = null
  } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Game title is required."
    });
  }
    if (typeof genre !== "string" || typeof platform !== "string") {
      return res.status(400).json({
        error: "Genre and platform must be text."
      });
    }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid game status."
    });
  }

  if (
    rating !== null &&
    (!Number.isInteger(rating) || rating < 1 || rating > 10)
  ) {
    return res.status(400).json({
      error: "Rating must be between 1 and 10."
    });
  }

  const result = db.prepare(`
    UPDATE games
    SET title = ?, genre = ?, platform = ?,
        status = ?, rating = ?
    WHERE id = ?
  `).run(title.trim(), genre, platform, status, rating, id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Game not found."
    });
  }

  const updatedGame = db.prepare(
    "SELECT * FROM games WHERE id = ?"
  ).get(id);

  res.json(updatedGame);
});

app.delete("/api/games/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM games WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Game not found."
    });
  }

  res.json({
    message: "Game deleted successfully."
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON request."
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error."
  });
});

app.listen(PORT, () => {
  console.log(
    `GameVault server running on http://localhost:${PORT}`
  );
});





