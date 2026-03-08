"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  MessageSquare,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/executive", label: "Executive Body", icon: Shield },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/contacts", label: "Contact Submissions", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-gray-50/50">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-pba-800">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">PBA Korea Management</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-pba-100 text-pba-800 font-medium"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                }`}
              >
                <link.icon size={18} />
                {link.label}
                {isActive && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
