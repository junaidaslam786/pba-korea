import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event Not Found" };
  return { title: event.title, description: event.description ?? undefined };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) notFound();

  const isPast = event.date < new Date();

  return (
    <>
      <PageHeader title={event.title} description={formatDate(event.date)} />

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/events">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={16} className="mr-2" /> All Events
            </Button>
          </Link>

          {event.imageUrl && (
            <div className="relative aspect-video overflow-hidden rounded-2xl mb-8">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Past Event" : "Upcoming"}
            </Badge>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={16} className="text-pba-600" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="text-pba-600" />
                {event.location}
              </div>
              {event.description && (
                <div className="pt-4 border-t prose prose-green max-w-none">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
