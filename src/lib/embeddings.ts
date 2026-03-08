import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Build a searchable text blob from a member's fields.
 * This is what gets embedded into the vector DB for semantic search.
 */
export function generateMemberEmbeddingText(member: {
  name: string;
  businessName: string;
  natureOfBusiness: string;
  designation: string;
  address: string;
}): string {
  return [
    `Name: ${member.name}`,
    `Business: ${member.businessName}`,
    `Industry: ${member.natureOfBusiness}`,
    `Role: ${member.designation}`,
    `Location: ${member.address}`,
  ].join(". ");
}

/**
 * Call the OpenAI Embeddings API to get a 1536-dim vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}
