// "use client";

// import Link from "next/link";
// import { Users, DollarSign, Plus, Calendar } from "lucide-react";
// import StatsCard from "@/components/dashboard/StatsCard";
// import EventTable, { type EventRow } from "@/components/dashboard/EventTable";

// export default function DashboardPage() {
//   const stats = {
//     activeEvents: 1,
//     totalParticipants: 2,
//     totalRevenue: 55000,
//   };

//   const events: EventRow[] = [
//     {
//       id: "1",
//       title: "Digital Marketing 2025",
//       date: "10 Oktober 2025",
//       price: 55000,
//       participants: "25/100",
//       status: "Aktif",
//     },
//   ];

//   return (
//     <>
//       <div className="flex items-center justify-between gap-4">
//         <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
//           Dashboard
//         </h1>

//         <Link
//           href="/dashboard/event/new"
//           className="
//             inline-flex items-center gap-2
//             rounded-full
//             bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
//             text-white font-semibold
//             px-4 md:px-6 py-2.5
//             shadow-[0_14px_32px_rgba(80,163,251,0.55)]
//             hover:opacity-95
//             transition
//           "
//         >
//           <Plus className="w-4 h-4" />
//           <span>Buat Event Baru</span>
//         </Link>
//       </div>

//       {/* Stats */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//         <StatsCard
//           label="Event Aktif"
//           value={stats.activeEvents}
//           icon={<Calendar className="w-5 h-5 text-[#344270]" />}
//         />

//         <StatsCard
//           label="Total Peserta"
//           value={stats.totalParticipants}
//           icon={<Users className="w-5 h-5 text-[#344270]" />}
//         />

//         <StatsCard
//           label="Total Pendapatan"
//           value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
//           icon={<DollarSign className="w-5 h-5 text-[#344270]" />}
//         />
//       </section>

//       {/* Table Event */}
//       <EventTable events={events} />
//     </>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { checkUser, signOut } from "@/app/actions/auth";
// import type { Users } from "@/lib/definitions";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState<Users | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const u = await checkUser();

//         if (!u.role) {
//           router.replace("/role-setup");
//           return;
//         }

//         setUser(u);
//       } catch (err) {
//         router.replace("/auth?login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [router]);

//   const handleLogout = async () => {
//     await signOut();
//     router.replace("/auth?login");
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         <p className="text-sm text-slate-500">Memuat dashboard...</p>
//       </main>
//     );
//   }

//   if (!user) return null;

//   const isAdmin = user.role === "admin" || user.role === "superadmin";

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
//         <div>
//           <h1 className="text-lg font-semibold text-slate-900">
//             Dashboard {isAdmin ? "Penyelenggara" : "Staff"}
//           </h1>
//           <p className="text-xs text-slate-500">
//             Login sebagai {user.name} ({user.email}) — role:{" "}
//             {user.role ?? "belum ditentukan"}
//           </p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="text-xs px-3 py-1 rounded-md border text-slate-700 hover:bg-slate-100"
//         >
//           Logout
//         </button>
//       </header>

//       <section className="p-6">
//         {isAdmin ? (
//           <div className="space-y-3">
//             <h2 className="text-base font-semibold text-slate-900">
//               Dashboard Penyelenggara (Admin)
//             </h2>
//             <p className="text-sm text-slate-600">
//               Di sini nanti isi fitur: kelola event, lihat peserta, export
//               sertifikat, dll.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             <h2 className="text-base font-semibold text-slate-900">
//               Dashboard Staff
//             </h2>
//             <p className="text-sm text-slate-600">
//               Di sini nanti isi fitur untuk staff/peserta: lihat event yang kamu
//               ikuti, cek sertifikat, dll.
//             </p>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { checkUser, signOut } from "@/app/actions/auth";
import type { Users } from "@/lib/definitions";

// tipe props untuk dashboard per role
interface RoleDashboardProps {
  user: Users;
}

// lazy-load per role → code-splitting + tipe props
const AdminDashboard = dynamic<RoleDashboardProps>(
  () => import("@/components/dashboard/AdminDashboard"),
  { ssr: false }
);

const StaffDashboard = dynamic<RoleDashboardProps>(
  () => import("@/components/dashboard/StaffDashboard"),
  { ssr: false }
);

const SuperAdminDashboard = dynamic<RoleDashboardProps>(
  () => import("@/components/dashboard/SuperAdminDashboard"),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await checkUser();

        // kalau belum punya role → wajib isi dulu
        if (!u.role) {
          router.replace("/role-setup");
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Memuat dashboard...</p>
      </main>
    );
  }

  if (!user) return null;

  const role = user.role;

  let roleLabel = "Staff";
  if (role === "admin") roleLabel = "Penyelenggara";
  if (role === "superadmin") roleLabel = "Superadmin";

  return (
    <main className="min-h-screen">
      {/* Header global */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-transparent">
        <div>
          <h1 className="text-lg font-semibold text-[#344270]">
            Dashboard {roleLabel}
          </h1>
          <p className="text-xs text-slate-500">
            Login sebagai {user.name} ({user.email}) — role:{" "}
            {user.role ?? "belum ditentukan"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          Logout
        </button>
      </header>

      {/* Konten sesuai role */}
      <section className="p-6">
        {role === "superadmin" ? (
          <SuperAdminDashboard user={user} />
        ) : role === "admin" ? (
          <AdminDashboard user={user} />
        ) : (
          <StaffDashboard user={user} />
        )}
      </section>
    </main>
  );
}
