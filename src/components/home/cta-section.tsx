"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-linear-to-br from-pba-800 to-pba-950 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to grow your business in Korea?
          </h2>
          <p className="mt-6 text-lg text-pba-200 max-w-2xl mx-auto">
            Join the Pakistan Business Association Korea today and gain access
            to a powerful network of entrepreneurs, resources, and opportunities.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-pba-900 hover:bg-pba-50 font-semibold">
              <Link href="/membership">
                Become a Member <ArrowRight size={18} className="ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-pba-400/50 text-white hover:bg-pba-700/30 hover:text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
