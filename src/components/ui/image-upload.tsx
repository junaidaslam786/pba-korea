"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  category: "members" | "events" | "posts";
}

export function ImageUpload({ name, defaultValue, category }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed");
        } else {
          setUrl(data.url);
        }
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [category],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleRemove() {
    setUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {/* Hidden input that carries the URL value into the form submission */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative inline-block">
          <img
            src={url}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover border"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              Uploading…
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <ImageIcon size={32} className="text-gray-400" />
              <span>Drop an image here or click to upload</span>
              <span className="text-xs text-gray-400">
                JPEG, PNG, WebP, GIF — max 5 MB
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {url && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} className="mr-1" /> Change Image
        </Button>
      )}
    </div>
  );
}
