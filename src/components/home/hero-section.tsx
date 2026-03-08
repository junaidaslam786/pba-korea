"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-pba-900 via-pba-800 to-pba-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(52,211,153,0.2) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center rounded-full bg-pba-700/40 px-4 py-1.5 text-sm font-medium text-pba-200 mb-6 border border-pba-600/30">
              <Globe size={14} className="mr-2" />
              Connecting Pakistani Businesses in Korea
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
              Pakistan Business{" "}
              <span className="text-pba-300">Association</span>{" "}
              Korea
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-pba-100/90 max-w-xl">
              Dedicated to promoting business relations between Pakistan and Korea,
              providing support to Pakistani businesses, and creating valuable
              networking opportunities for our members.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-pba-900 hover:bg-pba-50 font-semibold">
                <Link href="/membership">
                  Join Us Today <ArrowRight size={18} className="ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-pba-400/50 text-white hover:bg-pba-700/30 hover:text-white"
              >
                <Link href="/members">Explore Members</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 gap-4"
          >
            <StatCard number="96+" label="Active Members" icon={<Users size={24} />} delay={0.3} />
            <StatCard number="11" label="Companies" icon={<Globe size={24} />} delay={0.4} />
            <StatCard number="2" label="Offices in Korea" icon={<Globe size={24} />} delay={0.5} />
            <StatCard number="10+" label="Events Hosted" icon={<Users size={24} />} delay={0.6} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  number,
  label,
  icon,
  delay,
}: {
  number: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center hover:bg-white/15 transition-colors"
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pba-400/20 text-pba-300">
        {icon}
      </div>
      <p className="text-3xl font-bold text-white">{number}</p>
      <p className="mt-1 text-sm text-pba-200">{label}</p>
    </motion.div>
  );
}
