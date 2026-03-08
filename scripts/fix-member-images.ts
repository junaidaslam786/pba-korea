import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Manual fixes for wrong matches and unmatched members
const fixes: { memberName: string; image: string }[] = [
  // Wrong matches to fix
  { memberName: "Shahriyar", image: "" }, // was wrongly given RAHEEM-SHAH.jpg - clear it, set correct below
  { memberName: "Mr. M Amjad Sial", image: "/uploads/members/Muhammad-Amjad-Sial-.jpg" }, // was wrongly given Mr.-Imtiaz-Ahmad-2.jpg

  // Unmatched members that have images
  { memberName: "Mr. Rahim Shah", image: "/uploads/members/RAHEEM-SHAH.jpg" },
  { memberName: "Mian Sagheer Ahmad", image: "/uploads/members/MIAN-SAGEER-AHMED.jpg" },
  { memberName: "Ghufran Ullah", image: "/uploads/members/6-Ghufram-Ullah.jpg" },
  { memberName: "Ayub Khan", image: "/uploads/members/Ayub-Abdul.jpg" }, // 72250054 - the second Ayub Khan
];

async function main() {
  for (const fix of fixes) {
    // Find by name - if there are duplicates, match the one without an image
    const members = await db.member.findMany({
      where: { name: fix.memberName },
      select: { id: true, name: true, membershipNumber: true, profileImage: true },
    });

    if (members.length === 0) {
      console.log(`❌ Not found: ${fix.memberName}`);
      continue;
    }

    // For Ayub Khan (duplicate), pick the one without image
    let target = members[0];
    if (members.length > 1) {
      const noImage = members.find(m => !m.profileImage);
      if (noImage) target = noImage;
    }

    await db.member.update({
      where: { id: target.id },
      data: { profileImage: fix.image || null },
    });
    console.log(`✓ ${target.name} (${target.membershipNumber}) -> ${fix.image || "(cleared)"}`);
  }

  // Also fix Shahriyar - assign no image (there is no Shahriyar image file)
  // Let's also set the correct image for Shahriyar (18-Shahriyar.jpg exists!)
  const shahriyar = await db.member.findFirst({ where: { name: "Shahriyar" } });
  if (shahriyar) {
    await db.member.update({
      where: { id: shahriyar.id },
      data: { profileImage: "/uploads/members/18-Shahriyar.jpg" },
    });
    console.log(`✓ Shahriyar -> /uploads/members/18-Shahriyar.jpg`);
  }

  // Summary
  const withImage = await db.member.count({ where: { profileImage: { not: null } } });
  const total = await db.member.count();
  console.log(`\n📊 ${withImage}/${total} members now have profile images`);

  // List members still without image
  const noImage = await db.member.findMany({
    where: { OR: [{ profileImage: null }, { profileImage: "" }] },
    select: { name: true, membershipNumber: true },
  });
  if (noImage.length > 0) {
    console.log("\nMembers still without image:");
    noImage.forEach(m => console.log(`  - ${m.name} (${m.membershipNumber})`));
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
