import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-pba-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/uploads/branding/logo.png"
                alt="PBA Korea"
                width={48}
                height={48}
                className="rounded-full"
              />
              <h3 className="text-lg font-bold">PBA Korea</h3>
            </Link>
            <p className="text-sm text-pba-200 leading-relaxed">
              Pakistan Business Association Korea — enhancing the business
              environment for Pakistani entrepreneurs and professionals in Korea.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-pba-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Member Directory", href: "/members" },
                { label: "Events", href: "/events" },
                { label: "Join Membership", href: "/membership" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-pba-200 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seoul Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-pba-300">
              Seoul HQ
            </h4>
            <ul className="space-y-3 text-sm text-pba-200">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Seoul Central Mosque Road, Itaewon, Seoul, South Korea</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <a href="tel:+821050125756" className="hover:text-white transition-colors">
                  +82 10 5012 5756
                </a>
              </li>
            </ul>
          </div>

          {/* Incheon Office */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-pba-300">
              Incheon Office
            </h4>
            <ul className="space-y-3 text-sm text-pba-200">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Incheon, South Korea</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <a href="tel:+821048803615" className="hover:text-white transition-colors">
                  +82 10-4880-3615
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-pba-800 pt-8 text-center text-sm text-pba-400">
          <p>
            &copy; {new Date().getFullYear()} Pakistan Business Association Korea.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
