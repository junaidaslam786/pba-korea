import { db } from "@/lib/db";
import { generateEmbedding, generateMemberEmbeddingText } from "@/lib/embeddings";

/**
 * Perform semantic search over the member directory using pgvector.
 * Falls back to text-based ILIKE search if embedding generation fails.
 */
export async function semanticMemberSearch(query: string, limit = 20) {
  try {
    // Generate an embedding for the user's query
    const queryEmbedding = await generateEmbedding(query);
    const vectorStr = `[${queryEmbedding.join(",")}]`;

    // Use raw SQL for pgvector cosine similarity search
    const results: Array<{
      id: string;
      name: string;
      phone: string | null;
      businessName: string;
      address: string;
      membershipNumber: string;
      profileImage: string | null;
      natureOfBusiness: string;
      designation: string;
      qrCodeUrl: string | null;
      similarity: number;
    }> = await db.$queryRawUnsafe(
      `SELECT m.id, m.name, m.phone, m."businessName", m.address,
              m."membershipNumber", m."profileImage", m."natureOfBusiness",
              m.designation, m."qrCodeUrl",
              1 - (e.vector <=> $1::vector) AS similarity
       FROM "Member" m
       INNER JOIN "MemberEmbedding" e ON e."memberId" = m.id
       ORDER BY e.vector <=> $1::vector
       LIMIT $2`,
      vectorStr,
      limit
    );

    return results;
  } catch {
    // Fallback: text-based search using ILIKE
    return fallbackTextSearch(query, limit);
  }
}

/** Simple text-based search fallback (when embeddings are unavailable) */
async function fallbackTextSearch(query: string, limit: number) {
  const members = await db.member.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { businessName: { contains: query, mode: "insensitive" } },
        { natureOfBusiness: { contains: query, mode: "insensitive" } },
        { designation: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
  });

  // Return with a dummy similarity score for consistent API shape
  return members.map((m) => ({ ...m, similarity: 0.5 }));
}

/**
 * Sync a single member's embedding. Called after create/update.
 */
export async function syncMemberEmbedding(memberId: string) {
  const member = await db.member.findUnique({ where: { id: memberId } });
  if (!member) return;

  const content = generateMemberEmbeddingText(member);
  const vector = await generateEmbedding(content);
  const vectorStr = `[${vector.join(",")}]`;

  // Upsert the embedding using raw SQL (Prisma can't handle vector type directly)
  await db.$executeRawUnsafe(
    `INSERT INTO "MemberEmbedding" ("memberId", "content", "vector", "updatedAt")
     VALUES ($1, $2, $3::vector, NOW())
     ON CONFLICT ("memberId")
     DO UPDATE SET "content" = $2, "vector" = $3::vector, "updatedAt" = NOW()`,
    memberId,
    content,
    vectorStr
  );
}

/**
 * Sync embeddings for ALL members. Used during initial migration/seed.
 */
export async function syncAllEmbeddings() {
  const members = await db.member.findMany();
  let synced = 0;

  for (const member of members) {
    try {
      await syncMemberEmbedding(member.id);
      synced++;
    } catch (err) {
      console.error(`Failed to sync embedding for member ${member.id}:`, err);
    }
  }

  return { total: members.length, synced };
}
