"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = eventSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  const slug = slugify(result.data.title);

  await db.event.create({
    data: {
      title: result.data.title,
      slug,
      date: new Date(result.data.date),
      location: result.data.location,
      description: result.data.description || null,
      imageUrl: result.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");

  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const result = eventSchema.safeParse(raw);
  if (!result.success) {
    return { error: "Validation failed. Please check all required fields." };
  }

  const slug = slugify(result.data.title);

  await db.event.update({
    where: { id },
    data: {
      title: result.data.title,
      slug,
      date: new Date(result.data.date),
      location: result.data.location,
      description: result.data.description || null,
      imageUrl: result.data.imageUrl || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");

  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  await db.event.delete({ where: { id } });

  revalidatePath("/admin/events");
  revalidatePath("/events");

  return { success: true };
}
