// app/dashboard/event/[id]/checkin/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface LastCheckin {
  name: string;
  email: string;
  ticketType: string;
  time: string;
  status: "success" | "error";
  message: string;
}

const EventCheckinPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  // dummy info event
  const event = {
    title: "Workshop Digital Marketing 2025",
    date: "10 Oktober 2025, 09.00 WIB",
    location: "Java Heritage, Purwokerto",
  };

  // dummy data
  const [totalScanned] = useState(23);
  const [totalPaid] = useState(20);

  const [last, setLast] = useState<LastCheckin | null>({
    name: "Galih Trisna",
    email: "galih@example.com",
    ticketType: "Reguler",
    time: "09:02",
    status: "success",
    message: "Check-in berhasil",
  });

  const handleFakeScanSuccess = () => {
    // nanti ganti dengan hasil decode QR
    setLast({
      name: "Peserta Baru",
      email: "baru@example.com",
      ticketType: "VIP",
      time: "09:15",
      status: "success",
      message: "Check-in berhasil",
    });
  };

  const handleFakeScanError = () => {
    setLast({
      name: "-",
      email: "unknown",
      ticketType: "-",
      time: "09:16",
      status: "error",
      message: "Tiket tidak valid / sudah dipakai",
    });
  };

  return (
    <>
      {/* Header + breadcrumb */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#34427080]">
          <Link
            href={`/dashboard/event/${id ?? ""}`}
            className="inline-flex items-center gap-1 text-[#50A3FB] hover:text-[#2563EB]"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Kembali ke Detail Event</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
              Check-in Peserta
            </h1>
            <p className="text-sm text-[#34427099]">{event.title}</p>
          </div>
          <div className="text-xs md:text-sm text-[#34427080] md:text-right">
            <p>{event.date}</p>
            <p>{event.location}</p>
          </div>
        </div>
      </div>

      <section className="grid lg:grid-cols-[2fr,1.3fr] gap-4 md:gap-6">
        {/* Area Scan */}
        <div
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-4 md:px-6 py-5 md:py-6
            flex flex-col gap-4
          "
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-[#344270]">
                Mode Scan QR
              </h2>
              <p className="text-[11px] md:text-xs text-[#34427080]">
                Arahkan kamera ke QR tiket peserta untuk mencatat kehadiran.
              </p>
            </div>
          </div>

          {/* Placeholder area kamera */}
          <div
            className="
              relative
              flex-1 min-h-[220px] md:min-h-[260px]
              rounded-3xl border border-dashed border-[#CBD5F5]
              bg-gradient-to-br from-white via-[#F4F6FF] to-white
              flex flex-col items-center justify-center
              text-center px-4
            "
          >
            <div className="mb-3">
              <Camera className="w-10 h-10 md:w-12 md:h-12 text-[#50A3FB]" />
            </div>
            <p className="text-sm md:text-base font-semibold text-[#344270]">
              Area Kamera Scan QR
            </p>
            <p className="text-xs md:text-[13px] text-[#34427080] mt-1">
              Nanti diisi komponen scanner (misalnya berbasis webcam) untuk
              membaca kode QR tiket.
            </p>

            {/* Tombol testing scan dummy */}
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={handleFakeScanSuccess}
                className="
                  rounded-full bg-emerald-500 text-white text-xs
                  px-4 py-2 font-semibold hover:bg-emerald-600 transition
                "
              >
                Simulasi Scan Berhasil
              </button>
              <button
                type="button"
                onClick={handleFakeScanError}
                className="
                  rounded-full bg-red-500 text-white text-xs
                  px-4 py-2 font-semibold hover:bg-red-600 transition
                "
              >
                Simulasi Scan Gagal
              </button>
            </div>
          </div>

          {/* Info scan terakhir */}
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-[#34427099] mb-2">
              Scan Terakhir
            </h3>
            {last ? (
              <div
                className={`
                  rounded-2xl px-4 py-3 text-xs md:text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2
                  ${
                    last.status === "success"
                      ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
                      : "bg-red-50 border border-red-100 text-red-700"
                  }
                `}
              >
                <div>
                  <p className="font-semibold">
                    {last.name}{" "}
                    {last.ticketType !== "-" && (
                      <span className="text-[11px] font-normal text-[#34427080]">
                        • {last.ticketType}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] md:text-xs">{last.email}</p>
                  <p className="text-[11px] mt-1">{last.message}</p>
                </div>
                <div className="flex items-center gap-2 md:self-start">
                  {last.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span className="text-[11px] md:text-xs">
                    {last.time} WIB
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#34427080]">
                Belum ada scan yang tercatat.
              </p>
            )}
          </div>
        </div>

        {/* Panel samping (statistik ringan) */}
        <div className="space-y-4 md:space-y-5">
          <div
            className="
              rounded-3xl bg-white/90 border border-white/70
              backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
              px-4 md:px-5 py-4 md:py-5
            "
          >
            <h2 className="text-sm font-semibold text-[#344270] mb-3">
              Ringkasan Check-in
            </h2>
            <div className="space-y-2 text-sm text-[#344270cc]">
              <div className="flex items-center justify-between">
                <span>Total sudah scan</span>
                <span className="font-semibold text-[#344270]">
                  {totalScanned} peserta
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Peserta terverifikasi (lunas)</span>
                <span className="font-semibold text-emerald-600">
                  {totalPaid} peserta
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sisa kuota (dummy)</span>
                <span className="font-semibold text-[#F97316]">77 kursi</span>
              </div>
            </div>
          </div>

          <div
            className="
              rounded-3xl bg-white/90 border border-white/70
              backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
              px-4 md:px-5 py-4 md:py-5
            "
          >
            <h2 className="text-sm font-semibold text-[#344270] mb-3">
              Tips untuk Petugas Scan
            </h2>
            <ul className="space-y-2 text-[11px] md:text-xs text-[#34427099]">
              <li>• Pastikan koneksi internet stabil.</li>
              <li>• Minta peserta menyiapkan QR sebelum tiba di depan.</li>
              <li>• Kalau gagal, minta peserta zoom in display QR.</li>
              <li>
                • Gunakan 2–3 petugas scan untuk event lebih dari 100 peserta.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventCheckinPage;
