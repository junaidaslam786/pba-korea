import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  ArrowLeft,
  QrCode,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const member = await db.member.findUnique({ where: { id } });
  if (!member) return { title: "Member Not Found" };
  return {
    title: `${member.name} — PBA Korea`,
    description: `${member.designation} at ${member.businessName}`,
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  const member = await db.member.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <>
      <PageHeader title={member.name} description={member.designation} />

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/members">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft size={16} className="mr-2" /> Back to Directory
            </Button>
          </Link>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Left: photo + QR */}
            <div className="md:col-span-1 space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                {member.profileImage ? (
                  <Image
                    src={member.profileImage}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-pba-600 bg-pba-100">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              {member.qrCodeUrl && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <QrCode size={16} /> QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={member.qrCodeUrl}
                      alt="Member QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Detail
                    icon={<Building2 size={18} />}
                    label="Business Name"
                    value={member.businessName}
                  />
                  <Detail
                    icon={<Briefcase size={18} />}
                    label="Nature of Business"
                    value={member.natureOfBusiness}
                  />
                  <Detail
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={member.address}
                  />
                  {member.phone && (
                    <Detail
                      icon={<Phone size={18} />}
                      label="Phone"
                      value={member.phone}
                    />
                  )}
                  {member.website && (
                    <Detail
                      icon={<Globe size={18} />}
                      label="Website"
                      value={
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pba-700 underline"
                        >
                          {member.website}
                        </a>
                      }
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Badge>#{member.membershipNumber}</Badge>
                  <Badge variant="secondary">{member.designation}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="text-pba-600 mt-0.5">{icon}</div>
      <div>
        <p className="font-medium text-muted-foreground">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}
