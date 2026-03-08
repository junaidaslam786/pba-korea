import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditMemberForm } from "./form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const member = await db.member.findUnique({ where: { id } });
  if (!member) notFound();

  return <EditMemberForm member={member} />;
}
