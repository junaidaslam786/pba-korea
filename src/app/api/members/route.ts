import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const members = await db.member.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { membershipNumber, name, designation, businessName, natureOfBusiness, address, phone, website, profileImage } = body;

  if (!membershipNumber || !name || !designation || !businessName || !natureOfBusiness || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const member = await db.member.create({
    data: { membershipNumber, name, designation, businessName, natureOfBusiness, address, phone, website, profileImage },
  });

  return NextResponse.json(member, { status: 201 });
}
