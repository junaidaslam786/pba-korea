"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  await db.contactSubmission.create({ data: result.data });

  return { success: true };
}
