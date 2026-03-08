import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MemberDirectoryClient } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Directory",
  description:
    "Browse and search the PBA Korea member directory — find Pakistani businesses in Korea.",
};

export default async function MembersPage() {
  const members = await db.member.findMany({
    orderBy: { name: "asc" },
  });

  return <MemberDirectoryClient initialMembers={members} />;
}
