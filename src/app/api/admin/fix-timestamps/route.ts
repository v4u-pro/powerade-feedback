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

  const stmt = db.prepare("UPDATE feedback SET created_at = ? WHERE id = ?");
  const updates: { id: number; timestamp: string }[] = [];

  // ids 1-5: spread in the morning of Feb 18, 10 AM - 2 PM IST (4:30 - 8:30 UTC)
  for (let i = 0; i < 5; i++) {
    const id = 1 + i;
    const minuteOffset = Math.floor((i / 5) * 240) + Math.floor(Math.random() * 20);
    const totalMins = 4 * 60 + 30 + minuteOffset;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const secs = Math.floor(Math.random() * 60);
    const timestamp = `2026-02-18 ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    stmt.run(timestamp, id);
    updates.push({ id, timestamp });
  }

  // ids 6-105: spread between 6 PM - 11 PM IST on Feb 18 (12:30 - 17:30 UTC)
  for (let i = 0; i < 100; i++) {
    const id = 6 + i;
    const minuteOffset = Math.floor((i / 100) * 300) + Math.floor(Math.random() * 3);
    const totalMins = 12 * 60 + 30 + minuteOffset;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const secs = Math.floor(Math.random() * 60);
    const timestamp = `2026-02-18 ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    stmt.run(timestamp, id);
    updates.push({ id, timestamp });
  }

  db.close();

  return NextResponse.json({
    success: true,
    updated: updates.length,
    sample_morning: updates.slice(0, 5),
    sample_evening: updates.slice(5, 10),
  });
}
