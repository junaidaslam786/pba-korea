"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  imageUrl: z.string().optional(),
  category: z.enum(["LEADER", "MANAGEMENT"]),
  sortOrder: z.coerce.number().int().default(0),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createExecutiveMember(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  await db.executiveMember.create({
    data: {
      name: result.data.name,
      designation: result.data.designation,
      imageUrl: result.data.imageUrl || null,
      category: result.data.category,
      sortOrder: result.data.sortOrder,
    },
  });

  revalidatePath("/admin/executive");
  revalidatePath("/executive-body");

  return { success: true };
}

export async function updateExecutiveMember(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  await db.executiveMember.update({
    where: { id },
    data: {
      name: result.data.name,
      designation: result.data.designation,
      imageUrl: result.data.imageUrl || null,
      category: result.data.category,
      sortOrder: result.data.sortOrder,
    },
  });

  revalidatePath("/admin/executive");
  revalidatePath("/executive-body");

  return { success: true };
}

export async function deleteExecutiveMember(id: string) {
  await requireAdmin();

  await db.executiveMember.delete({ where: { id } });

  revalidatePath("/admin/executive");
  revalidatePath("/executive-body");
}
