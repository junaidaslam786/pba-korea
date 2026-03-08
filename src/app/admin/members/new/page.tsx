"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { createMember } from "@/actions/members";
import { Loader2 } from "lucide-react";

export default function NewMemberPage() {
  const router = useRouter();

  async function action(_prev: unknown, formData: FormData) {
    const result = await createMember(formData);
    if (result?.error) return result;
    router.push("/admin/members");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Member</h1>

      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <MemberFields />
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Member
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

export function MemberFields({
  defaults,
}: {
  defaults?: Record<string, string>;
}) {
  const fields = [
    { name: "membershipNumber", label: "Membership #", required: true },
    { name: "name", label: "Full Name", required: true },
    { name: "designation", label: "Designation", required: true },
    { name: "businessName", label: "Business Name", required: true },
    { name: "natureOfBusiness", label: "Nature of Business", required: true },
    { name: "address", label: "Address", required: true },
    { name: "phone", label: "Phone" },
    { name: "website", label: "Website" },
  ];

  return (
    <>
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="text-sm font-medium mb-1.5 block">
            {f.label}
            {f.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <Input
            id={f.name}
            name={f.name}
            required={f.required}
            defaultValue={defaults?.[f.name] ?? ""}
          />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium mb-1.5 block">Profile Image</label>
        <ImageUpload
          name="profileImage"
          defaultValue={defaults?.profileImage}
          category="members"
        />
      </div>
    </>
  );
}
