import { NextRequest, NextResponse } from "next/server";
import { semanticMemberSearch } from "@/lib/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  const results = await semanticMemberSearch(q.trim());
  return NextResponse.json({ members: results });
}
