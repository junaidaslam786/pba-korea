"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { createExecutiveMember } from "@/actions/executive";
import { Loader2 } from "lucide-react";

export default function NewExecutivePage() {
  const router = useRouter();

  async function action(_prev: unknown, formData: FormData) {
    const result = await createExecutiveMember(formData);
    if (result?.error) return result;
    router.push("/admin/executive");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Executive Member</h1>

      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                Name <span className="text-red-500">*</span>
              </label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="designation" className="text-sm font-medium mb-1.5 block">
                Designation <span className="text-red-500">*</span>
              </label>
              <Input id="designation" name="designation" required />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium mb-1.5 block">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="LEADER">Leader (shown with photo)</option>
                <option value="MANAGEMENT">Management Team</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder" className="text-sm font-medium mb-1.5 block">
                Sort Order
              </label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue="0" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Photo</label>
              <ImageUpload name="imageUrl" category="members" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
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
