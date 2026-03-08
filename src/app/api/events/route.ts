import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const events = await db.event.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.date || !body.location) {
    return NextResponse.json({ error: "Title, date, and location are required" }, { status: 400 });
  }

  const slug = slugify(body.title);
  const event = await db.event.create({
    data: {
      title: body.title,
      slug,
      date: new Date(body.date),
      location: body.location,
      description: body.description || null,
      imageUrl: body.imageUrl || null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
