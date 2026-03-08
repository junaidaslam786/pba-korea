"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  updateExecutiveMember,
  deleteExecutiveMember,
} from "@/actions/executive";
import { Loader2, Trash2 } from "lucide-react";

interface ExecutiveData {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
  category: "LEADER" | "MANAGEMENT";
  sortOrder: number;
}

export function EditExecutiveForm({ member }: { member: ExecutiveData }) {
  const router = useRouter();

  async function handleUpdate(_prev: unknown, formData: FormData) {
    const result = await updateExecutiveMember(member.id, formData);
    if (result?.error) return result;
    router.push("/admin/executive");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  async function handleDelete() {
    if (!confirm("Delete this executive member? This action cannot be undone."))
      return;
    await deleteExecutiveMember(member.id);
    router.push("/admin/executive");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Executive Member</h1>
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
              <label
                htmlFor="name"
                className="text-sm font-medium mb-1.5 block"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={member.name}
              />
            </div>
            <div>
              <label
                htmlFor="designation"
                className="text-sm font-medium mb-1.5 block"
              >
                Designation
              </label>
              <Input
                id="designation"
                name="designation"
                required
                defaultValue={member.designation}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium mb-1.5 block"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={member.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="LEADER">Leader (shown with photo)</option>
                <option value="MANAGEMENT">Management Team</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sortOrder"
                className="text-sm font-medium mb-1.5 block"
              >
                Sort Order
              </label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={member.sortOrder}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Photo</label>
              <ImageUpload
                name="imageUrl"
                defaultValue={member.imageUrl ?? ""}
                category="members"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
