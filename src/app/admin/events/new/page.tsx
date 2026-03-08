"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { createEvent } from "@/actions/events";
import { Loader2 } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();

  async function action(_prev: unknown, formData: FormData) {
    const result = await createEvent(formData);
    if (result?.error) return result;
    router.push("/admin/events");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Event</h1>
      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <form action={formAction} className="space-y-4">
            <EventFields />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Event
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

export function EventFields({
  defaults,
}: {
  defaults?: Record<string, string>;
}) {
  return (
    <>
      <div>
        <label htmlFor="title" className="text-sm font-medium mb-1.5 block">
          Title <span className="text-red-500">*</span>
        </label>
        <Input id="title" name="title" required defaultValue={defaults?.title ?? ""} />
      </div>
      <div>
        <label htmlFor="date" className="text-sm font-medium mb-1.5 block">
          Date <span className="text-red-500">*</span>
        </label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          required
          defaultValue={defaults?.date ?? ""}
        />
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium mb-1.5 block">
          Location <span className="text-red-500">*</span>
        </label>
        <Input
          id="location"
          name="location"
          required
          defaultValue={defaults?.location ?? ""}
        />
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium mb-1.5 block">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={defaults?.description ?? ""}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Event Image
        </label>
        <ImageUpload
          name="imageUrl"
          defaultValue={defaults?.imageUrl}
          category="events"
        />
      </div>
    </>
  );
}
