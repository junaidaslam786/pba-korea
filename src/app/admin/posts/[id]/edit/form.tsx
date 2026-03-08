"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Trash2 } from "lucide-react";

interface PostData {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
}

export function EditPostForm({ post }: { post: PostData }) {
  const router = useRouter();

  async function handleUpdate(_prev: unknown, formData: FormData) {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
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
      return { error: data.error ?? "Failed to update" };
    }
    router.push("/admin/posts");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  async function handleDelete() {
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 size={14} className="mr-1" /> Delete
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium mb-1.5 block">Title</label>
              <Input id="title" name="title" required defaultValue={post.title} />
            </div>
            <div>
              <label htmlFor="excerpt" className="text-sm font-medium mb-1.5 block">Excerpt</label>
              <Input id="excerpt" name="excerpt" defaultValue={post.excerpt ?? ""} />
            </div>
            <div>
              <label htmlFor="content" className="text-sm font-medium mb-1.5 block">Content (HTML)</label>
              <Textarea id="content" name="content" rows={12} required defaultValue={post.content} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Post Image</label>
              <ImageUpload
                name="imageUrl"
                defaultValue={post.imageUrl ?? ""}
                category="posts"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={post.published}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="published" className="text-sm font-medium">Published</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
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
