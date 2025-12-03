// components/dashboard/AdminDashboard.tsx
import Link from "next/link";
import { Users as UsersIcon, DollarSign, Plus, Calendar } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import EventTable, { type EventRow } from "@/components/dashboard/EventTable";
import type { Users } from "@/lib/definitions";

interface Props {
  user: Users;
}

export default function AdminDashboard({ user }: Props) {
  // dummy data – nanti bisa diganti fetch dari API khusus admin
  const stats = {
    activeEvents: 1,
    totalParticipants: 2,
    totalRevenue: 55000,
  };

  const events: EventRow[] = [
    {
      id: "1",
      title: "Digital Marketing 2025",
      date: "10 Oktober 2025",
      price: 55000,
      participants: "25/100",
      status: "Aktif",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title + CTA */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#344270]">
          Dashboard
        </h2>

        <Link
          href="/dashboard/event/new"
          className="
            inline-flex items-center gap-2
            rounded-full
            bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
            text-white font-semibold
            px-4 md:px-6 py-2.5
            shadow-[0_14px_32px_rgba(80,163,251,0.55)]
            hover:opacity-95
            transition
          "
        >
          <Plus className="w-4 h-4" />
          <span>Buat Event Baru</span>
        </Link>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatsCard
          label="Event Aktif"
          value={stats.activeEvents}
          icon={<Calendar className="w-5 h-5 text-[#344270]" />}
        />

        <StatsCard
          label="Total Peserta"
          value={stats.totalParticipants}
          icon={<UsersIcon className="w-5 h-5 text-[#344270]" />}
        />

        <StatsCard
          label="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign className="w-5 h-5 text-[#344270]" />}
        />
      </section>

      {/* Tabel event */}
      <EventTable events={events} />
    </div>
  );
}
