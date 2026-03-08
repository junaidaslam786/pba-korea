"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportMembersPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleImport() {
    if (!file) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/members/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (data.imported > 0) {
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Import Members</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns:
            <br />
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              membershipNumber, name, designation, businessName, natureOfBusiness, address, phone, website
            </code>
          </p>

          <div className="border-2 border-dashed rounded-xl p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block mx-auto text-sm"
            />
            {file && (
              <p className="mt-2 text-sm text-pba-700 font-medium">{file.name}</p>
            )}
          </div>

          <Button onClick={handleImport} disabled={!file || isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing…
              </>
            ) : (
              "Import Members"
            )}
          </Button>

          {result && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-green-600" />
                {result.imported} members imported successfully.
              </div>
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
