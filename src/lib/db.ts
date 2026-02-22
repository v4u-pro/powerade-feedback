import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "feedback.db");

let db: Database.Database;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taste INTEGER NOT NULL CHECK(taste BETWEEN 1 AND 5),
        try_again INTEGER NOT NULL CHECK(try_again BETWEEN 1 AND 5),
        hydrating INTEGER NOT NULL CHECK(hydrating BETWEEN 1 AND 5),
        created_at TEXT DEFAULT (datetime('now')),
        comments TEXT DEFAULT ''
      )
    `);
    // Add comments column if missing (existing DBs)
    try {
      db.exec(`ALTER TABLE feedback ADD COLUMN comments TEXT DEFAULT ''`);
    } catch {
      // column already exists
    }
  }
  return db;
}

export function insertFeedback(taste: number, tryAgain: number, hydrating: number, comments: string = "") {
  const db = getDb();
  const stmt = db.prepare("INSERT INTO feedback (taste, try_again, hydrating, comments) VALUES (?, ?, ?, ?)");
  return stmt.run(taste, tryAgain, hydrating, comments);
}

export function getAllFeedback() {
  const db = getDb();
  return db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all() as {
    id: number;
    taste: number;
    try_again: number;
    hydrating: number;
    created_at: string;
    comments: string;
  }[];
}

export function getStats() {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
        COUNT(*) as total,
        ROUND(AVG(taste), 2) as avg_taste,
        ROUND(AVG(try_again), 2) as avg_try_again,
        ROUND(AVG(hydrating), 2) as avg_hydrating
      FROM feedback`
    )
    .get() as { total: number; avg_taste: number; avg_try_again: number; avg_hydrating: number };
  return row;
}

export function getRatingDistribution() {
  const db = getDb();
  const dist = (col: string) =>
    db
      .prepare(
        `SELECT ${col} as rating, COUNT(*) as count FROM feedback GROUP BY ${col} ORDER BY ${col}`
      )
      .all() as { rating: number; count: number }[];

  return {
    taste: dist("taste"),
    try_again: dist("try_again"),
    hydrating: dist("hydrating"),
  };
}
