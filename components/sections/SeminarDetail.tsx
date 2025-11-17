"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock, Award } from "lucide-react";

const SeminarDetailPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  // sementara hardcoded, nanti bisa dihubungin ke data beneran
  const data = {
    title: "Workshop Digital Marketing 2025",
    subtitle:
      "Pelajari strategi digital marketing terkini untuk mengembangkan bisnis Anda",
    date: "30 Oktober 2025, 09.00 WIB",
    location: "Java Heritage",
    participants: "113 Terdaftar",
    duration: "16 Jam",
    price: "Rp 55.000",
    benefits: [
      "Sertifikat",
      "Materi lengkap workshop",
      "Akses ke komunitas alumni",
      "Konsultan gratis 1 bulan",
    ],
  };

  return (
    <div className="min-h-screen">
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Kartu utama */}
          <div
            className="rounded-[32px]
    border border-white/40
    bg-white/10
    shadow-[0_4px_18px_rgba(0,0,0,0.04)]
    overflow-hidden
  "
          >
            {/* Banner */}
            <div className="relative h-64 md:h-72">
              <Image
                src="/seminar-illustration.jpg"
                alt="Seminar"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Isi */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Judul */}
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-[#344270] mb-2">
                  {data.title}
                </h1>
                <p className="text-sm md:text-base text-[#344270b3]">
                  {data.subtitle}
                </p>
              </div>

              {/* Info singkat */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Calendar className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Tanggal</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {data.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <MapPin className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Lokasi</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {data.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Users className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Peserta</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {data.participants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white/70 px-4 py-3">
                  <Clock className="w-5 h-5 text-[#50A3FB]" />
                  <div>
                    <p className="text-xs text-[#34427099]">Durasi</p>
                    <p className="text-sm md:text-[15px] font-semibold text-[#344270]">
                      {data.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tentang seminar */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-[#344270]">
                  Tentang Seminar
                </h2>
                <p className="text-sm md:text-[15px] leading-relaxed text-[#344270b3] mb-3">
                  Workshop intensif yang dirancang untuk memberikan pemahaman
                  mendalam tentang strategi digital marketing modern. Peserta
                  akan belajar dari praktisi berpengalaman dan mendapatkan
                  insight praktis yang dapat langsung diterapkan.
                </p>
                <p className="text-sm md:text-[15px] leading-relaxed text-[#344270b3]">
                  Materi mencakup SEO, social media marketing, content
                  marketing, email marketing, dan analytics.
                </p>
              </section>

              {/* Benefit */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-[#344270]">
                  Yang Anda Dapatkan
                </h2>
                <ul className="space-y-2">
                  {data.benefits.map((item, idx) => (
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

              {/* Harga + tombol daftar */}
              <section className="rounded-2xl bg-white/85 border border-white/60 px-4 py-5 md:px-6 md:py-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-[#34427099] mb-1">
                      Biaya Pendaftaran
                    </p>
                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#50A3FB] to-[#A667E4] bg-clip-text text-transparent">
                      {data.price}
                    </p>
                  </div>

                  <Link
                    href={`/seminar/${id ?? ""}/register`}
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
                    Daftar
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
