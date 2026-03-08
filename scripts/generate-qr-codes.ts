import { PrismaClient } from "@prisma/client";
import { generateBulkQRCodes } from "../src/lib/qr";

const db = new PrismaClient();

async function main() {
  const members = await db.member.findMany({ select: { id: true, name: true } });
  console.log(`Found ${members.length} members. Generating QR codes...`);

  const qrMap = await generateBulkQRCodes(members.map((m) => m.id));

  let updated = 0;
  for (const [memberId, qrCodeUrl] of qrMap) {
    await db.member.update({
      where: { id: memberId },
      data: { qrCodeUrl },
    });
    updated++;
  }

  console.log(`✓ Generated and saved ${updated} QR codes.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
