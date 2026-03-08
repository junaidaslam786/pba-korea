import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and announcements from PBA Korea.",
};

export default async function NewsPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="News & Announcements"
        description="Stay up to date with the latest news, achievements, and announcements from PBA Korea."
      />

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No news articles yet. Check back soon!
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.05}>
                  <Link href={`/news/${post.slug}`}>
                    <Card className="h-full group hover:border-pba-300 transition-all overflow-hidden">
                      {post.imageUrl && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatDate(post.createdAt)}
                        </p>
                        <h3 className="text-lg font-semibold group-hover:text-pba-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 text-sm font-medium text-pba-700 flex items-center gap-1">
                          Read More <ArrowRight size={14} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
