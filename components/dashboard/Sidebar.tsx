// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  Settings,
  LogOut,
  Calendar,
  Users as UsersIcon,
  PlusCircle, // Tambahkan icon Plus
} from "lucide-react";

interface SidebarProps {
  role: string;
  onLogout: () => void;
}

// MAP role → navItems
const navMap: Record<string, any[]> = {
  staff: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Event Diikuti", href: "/dashboard/event", icon: Calendar },
    { label: "Sertifikat", href: "/dashboard/certificates", icon: Award },
  ],

  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    // Arahkan ke halaman LIST
    { label: "Event Saya", href: "/dashboard/event", icon: Calendar },
    // Tambahkan menu baru untuk CREATE
    { label: "Buat Event", href: "/dashboard/event/new", icon: PlusCircle }, 
    { label: "Sertifikat", href: "/dashboard/certificates", icon: Award },
    { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  ],

  superadmin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Event Saya", href: "/dashboard/event", icon: Calendar },
    { label: "Sertifikat", href: "/dashboard/certificates", icon: Award },
    { label: "Kelola Pengguna", href: "/superadmin/users", icon: UsersIcon },
    { label: "Pengaturan Sistem", href: "/superadmin/settings", icon: Settings },
  ],
};

const getNavItems = (role: string) => navMap[role] ?? navMap["staff"];

export default function DashboardSidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <aside className="w-60 lg:w-64 flex-col bg-white/10 border border-white/50 rounded-3xl backdrop-blur-2xl shadow-[0_18px_45px_rgba(15,23,42,0.22)] p-4 md:p-5 h-fit sticky top-28 hidden md:flex">
      <div className="mb-4 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#34427080]">
          Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href; // Ubah logic active agar sub-route tidak otomatis menyalakan parent jika tidak diinginkan, atau biarkan default

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                px-3 py-2.5 rounded-2xl
                text-sm font-medium
                transition-all
                ${
                  active
                    ? "pastel-gradient text-[#344270] shadow-[0_10px_25px_rgba(15,23,42,0.18)]"
                    : "text-[#344270aa] hover:bg-white/40 hover:text-[#344270]"
                }
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-xl
                  ${active ? "bg-white/40" : "bg-white/70 text-[#50A3FB]"}
                `}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium text-[#34427099] hover:bg-white/30 hover:text-red-500 transition"
      >
        <span className="inline-flex w-7 h-7 rounded-xl bg-white/70 items-center justify-center">
          <LogOut className="w-4 h-4" />
        </span>
        Keluar
      </button>
    </aside>
  );
}