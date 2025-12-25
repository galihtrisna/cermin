"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock, Award } from "lucide-react";
import { EventItem } from "@/app/actions/event";

interface ExtendedEventItem extends EventItem {
  subtitle?: string;
  duration?: string;
  benefits?: string[];
  image?: string;
}

interface SeminarDetailProps {
  event: ExtendedEventItem;
}

const SeminarDetailPage = ({ event }: SeminarDetailProps) => {
  // 1. Format Tanggal
  const formattedDate = new Date(event.datetime).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  // 2. Format Harga
  const formattedPrice =
    event.price === 0
      ? "Gratis"
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(event.price);

  // 3. Fallback Data
  const displayImage = event.image || "/seminar-illustration.jpg";
  const displaySubtitle = event.subtitle || "Deskripsi singkat belum tersedia.";
  const displayDuration = event.duration || "-";
  const displayBenefits =
    event.benefits && event.benefits.length > 0
      ? event.benefits
      : ["Materi Eksklusif", "E-Sertifikat", "Networking"];

  return (
    <div className="min-h-screen">
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Kartu utama */}
          <div
            className="
              rounded-[32px]
              border border-white/40
              bg-white/10
              shadow-[0_4px_18px_rgba(0,0,0,0.04)]
              overflow-hidden
              backdrop-blur-sm
            "
          >
            {/* Banner */}
            <div className="relative h-64 md:h-72">
              <Image
                src={displayImage}
                alt={event.title}
                fill
                className="object-cover"
                priority
                // [FIX] Tambahkan sizes untuk performa & menghilangkan warning
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Isi */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Judul & Subtitle */}
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-[#344270] mb-2">
                  {event.title}
                </h1>
                <p className="text-sm md:text-base text-[#344270b3]">
                  {displaySubtitle}
                </p>
              </div>

              {/* Info Detail Grid */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* Tanggal */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Calendar className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Waktu Pelaksanaan</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <MapPin className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Lokasi</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Kapasitas */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Users className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Kapasitas</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {event.capacity} Kursi
                    </p>
                  </div>
                </div>

                {/* Durasi */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Clock className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Durasi</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {displayDuration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tentang Seminar */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-[#344270]">
                  Tentang Seminar
                </h2>
                <div className="text-sm md:text-[15px] leading-relaxed text-[#344270b3] whitespace-pre-line">
                  {event.description || "Tidak ada deskripsi detail."}
                </div>
              </section>

              {/* Benefits */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-[#344270]">
                  Yang Anda Dapatkan
                </h2>
                <ul className="space-y-2">
                  {displayBenefits.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm md:text-[15px] text-[#344270cc]"
                    >
                      <Award className="w-4 h-4 text-[#50A3FB] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Harga + Tombol Daftar */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-[#34427099] mb-1">
                      Biaya Pendaftaran
                    </p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#50A3FB] to-[#A667E4] bg-clip-text text-transparent">
                      {formattedPrice}
                    </p>
                  </div>

                  <Link
                    href={`/events/register/${event.id}`}
                    className="
                      inline-flex items-center justify-center
                      px-10 py-3.5 
                      rounded-2xl 
                      bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
                      text-white font-semibold
                      text-sm md:text-base
                      shadow-[0_16px_40px_rgba(80,163,251,0.55)]
                      hover:opacity-95
                      transition
                    "
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeminarDetailPage;