import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminExecutivePage() {
  const members = await db.executiveMember.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Executive Body ({members.length})
        </h1>
        <Link href="/admin/executive/new">
          <Button>
            <Plus size={16} className="mr-2" /> Add Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium">Photo</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Designation
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Order</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50">
                    <td className="py-2 px-4">
                      {m.imageUrl ? (
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          —
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{m.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {m.designation}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          m.category === "LEADER" ? "default" : "secondary"
                        }
                      >
                        {m.category === "LEADER" ? "Leader" : "Management"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {m.sortOrder}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/executive/${m.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No executive members yet.
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
