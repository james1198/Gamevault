const Database = require("better-sqlite3");
const path = require("path");

// Create or connect to database
const db = new Database(
  path.join(__dirname, "gamevault.db")
);

// Create games table
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT,
    platform TEXT,
    status TEXT DEFAULT 'Want to Play',
    rating INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("GameVault database connected!");

module.exports = db;
