// app/dashboard/layout.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import { checkUser, signOut } from "@/app/actions/auth";
import type { Users } from "@/lib/definitions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await checkUser();

        // kalau user belum punya role → arahkan dulu ke setup
        if (!u.role) {
          router.replace("/role-setup");
          return;
        }

        setUser(u);
      } catch (err) {
        // kalau token invalid / belum login
        router.replace("/auth?login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth?login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Memuat dashboard...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="w-full max-w-[1400px] mx-auto">
        {/* NAV MOBILE (atas konten) */}
        <DashboardMobileNav />

        {/* SIDEBAR + KONTEN */}
        <div className="flex gap-8">
          {/* Sidebar desktop only */}
          <div className="hidden md:block shrink-0">
            <DashboardSidebar role={user.role ?? "staff"} onLogout={handleLogout} />
          </div>

          {/* Konten utama */}
          <div className="flex-1 space-y-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
