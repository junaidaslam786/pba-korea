"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MemberSearch } from "@/components/members/member-search";
import { MemberCard } from "@/components/members/member-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import type { MemberPublic } from "@/types";

interface Props {
  initialMembers: MemberPublic[];
}

export function MemberDirectoryClient({ initialMembers }: Props) {
  const [members, setMembers] = useState<MemberPublic[]>(initialMembers);
  const [isFiltered, setIsFiltered] = useState(false);

  return (
    <>
      <PageHeader
        title="Member Directory"
        description="Search our network of Pakistani businesses and professionals in Korea using AI-powered semantic search."
      />

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-10">
            <MemberSearch
              onResults={(results) => {
                setMembers(results);
                setIsFiltered(true);
              }}
              onReset={() => {
                setMembers(initialMembers);
                setIsFiltered(false);
              }}
            />
            {isFiltered && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Showing {members.length} result{members.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Member Grid */}
          {members.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No members found.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, i) => (
                <AnimatedSection key={member.id} delay={Math.min(i * 0.05, 0.5)}>
                  <MemberCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
