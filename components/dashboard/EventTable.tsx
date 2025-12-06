// components/dashboard/EventTable.tsx
"use client";

import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";

export interface EventRow {
  id: string;
  title: string;
  datetime?: string; // Sesuaikan dengan API
  date?: string; // Legacy support
  price: number;
  participants?: string; // Opsional jika data belum ada
  status: string;
}

const EventTable = ({ events }: { events: EventRow[] }) => {
  return (
    <section
      className="
        rounded-[28px] bg-white/90 border border-white/70
        backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
        px-4 md:px-6 lg:px-8 py-5 md:py-6
      "
    >
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#344270]">
          Event Saya
        </h2>
        <p className="text-xs md:text-sm text-[#34427099] mt-1">
          Daftar event yang Anda kelola
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-[15px] text-[#344270cc]">
          <thead>
            <tr className="border-b border-[#E4E7F5] text-left">
              <th className="py-3 md:py-4 pr-4 font-semibold">Judul</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Tanggal</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Harga</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Status</th>
              <th className="py-3 md:py-4 pr-2 text-center font-semibold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-[#F0F2FF] last:border-0"
              >
                <td className="py-3 md:py-4 pr-4 font-medium text-[#344270]">
                  {event.title}
                </td>
                <td className="py-3 md:py-4 pr-4">
                  {/* Gunakan datetime jika ada, fallback ke date */}
                  {event.datetime
                    ? new Date(event.datetime).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : event.date}
                </td>
                <td className="py-3 md:py-4 pr-4">
                  Rp {event.price.toLocaleString("id-ID")}
                </td>
                <td className="py-3 md:py-4 pr-4">
                  <span
                    className={`
                      inline-flex items-center px-3 py-1
                      rounded-full text-xs font-semibold
                      ${
                        event.status.toLowerCase() === "aktif"
                          ? "bg-[#E0F4FF] text-[#2563EB]"
                          : event.status.toLowerCase() === "selesai"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="py-3 md:py-4 pr-2">
                  <div className="flex items-center justify-center gap-3 text-[#344270b3]">
                    {/* EDIT BUTTON: Mengarah ke Detail Page sesuai request */}
                    <Link
                      href={`/dashboard/event/${event.id}`}
                      className="hover:text-[#50A3FB] transition"
                      title="Lihat & Edit Detail"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    
                    <button className="hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-[#34427099]">
                  Belum ada event.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EventTable;