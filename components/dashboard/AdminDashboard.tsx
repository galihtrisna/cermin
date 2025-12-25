// components/dashboard/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users as UsersIcon, DollarSign, Plus, Calendar, Loader2 } from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import EventTable, { type EventRow } from "@/components/dashboard/EventTable";
import type { Users } from "@/lib/definitions";
import { getMyEvents } from "@/app/actions/event";

interface Props {
  user: Users;
}

export default function AdminDashboard({ user }: Props) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data);

        // --- KALKULASI STATISTIK (OVERVIEW) ---
        
        // 1. Event Aktif: Event yang statusnya 'published' ATAU tanggalnya belum lewat
        const activeCount = data.filter((e) => {
             // Bisa berdasarkan status backend 'published' atau logika tanggal
             // Disini kita pakai logika: jika datetime > sekarang
             if (!e.datetime) return false;
             return new Date(e.datetime) > new Date();
        }).length;

        // 2. Total Peserta: Sum dari participant_count semua event
        const totalPart = data.reduce((acc, curr) => acc + (curr.participant_count || 0), 0);

        // 3. Total Pendapatan: Sum dari (Harga Event * Jumlah Peserta)
        // Note: Ini estimasi kasar. Untuk akurat, ambil dari tabel transaksi/orders yg status 'paid'
        const totalRev = data.reduce((acc, curr) => {
            const count = curr.participant_count || 0;
            const price = curr.price || 0;
            return acc + (count * price);
        }, 0);

        setStats({
            activeEvents: activeCount,
            totalParticipants: totalPart,
            totalRevenue: totalRev
        });

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title + CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl md:text-3xl font-semibold text-[#344270]">
             Dashboard
           </h2>
           <p className="text-sm text-[#34427099]">
             Selamat datang kembali, {user.name}!
           </p>
        </div>

        <Link
          href="/dashboard/event/new"
          className="
            inline-flex items-center justify-center gap-2
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

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatsCard
          label="Event Akan Datang"
          value={loading ? "..." : stats.activeEvents}
          icon={<Calendar className="w-5 h-5 text-[#344270]" />}
        />

        <StatsCard
          label="Total Peserta"
          value={loading ? "..." : stats.totalParticipants}
          icon={<UsersIcon className="w-5 h-5 text-[#344270]" />}
        />

        <StatsCard
          label="Estimasi Pendapatan"
          value={loading ? "..." : `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`}
          icon={<DollarSign className="w-5 h-5 text-[#344270]" />}
        />
      </section>

      {/* Tabel Event */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#344270]">Daftar Event</h3>
        {loading ? (
           <div className="w-full h-40 flex items-center justify-center bg-white/50 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
           </div>
        ) : (
           <EventTable events={events} />
        )}
      </div>
    </div>
  );
}