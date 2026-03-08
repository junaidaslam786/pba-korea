import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditExecutiveForm } from "./form";

export const dynamic = "force-dynamic";

export default async function EditExecutivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await db.executiveMember.findUnique({ where: { id } });
  if (!member) notFound();

  return <EditExecutiveForm member={member} />;
}
