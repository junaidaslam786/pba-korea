"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { updateMember, deleteMember, regenerateQRCode } from "@/actions/members";
import { Loader2, Trash2, QrCode } from "lucide-react";
import type { MemberPublic } from "@/types";

export function EditMemberForm({ member }: { member: MemberPublic & { phone?: string | null; website?: string | null; profileImage?: string | null } }) {
  const router = useRouter();

  async function handleUpdate(_prev: unknown, formData: FormData) {
    const result = await updateMember(member.id, formData);
    if (result?.error) return result;
    router.push("/admin/members");
    router.refresh();
    return null;
  }

  const [state, formAction, isPending] = useActionState(handleUpdate, null);

  async function handleDelete() {
    if (!confirm("Delete this member? This action cannot be undone.")) return;
    await deleteMember(member.id);
    router.push("/admin/members");
    router.refresh();
  }

  async function handleRegenQR() {
    await regenerateQRCode(member.id);
    router.refresh();
  }

  const fields = [
    { name: "membershipNumber", label: "Membership #", value: member.membershipNumber },
    { name: "name", label: "Full Name", value: member.name },
    { name: "designation", label: "Designation", value: member.designation },
    { name: "businessName", label: "Business Name", value: member.businessName },
    { name: "natureOfBusiness", label: "Nature of Business", value: member.natureOfBusiness },
    { name: "address", label: "Address", value: member.address },
    { name: "phone", label: "Phone", value: member.phone ?? "" },
    { name: "website", label: "Website", value: member.website ?? "" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Member</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenQR}>
            <QrCode size={14} className="mr-1" /> Regenerate QR
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={14} className="mr-1" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="text-sm font-medium mb-1.5 block">
                  {f.label}
                </label>
                <Input id={f.name} name={f.name} defaultValue={f.value} />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Profile Image</label>
              <ImageUpload
                name="profileImage"
                defaultValue={member.profileImage ?? ""}
                category="members"
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
