import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditPostForm } from "./form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return <EditPostForm post={post} />;
}
