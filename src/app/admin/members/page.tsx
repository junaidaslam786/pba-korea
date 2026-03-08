import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";

export default async function AdminMembersPage() {
  const members = await db.member.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Members ({members.length})</h1>
        <div className="flex gap-2">
          <Link href="/admin/members/import">
            <Button variant="outline">
              <Upload size={16} className="mr-2" /> Import CSV
            </Button>
          </Link>
          <Link href="/admin/members/new">
            <Button>
              <Plus size={16} className="mr-2" /> Add Member
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium">#</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Business</th>
                  <th className="text-left py-3 px-4 font-medium">Designation</th>
                  <th className="text-left py-3 px-4 font-medium">QR</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <Badge variant="outline">{member.membershipNumber}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {member.businessName}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {member.designation}
                    </td>
                    <td className="py-3 px-4">
                      {member.qrCodeUrl ? (
                        <Badge variant="secondary">Generated</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/members/${member.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No members yet. Add your first member.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
