const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database/database.db')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`)
})

module.exports = db