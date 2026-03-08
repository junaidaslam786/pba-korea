import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PBA Korea — Pakistan Business Association Korea",
    template: "%s | PBA Korea",
  },
  description:
    "Pakistan Business Association Korea — enhancing the business environment for Pakistani entrepreneurs and professionals in Korea by providing support, resources, and opportunities for growth.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pbakorea.org"),
  openGraph: {
    title: "PBA Korea — Pakistan Business Association Korea",
    description:
      "Leading platform for Pakistani businesses in Korea, driving economic growth and fostering community.",
    siteName: "PBA Korea",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jakarta.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
