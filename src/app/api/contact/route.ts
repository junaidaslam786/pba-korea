import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await db.contactSubmission.create({
    data: { name, email, subject, message },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
