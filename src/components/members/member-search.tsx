"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Loader2 } from "lucide-react";
import type { MemberPublic } from "@/types";

interface MemberSearchProps {
  onResults: (members: MemberPublic[]) => void;
  onReset: () => void;
}

export function MemberSearch({ onResults, onReset }: MemberSearchProps) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSearch() {
    if (!query.trim()) {
      onReset();
      return;
    }

    startTransition(async () => {
      const res = await fetch(
        `/api/members/search?q=${encodeURIComponent(query.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        onResults(data.members ?? data);
      }
    });
  }

  return (
    <div className="flex gap-2 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder='Search members — try "textile exporters in Seoul"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} disabled={isPending}>
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Sparkles size={18} />
        )}
        <span className="hidden sm:inline ml-1">
          {isPending ? "Searching..." : "Search"}
        </span>
      </Button>
      {query && (
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            onReset();
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
