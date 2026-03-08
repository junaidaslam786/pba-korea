import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
db.member.findFirst({ select: { id: true, name: true, qrCodeUrl: true } })
  .then((m) => { console.log(JSON.stringify(m)); return db.$disconnect(); })
  .catch(console.error);
