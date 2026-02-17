import { NextResponse } from "next/server";
import { insertFeedback, getAllFeedback, getStats, getRatingDistribution } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taste, tryAgain, hydrating } = body;

    if (
      !taste || !tryAgain || !hydrating ||
      taste < 1 || taste > 5 ||
      tryAgain < 1 || tryAgain > 5 ||
      hydrating < 1 || hydrating > 5
    ) {
      return NextResponse.json({ error: "Invalid ratings. Must be 1-5." }, { status: 400 });
    }

    insertFeedback(taste, tryAgain, hydrating);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedback = getAllFeedback();
    const stats = getStats();
    const distribution = getRatingDistribution();
    return NextResponse.json({ feedback, stats, distribution });
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
