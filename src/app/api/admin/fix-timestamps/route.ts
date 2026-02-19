import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

export async function POST(request: Request) {
  const { secret } = await request.json();
  if (secret !== "fix-ts-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "feedback.db");
  const db = new Database(DB_PATH);

  // Spread ids 6-105 between 12:30 UTC and 17:30 UTC on 2026-02-17
  // That's 6 PM IST to 11 PM IST (5 hours = 300 minutes)
  const startMinute = 0; // offset from 12:30
  const totalMinutes = 300; // 5 hours
  const count = 100; // ids 6 to 105

  const stmt = db.prepare("UPDATE feedback SET created_at = ? WHERE id = ?");

  const updates = [];
  for (let i = 0; i < count; i++) {
    const id = 6 + i;
    const minuteOffset = Math.floor((i / count) * totalMinutes) + Math.floor(Math.random() * 3);
    const totalMins = 12 * 60 + 30 + minuteOffset;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const secs = Math.floor(Math.random() * 60);
    const timestamp = `2026-02-17 ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    stmt.run(timestamp, id);
    updates.push({ id, timestamp });
  }

  db.close();

  return NextResponse.json({
    success: true,
    updated: updates.length,
    sample: updates.slice(0, 5),
  });
}
