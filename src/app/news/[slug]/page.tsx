import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <>
      <PageHeader title={post.title} description={formatDate(post.createdAt)} />

      <article className="py-12 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/news">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={16} className="mr-2" /> All News
            </Button>
          </Link>

          {post.imageUrl && (
            <div className="relative aspect-video overflow-hidden rounded-2xl mb-8">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div className="prose prose-green max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>
    </>
  );
}
