"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, MapPin } from "lucide-react";
import type { MemberPublic } from "@/types";

export function MemberCard({ member }: { member: MemberPublic }) {
  return (
    <Link href={`/members/${member.id}`}>
      <Card className="h-full group cursor-pointer hover:border-pba-300 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
              {member.profileImage ? (
                <Image
                  src={member.profileImage}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-pba-600 bg-pba-100">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-pba-700 transition-colors truncate">
                {member.name}
              </h3>
              <p className="text-sm text-pba-600 font-medium truncate">
                {member.designation}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="shrink-0" />
              <span className="truncate">{member.businessName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={14} className="shrink-0" />
              <span className="truncate">{member.natureOfBusiness}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{member.address}</span>
            </div>
          </div>

          <div className="mt-4">
            <Badge variant="outline" className="text-xs">
              #{member.membershipNumber}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
