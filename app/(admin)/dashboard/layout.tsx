// app/dashboard/layout.tsx
"use client";

import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="w-full max-w-[1400px] mx-auto">
        {/* NAV MOBILE (atas konten) */}
        <DashboardMobileNav />

        {/* SIDEBAR + KONTEN */}
        <div className="flex gap-8">
          {/* Sidebar desktop only */}
          <div className="hidden md:block shrink-0">
            <DashboardSidebar />
          </div>

          {/* Konten utama */}
          <div className="flex-1 space-y-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
