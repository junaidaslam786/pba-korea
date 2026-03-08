"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Target, Eye, Heart } from "lucide-react";

const values = [
  {
    icon: <Target size={28} />,
    title: "Our Mission",
    description:
      "To enhance the business environment for Pakistani entrepreneurs and professionals in Korea by providing support, resources, and opportunities for growth and development.",
  },
  {
    icon: <Eye size={28} />,
    title: "Our Vision",
    description:
      "To be the leading platform for Pakistani businesses and professionals in Korea, driving economic growth and fostering a sense of community.",
  },
  {
    icon: <Heart size={28} />,
    title: "Our Values",
    description:
      "Integrity, collaboration, and excellence — building bridges between Pakistan and Korea through trusted business relationships and cultural exchange.",
  },
];

export function MissionVision() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Who We Are"
            subtitle="Building bridges between Pakistani and Korean business communities"
          />
        </AnimatedSection>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {values.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.15}>
              <div className="group relative rounded-2xl border border-border p-8 hover:border-pba-300 hover:shadow-lg transition-all duration-300">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pba-100 text-pba-700 group-hover:bg-pba-600 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
