import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateQRCode } from "@/lib/qr";
import { syncMemberEmbedding } from "@/lib/search";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return NextResponse.json({ error: "CSV must have a header row and at least one data row" }, { status: 400 });
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const requiredCols = ["membershipnumber", "name", "designation", "businessname", "natureofbusiness", "address"];

  for (const col of requiredCols) {
    if (!headers.includes(col)) {
      return NextResponse.json({ error: `Missing required column: ${col}` }, { status: 400 });
    }
  }

  const imported: string[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) {
      errors.push(`Row ${i + 1}: insufficient columns`);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() ?? "";
    });

    if (!row.membershipnumber || !row.name) {
      errors.push(`Row ${i + 1}: missing membership number or name`);
      continue;
    }

    try {
      const member = await db.member.create({
        data: {
          membershipNumber: row.membershipnumber,
          name: row.name,
          designation: row.designation || "Member",
          businessName: row.businessname || "",
          natureOfBusiness: row.natureofbusiness || "",
          address: row.address || "",
          phone: row.phone || null,
          website: row.website || null,
        },
      });

      // Generate QR code
      try {
        const qrUrl = await generateQRCode(member.id);
        await db.member.update({ where: { id: member.id }, data: { qrCodeUrl: qrUrl } });
      } catch {
        // Non-critical — QR can be regenerated later
      }

      // Sync embedding (non-blocking)
      syncMemberEmbedding(member.id).catch(() => {});

      imported.push(member.id);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      errors.push(`Row ${i + 1} (${row.name}): ${message}`);
    }
  }

  return NextResponse.json({ imported: imported.length, errors });
}

/** Minimal CSV line parser that respects quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        current += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        result.push(current);
        current = "";
      } else {
        current += c;
      }
    }
  }
  result.push(current);
  return result;
}
