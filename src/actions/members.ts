"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateQRCode } from "@/lib/qr";
import { syncMemberEmbedding } from "@/lib/search";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const memberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  businessName: z.string().min(1),
  address: z.string().min(1),
  membershipNumber: z.string().min(1),
  profileImage: z.string().optional(),
  natureOfBusiness: z.string().min(1),
  designation: z.string().min(1),
  website: z.string().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createMember(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = memberSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  // Insert member
  const member = await db.member.create({ data: result.data });

  // Generate QR code
  const qrCodeUrl = await generateQRCode(member.id);
  await db.member.update({
    where: { id: member.id },
    data: { qrCodeUrl },
  });

  // Sync vector embedding (non-blocking — don't fail if OpenAI is down)
  syncMemberEmbedding(member.id).catch(console.error);

  revalidatePath("/admin/members");
  revalidatePath("/members");

  return { success: true, memberId: member.id };
}

export async function updateMember(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = memberSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  await db.member.update({ where: { id }, data: result.data });

  // Re-sync embedding since searchable fields may have changed
  syncMemberEmbedding(id).catch(console.error);

  revalidatePath("/admin/members");
  revalidatePath("/members");
  revalidatePath(`/members/${id}`);

  return { success: true };
}

export async function deleteMember(id: string) {
  await requireAdmin();

  await db.member.delete({ where: { id } });

  revalidatePath("/admin/members");
  revalidatePath("/members");

  return { success: true };
}

export async function regenerateQRCode(id: string) {
  await requireAdmin();

  const qrCodeUrl = await generateQRCode(id);
  await db.member.update({ where: { id }, data: { qrCodeUrl } });

  revalidatePath(`/members/${id}`);
  return { success: true, qrCodeUrl };
}
