import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Membership",
  description: "Join PBA Korea and unlock business opportunities in Korea.",
};

const benefits = [
  "Access to the full member directory and business network",
  "Invitations to exclusive networking events",
  "Business support and mentorship from experienced professionals",
  "Listing in our searchable member directory with QR code",
  "Opportunities for bilateral trade and partnerships",
  "Community support for navigating the Korean business landscape",
  "Priority access to training and workshop programs",
  "Representation in Pakistan-Korea business dialogues",
];

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        title="Membership"
        description="Join the leading platform for Pakistani businesses in Korea."
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-start">
            {/* Benefits */}
            <AnimatedSection direction="left">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Benefits of Membership
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="mt-0.5 shrink-0 text-pba-600"
                    />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* CTA Card */}
            <AnimatedSection direction="right">
              <div className="rounded-2xl bg-linear-to-br from-pba-50 to-pba-100 border border-pba-200 p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-pba-900 mb-4">
                  Request Membership
                </h3>
                <p className="text-pba-700 leading-relaxed mb-8">
                  To apply for PBA Korea membership, please contact us with your
                  details. Our team will review your application and get back to you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Contact Us <ArrowRight size={18} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
