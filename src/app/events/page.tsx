import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events organised by PBA Korea.",
};

export default async function EventsPage() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    db.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
    }),
    db.event.findMany({
      where: { date: { lt: now } },
      orderBy: { date: "desc" },
      take: 12,
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Events"
        description="Networking meetups, trade exhibitions, and cultural events connecting the Pakistani business community in Korea."
      />

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Upcoming Events</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event, i) => (
                  <AnimatedSection key={event.id} delay={i * 0.05}>
                    <EventCard event={event} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Past Events</h2>
            {past.length === 0 ? (
              <p className="text-muted-foreground">No past events yet.</p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event, i) => (
                  <AnimatedSection key={event.id} delay={i * 0.05}>
                    <EventCard event={event} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function EventCard({ event }: { event: { id: string; title: string; slug: string; date: Date; location: string; description: string | null; imageUrl: string | null } }) {
  const isPast = event.date < new Date();
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="h-full group hover:border-pba-300 transition-all overflow-hidden">
        {event.imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Past" : "Upcoming"}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-pba-700 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {event.location}
            </div>
          </div>
          {event.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
          <div className="mt-4 text-sm font-medium text-pba-700 flex items-center gap-1">
            View Details <ArrowRight size={14} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
