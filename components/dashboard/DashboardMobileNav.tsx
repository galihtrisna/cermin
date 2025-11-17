// components/dashboard/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Video, Award, Settings, Calendar } from "lucide-react";

const items = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Event", href: "/dashboard/event", icon: Calendar },
  { label: "Sertifikat", href: "/dashboard/certificates", icon: Award },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
];

const DashboardMobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden mb-4 -mx-1">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-1.5
                px-3 py-2
                rounded-full text-xs font-medium
                whitespace-nowrap
                border
                transition
                ${
                  active
                    ? "pastel-gradient border-transparent text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "bg-white/70 border-[#E4E7F5] text-[#34427099] hover:bg-white"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardMobileNav;
