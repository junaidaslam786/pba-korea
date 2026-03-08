import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({ orderBy: { date: "desc" } });
  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events ({events.length})</h1>
        <Link href="/admin/events/new">
          <Button>
            <Plus size={16} className="mr-2" /> Add Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium">{event.title}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {formatDate(event.date)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {event.location}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={event.date >= now ? "default" : "secondary"}>
                        {event.date >= now ? "Upcoming" : "Past"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No events yet.
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
