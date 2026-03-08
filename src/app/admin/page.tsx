import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import { Users, CalendarDays, FileText, MessageSquare, Shield } from "lucide-react";

export default async function AdminDashboard() {
  const [memberCount, eventCount, postCount, contactCount, executiveCount] = await Promise.all([
    db.member.count(),
    db.event.count(),
    db.post.count(),
    db.contactSubmission.count(),
    db.executiveMember.count(),
  ]);

  const stats = [
    { label: "Total Members", value: memberCount, icon: Users, color: "text-pba-700 bg-pba-100" },
    { label: "Executive Body", value: executiveCount, icon: Shield, color: "text-teal-700 bg-teal-100" },
    { label: "Events", value: eventCount, icon: CalendarDays, color: "text-blue-700 bg-blue-100" },
    { label: "Posts", value: postCount, icon: FileText, color: "text-amber-700 bg-amber-100" },
    { label: "Contact Submissions", value: contactCount, icon: MessageSquare, color: "text-purple-700 bg-purple-100" },
  ];

  const recentMembers = await db.member.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Members */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            <div className="divide-y">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.businessName} — #{member.membershipNumber}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {member.createdAt.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
