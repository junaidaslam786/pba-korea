import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const db = new PrismaClient();

// Normalize a name for fuzzy matching: lowercase, remove titles/honorifics, trim
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/^(mr\.|mrs\.|dr\.|haji|hafiz|mian|mr|mrs|dr)\s*/gi, "")
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

// Convert filename to a comparable name: remove numbers prefix, dashes, extensions, trailing dashes
function fileToName(filename: string): string {
  return filename
    .replace(/\.(jpg|jpeg|png)$/i, "")
    .replace(/^[\d]+-/, "")          // remove leading number prefix like "3-"
    .replace(/-pdf$/i, "")           // remove "-pdf" suffix
    .replace(/-sab$/i, "")           // remove "-sab" suffix
    .replace(/-\d+$/, "")            // remove trailing "-1", "-2"
    .replace(/-+$/, "")              // remove trailing dashes
    .replace(/-/g, " ")              // dashes to spaces
    .toLowerCase()
    .trim();
}

async function main() {
  const membersDir = path.join(process.cwd(), "public", "uploads", "members");
  const imageFiles = fs.readdirSync(membersDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  const members = await db.member.findMany({ select: { id: true, name: true, profileImage: true } });

  console.log(`Found ${members.length} members and ${imageFiles.length} image files\n`);

  // Build normalized lookup: normalizedName -> member
  const memberMap = new Map<string, typeof members[0]>();
  for (const m of members) {
    memberMap.set(normalize(m.name), m);
  }

  let matched = 0;
  let unmatched: string[] = [];
  const usedMembers = new Set<string>();

  // Priority: prefer images without number prefix (from 2025/09 - better quality)
  // Then fall back to numbered ones (from 2025/10)
  const sorted = [...imageFiles].sort((a, b) => {
    const aNum = /^\d+-/.test(a);
    const bNum = /^\d+-/.test(b);
    if (aNum && !bNum) return 1;
    if (!aNum && bNum) return -1;
    return 0;
  });

  const updates: { id: string; name: string; image: string }[] = [];

  for (const file of sorted) {
    const fileName = fileToName(file);

    // Try exact match first
    let member = memberMap.get(fileName);

    // Try partial matches
    if (!member) {
      for (const [normName, m] of memberMap.entries()) {
        if (usedMembers.has(m.id)) continue;

        // Check if the file name parts match member name parts
        const fileParts = fileName.split(" ").filter(Boolean);
        const memberParts = normName.split(" ").filter(Boolean);

        // All file parts must appear in member name (or vice versa)
        const fileMatchesMember = fileParts.every(fp =>
          memberParts.some(mp => mp.includes(fp) || fp.includes(mp))
        );
        const memberMatchesFile = memberParts.every(mp =>
          fileParts.some(fp => fp.includes(mp) || mp.includes(fp))
        );

        if (fileMatchesMember || memberMatchesFile) {
          member = m;
          break;
        }
      }
    }

    // More aggressive: check last-name + first-name match
    if (!member) {
      const fileParts = fileName.split(" ").filter(Boolean);
      for (const [normName, m] of memberMap.entries()) {
        if (usedMembers.has(m.id)) continue;
        const memberParts = normName.split(" ").filter(Boolean);

        // At least 2 matching parts
        const matchCount = fileParts.filter(fp =>
          memberParts.some(mp => mp === fp)
        ).length;

        if (matchCount >= 2) {
          member = m;
          break;
        }
      }
    }

    if (member && !usedMembers.has(member.id)) {
      usedMembers.add(member.id);
      updates.push({ id: member.id, name: member.name, image: `/uploads/members/${file}` });
      matched++;
    } else if (!member) {
      unmatched.push(`${file} -> "${fileName}"`);
    }
  }

  console.log(`\n=== MATCHED (${updates.length}) ===`);
  for (const u of updates) {
    console.log(`  ${u.name} -> ${u.image}`);
  }

  console.log(`\n=== UNMATCHED (${unmatched.length}) ===`);
  for (const u of unmatched) {
    console.log(`  ${u}`);
  }

  console.log(`\n=== MEMBERS WITHOUT IMAGE (${members.length - updates.length}) ===`);
  for (const m of members) {
    if (!usedMembers.has(m.id)) {
      console.log(`  ${m.name}`);
    }
  }

  // Apply updates
  console.log(`\nApplying ${updates.length} image updates...`);
  for (const u of updates) {
    await db.member.update({
      where: { id: u.id },
      data: { profileImage: u.image },
    });
  }
  console.log(`✓ Updated ${updates.length} members with profile images`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
