import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const slug = slugify(body.title);
  const post = await db.post.create({
    data: {
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt || null,
      imageUrl: body.imageUrl || null,
      published: body.published ?? false,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
