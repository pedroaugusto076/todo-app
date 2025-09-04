const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');

// Cria tabela se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0
  )`);
});

module.exports = db;
