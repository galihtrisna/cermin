// components/dashboard/SuperAdminDashboard.tsx

import Link from "next/link";
import { Shield, Users, Settings, ListChecks } from "lucide-react";
import type { Users as UserType } from "@/lib/definitions";

interface SuperAdminDashboardProps {
  user: UserType;
}

export default function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Title & intro */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#344270]">
          Panel Superadmin
        </h2>
        <p className="text-sm text-slate-600">
          Hai {user.name}, kamu memiliki akses penuh untuk mengelola sistem,
          pengguna, dan konfigurasi global.
        </p>
      </div>

      {/* Grid kartu fitur utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link
          href="/superadmin/users"
          className="group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-4 md:p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#344270]">
              Manajemen Pengguna
            </h3>
            <Users className="w-5 h-5 text-[#50A3FB]" />
          </div>
          <p className="text-xs text-slate-600">
            Lihat semua akun organizer, staff, dan set role/akses mereka.
          </p>
        </Link>

        <Link
          href="/superadmin/events"
          className="group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-4 md:p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#344270]">
              Semua Event
            </h3>
            <ListChecks className="w-5 h-5 text-[#50A3FB]" />
          </div>
          <p className="text-xs text-slate-600">
            Monitoring semua event yang dibuat, status pembayaran, dan trafik.
          </p>
        </Link>

        <Link
          href="/superadmin/settings"
          className="group rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm p-4 md:p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#344270]">
              Pengaturan Sistem
            </h3>
            <Settings className="w-5 h-5 text-[#50A3FB]" />
          </div>
          <p className="text-xs text-slate-600">
            Atur konfigurasi global: pembayaran, template sertifikat, dan lain-lain.
          </p>
        </Link>
      </div>

      {/* Info keamanan kecil */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex gap-3 items-start">
        <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-800">
            Akses tingkat tinggi
          </p>
          <p className="text-xs text-amber-700">
            Semua aksi di panel ini idealnya tetap divalidasi di backend
            (cek role superadmin) dan ditrack di audit log.
          </p>
        </div>
      </div>
    </div>
  );
}
