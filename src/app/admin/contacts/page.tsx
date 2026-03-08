import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import { formatDate } from "@/lib/utils";

export default async function AdminContactsPage() {
  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Contact Submissions ({submissions.length})
      </h1>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No contact submissions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">{sub.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(sub.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{sub.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                  {sub.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
