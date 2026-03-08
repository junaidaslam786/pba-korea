import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing executive members to avoid duplicates
  await prisma.executiveMember.deleteMany();

  // Leaders (with photos)
  const leaders = [
    {
      name: "Muddasar Ali Cheema",
      designation: "Chairman",
      imageUrl: "/uploads/executive/chairman.jpg",
      category: "LEADER" as const,
      sortOrder: 1,
    },
    {
      name: "Rahim Shah",
      designation: "President",
      imageUrl: "/uploads/executive/president.jpg",
      category: "LEADER" as const,
      sortOrder: 2,
    },
    {
      name: "Mian Sagheer Ahmad",
      designation: "General Secretary",
      imageUrl: "/uploads/executive/general-secratary.jpg",
      category: "LEADER" as const,
      sortOrder: 3,
    },
  ];

  // Management Team
  const management = [
    { name: "—", designation: "Vice Chairman", category: "MANAGEMENT" as const, sortOrder: 1 },
    { name: "—", designation: "Senior Vice President", category: "MANAGEMENT" as const, sortOrder: 2 },
    { name: "—", designation: "Secretary Finance", category: "MANAGEMENT" as const, sortOrder: 3 },
    { name: "—", designation: "Senior Vice President", category: "MANAGEMENT" as const, sortOrder: 4 },
  ];

  for (const l of leaders) {
    await prisma.executiveMember.create({ data: l });
    console.log(`✅ Created leader: ${l.name} — ${l.designation}`);
  }

  for (const m of management) {
    await prisma.executiveMember.create({ data: m });
    console.log(`✅ Created management: ${m.designation} — ${m.name}`);
  }

  const count = await prisma.executiveMember.count();
  console.log(`\n🏁 Total executive members: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
