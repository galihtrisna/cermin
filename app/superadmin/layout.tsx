// app/superadmin/layout.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardMobileNav from "@/components/dashboard/DashboardMobileNav";
import { checkUser, signOut } from "@/app/actions/auth";
import type { Users } from "@/lib/definitions";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await checkUser();
        if (u.role !== "superadmin") {
          router.replace("/dashboard"); // Tendang jika bukan superadmin
          return;
        }
        setUser(u);
      } catch (err) {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Admin...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="w-full max-w-[1400px] mx-auto">
        <DashboardMobileNav />
        <div className="flex gap-8">
          <div className="hidden md:block shrink-0">
            {/* Pakai role superadmin fix */}
            <DashboardSidebar role="superadmin" onLogout={handleLogout} />
          </div>
          <div className="flex-1 space-y-8">{children}</div>
        </div>
      </div>
    </main>
  );
}