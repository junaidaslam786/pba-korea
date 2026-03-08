"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone } from "lucide-react";
import { submitContactForm } from "@/actions/contact";
import { useActionState } from "react";

function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success?: boolean; error?: unknown } | null, formData: FormData) => {
      return submitContactForm(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
        <Input id="subject" name="subject" required />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
        <Textarea id="message" name="message" rows={5} required />
      </div>

      {state?.success && (
        <p className="text-sm text-pba-600 font-medium">Thank you! Your message has been sent.</p>
      )}
      {state?.error && (
        <p className="text-sm text-red-600">Please fix the errors above and try again.</p>
      )}

      <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Get in touch with PBA Korea — we'd love to hear from you."
      />

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Form */}
            <AnimatedSection direction="left">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </AnimatedSection>

            {/* Office Locations */}
            <AnimatedSection direction="right">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Our Offices
              </h2>
              <div className="space-y-8">
                <div className="rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">Seoul HQ</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-pba-600" />
                      Seoul Central Mosque Road, Itaewon, Seoul, South Korea
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone size={16} className="shrink-0 text-pba-600" />
                      <a href="tel:+821050125756" className="hover:text-pba-600 transition-colors">
                        +82 10 5012 5756
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-3">Incheon Office</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-pba-600" />
                      Incheon, South Korea
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone size={16} className="shrink-0 text-pba-600" />
                      <a href="tel:+821048803615" className="hover:text-pba-600 transition-colors">
                        +82 10-4880-3615
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
