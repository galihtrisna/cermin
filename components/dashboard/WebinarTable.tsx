// components/dashboard/WebinarTable.tsx
"use client";

import { Edit2, Trash2 } from "lucide-react";

export interface WebinarRow {
  id: string;
  title: string;
  date: string;
  price: number;
  participants: string;
  status: string;
}

interface WebinarTableProps {
  webinars: WebinarRow[];
}

const WebinarTable = ({ webinars }: WebinarTableProps) => {
  return (
    <section
      className="
        rounded-[28px]
        bg-white/90
        border border-white/70
        backdrop-blur-2xl
        shadow-[0_16px_45px_rgba(0,0,0,0.08)]
        px-4 md:px-6 lg:px-8 py-5 md:py-6
      "
    >
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#344270]">
          Webinar Saya
        </h2>
        <p className="text-xs md:text-sm text-[#34427099] mt-1">
          Daftar webinar yang Anda kelola
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm md:text-[15px] text-[#344270cc]">
          <thead>
            <tr className="border-b border-[#E4E7F5] text-left">
              <th className="py-3 md:py-4 pr-4 font-semibold">Judul</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Tanggal</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Harga</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Peserta</th>
              <th className="py-3 md:py-4 pr-4 font-semibold">Status</th>
              <th className="py-3 md:py-4 pr-2 text-center font-semibold">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {webinars.map((webinar) => (
              <tr
                key={webinar.id}
                className="border-b border-[#F0F2FF] last:border-0"
              >
                <td className="py-3 md:py-4 pr-4">{webinar.title}</td>
                <td className="py-3 md:py-4 pr-4">{webinar.date}</td>
                <td className="py-3 md:py-4 pr-4">
                  Rp {webinar.price.toLocaleString("id-ID")}
                </td>
                <td className="py-3 md:py-4 pr-4">
                  {webinar.participants}
                </td>
                <td className="py-3 md:py-4 pr-4">
                  <span
                    className="
                      inline-flex items-center px-3 py-1
                      rounded-full text-xs font-semibold
                      bg-[#E0F4FF] text-[#2563EB]
                    "
                  >
                    {webinar.status}
                  </span>
                </td>
                <td className="py-3 md:py-4 pr-2">
                  <div className="flex items-center justify-center gap-3 text-[#344270b3]">
                    <button
                      type="button"
                      className="hover:text-[#50A3FB] transition"
                      aria-label="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="hover:text-red-500 transition"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {webinars.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-sm text-[#34427099]"
                >
                  Belum ada webinar yang Anda buat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WebinarTable;
