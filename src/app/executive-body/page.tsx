import type { Metadata } from "next";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Executive Body",
  description:
    "Meet the leadership team of Pakistan Business Association Korea.",
};

export default async function ExecutiveBodyPage() {
  const allMembers = await db.executiveMember.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const leaders = allMembers.filter((m) => m.category === "LEADER");
  const management = allMembers.filter((m) => m.category === "MANAGEMENT");

  return (
    <>
      <PageHeader
        title="Executive Body"
        description="PBA Korea is led by dedicated professionals and economic experts driving Pakistani businesses forward every day."
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Leadership Cards */}
          {leaders.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {leaders.map((leader, i) => (
                <AnimatedSection key={leader.id} delay={i * 0.15}>
                  <div className="group rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {leader.imageUrl ? (
                        <img
                          src={leader.imageUrl}
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                          {leader.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-bold text-foreground">
                        {leader.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-pba-600">
                        {leader.designation}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Management Team */}
          {management.length > 0 && (
            <AnimatedSection delay={0.3}>
              <div className="mt-16 rounded-2xl border border-border p-8 max-w-3xl mx-auto">
                <h3 className="text-xl font-bold text-foreground text-center mb-8">
                  Management Team
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {management.map((pos) => (
                    <div
                      key={pos.id}
                      className="flex justify-between items-center rounded-lg bg-muted/50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        {pos.designation}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {pos.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {allMembers.length === 0 && (
            <p className="text-center text-muted-foreground">
              Executive body information coming soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
