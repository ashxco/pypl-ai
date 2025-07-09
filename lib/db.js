import Database from 'better-sqlite3';

const db = new Database('db.sqlite');

// Create users table
db.exec(`CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL
)`);

// Insert default users
db.exec(`INSERT OR IGNORE INTO users (username, password) VALUES ('pypl', 'pypl')`);
db.exec(`INSERT OR IGNORE INTO users (username, password) VALUES ('pypl2', 'pypl2')`);
db.exec(`INSERT OR IGNORE INTO users (username, password) VALUES ('pypl3', 'pypl3')`);
db.exec(`INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'admin')`);

export default db; 