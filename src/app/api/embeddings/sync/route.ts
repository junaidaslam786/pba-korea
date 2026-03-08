import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncAllEmbeddings } from "@/lib/search";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await syncAllEmbeddings();
  return NextResponse.json(result);
}
