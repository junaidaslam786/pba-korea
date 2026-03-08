import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Target, Eye, Handshake, TrendingUp, Globe, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about PBA Korea — our mission, vision, and commitment to Pakistani entrepreneurs in Korea.",
};

const highlights = [
  {
    icon: <Handshake size={24} />,
    title: "Business Networking",
    desc: "Regular events connecting Pakistani entrepreneurs with Korean businesses and institutions.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Growth Opportunities",
    desc: "Resources, mentorship, and market insights to help your business thrive in Korea.",
  },
  {
    icon: <Globe size={24} />,
    title: "Bilateral Trade",
    desc: "Facilitating trade relations and partnerships between Pakistan and South Korea.",
  },
  {
    icon: <Users size={24} />,
    title: "Community Support",
    desc: "A welcoming community for Pakistani professionals navigating the Korean business landscape.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Us"
        description="Building bridges between Pakistani and Korean business communities since our founding."
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 items-start">
            {/* Mission */}
            <AnimatedSection direction="left">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-pba-100 px-4 py-1.5 text-sm font-medium text-pba-700">
                  <Target size={16} /> Our Mission
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Empowering Pakistani Businesses in Korea
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to enhance the business environment for Pakistani
                  entrepreneurs and professionals in Korea by providing support,
                  resources, and opportunities for growth and development. We connect
                  businesses, facilitate trade, and build lasting relations between
                  the two nations.
                </p>
              </div>
            </AnimatedSection>

            {/* Vision */}
            <AnimatedSection direction="right">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-pba-100 px-4 py-1.5 text-sm font-medium text-pba-700">
                  <Eye size={16} /> Our Vision
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Leading Platform for Pakistani-Korean Business
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our vision is to be the leading platform for Pakistani businesses
                  and professionals in Korea, driving economic growth and fostering a
                  sense of community. We aim to be the first point of contact for
                  anyone looking to explore business opportunities between Pakistan
                  and South Korea.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Highlights */}
          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="rounded-xl border border-border p-6 hover:border-pba-300 hover:shadow-md transition-all">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pba-100 text-pba-700">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
