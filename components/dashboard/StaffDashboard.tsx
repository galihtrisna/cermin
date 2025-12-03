// components/dashboard/StaffDashboard.tsx
import type { Users } from "@/lib/definitions";

interface Props {
  user: Users;
}

export default function StaffDashboard({ user }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-slate-900">
        Dashboard Staff
      </h2>
      <p className="text-sm text-slate-600">
        Hai {user.name}, di sini nanti kamu bisa:
      </p>
      <ul className="text-sm text-slate-600 list-disc pl-4 space-y-1">
        <li>Lihat daftar event yang kamu ikuti.</li>
        <li>Cek status pembayaran & kehadiran.</li>
        <li>Akses & download sertifikat.</li>
      </ul>
      {/* ke depannya tinggal tambahin komponen tabel khusus staff */}
    </div>
  );
}
