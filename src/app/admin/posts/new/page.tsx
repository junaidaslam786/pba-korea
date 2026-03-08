"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();

  async function action(_prev: unknown, formData: FormData) {
    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        excerpt: formData.get("excerpt"),
        imageUrl: formData.get("imageUrl"),
        published: formData.get("published") === "on",
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const data = await res.json();
      return { error: data.error ?? "Failed to create post" };
    }
    router.push("/admin/posts");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Post</h1>
      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <form action={formAction} className="space-y-4">
            <PostFields />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Post
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PostFields({ defaults }: { defaults?: Record<string, string | boolean> }) {
  return (
    <>
      <div>
        <label htmlFor="title" className="text-sm font-medium mb-1.5 block">
          Title <span className="text-red-500">*</span>
        </label>
        <Input id="title" name="title" required defaultValue={(defaults?.title as string) ?? ""} />
      </div>
      <div>
        <label htmlFor="excerpt" className="text-sm font-medium mb-1.5 block">Excerpt</label>
        <Input id="excerpt" name="excerpt" defaultValue={(defaults?.excerpt as string) ?? ""} />
      </div>
      <div>
        <label htmlFor="content" className="text-sm font-medium mb-1.5 block">
          Content (HTML) <span className="text-red-500">*</span>
        </label>
        <Textarea id="content" name="content" rows={12} required defaultValue={(defaults?.content as string) ?? ""} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">Post Image</label>
        <ImageUpload
          name="imageUrl"
          defaultValue={(defaults?.imageUrl as string) || undefined}
          category="posts"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={defaults?.published === true}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="published" className="text-sm font-medium">Published</label>
      </div>
    </>
  );
}
