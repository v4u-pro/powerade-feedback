import { NextResponse } from "next/server";
import { getAllFeedback } from "@/lib/db";

export async function GET() {
  const rows = getAllFeedback();

  const header = "ID,Taste Rating,Try Again Rating,Hydrating Rating,Comments,Submitted At";
  const csv = [
    header,
    ...rows.map(
      (r) => `${r.id},${r.taste},${r.try_again},${r.hydrating},"${(r.comments || "").replace(/"/g, '""')}",${r.created_at}`
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="powerade-feedback.csv"',
    },
  });
}
