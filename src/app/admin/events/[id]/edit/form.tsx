"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateEvent, deleteEvent } from "@/actions/events";
import { Loader2, Trash2 } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string | null;
  imageUrl: string | null;
}

export function EditEventForm({ event }: { event: EventData }) {
  const router = useRouter();

  async function handleUpdate(_prev: unknown, formData: FormData) {
    const result = await updateEvent(event.id, formData);
    if (result?.error) return result;
    router.push("/admin/events");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  async function handleDelete() {
    if (!confirm("Delete this event? This action cannot be undone.")) return;
    await deleteEvent(event.id);
    router.push("/admin/events");
    router.refresh();
  }

  // Format date for datetime-local input
  const dateStr = event.date.toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
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
              <Input id="title" name="title" defaultValue={event.title} required />
            </div>
            <div>
              <label htmlFor="date" className="text-sm font-medium mb-1.5 block">Date</label>
              <Input id="date" name="date" type="datetime-local" defaultValue={dateStr} required />
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-medium mb-1.5 block">Location</label>
              <Input id="location" name="location" defaultValue={event.location} required />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea id="description" name="description" rows={5} defaultValue={event.description ?? ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Event Image</label>
              <ImageUpload
                name="imageUrl"
                defaultValue={event.imageUrl ?? ""}
                category="events"
              />
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
