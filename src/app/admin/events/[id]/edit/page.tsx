import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditEventForm } from "./form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await db.event.findUnique({ where: { id } });
  if (!event) notFound();

  return <EditEventForm event={event} />;
}
