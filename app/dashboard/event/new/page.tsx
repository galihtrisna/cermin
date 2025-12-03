// app/dashboard/event/new/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { Calendar, MapPin, Tag, Users, ImageIcon } from "lucide-react";

const NewEventPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul event wajib diisi.");
      return;
    }

    setSubmitting(true);

    // TODO: ganti dengan submit ke API
    setTimeout(() => {
      setSubmitting(false);
      setError("Contoh error dari server (nanti ganti dengan real API).");
    }, 800);
  };

  return (
    <>
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
          Buat Event Baru
        </h1>
        <p className="text-sm text-[#34427099]">
          Atur detail event, harga, dan kuota peserta.
        </p>
      </div>

      <section
        className="
          bg-white/90 backdrop-blur-2xl 
          rounded-3xl 
          shadow-[0_24px_80px_rgba(15,23,42,0.18)]
          border border-white/60
          px-4 md:px-8 py-6 md:py-8
          max-w-3xl
        "
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Judul Event
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
              <Tag className="w-4 h-4 text-[#50A3FB]" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Workshop Digital Marketing 2025"
                className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
          </div>

          {/* Tanggal & Lokasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Tanggal & Waktu
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <Calendar className="w-4 h-4 text-[#50A3FB]" />
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[#344270]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Lokasi
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <MapPin className="w-4 h-4 text-[#50A3FB]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Offline / Online (Zoom, Google Meet, dll)"
                  className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
                />
              </div>
            </div>
          </div>

          {/* Harga & Kuota */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Harga Tiket (Rp)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <span className="text-xs text-[#34427099]">Rp</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 untuk gratis"
                  className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Kuota Peserta
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <Users className="w-4 h-4 text-[#50A3FB]" />
                <input
                  type="number"
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  placeholder="Contoh: 100"
                  className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
                />
              </div>
            </div>
          </div>

          {/* Banner URL */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              URL Banner / Poster
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
              <ImageIcon className="w-4 h-4 text-[#50A3FB]" />
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="Link gambar poster event"
                className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#344270]">
              Deskripsi Event
            </label>
            <div className="rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan detail event, pembicara, materi, dan benefit..."
                className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066] resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="
                w-full rounded-2xl 
                bg-[#50A3FB] 
                text-white 
                font-semibold 
                py-3.5 
                text-sm md:text-base
                shadow-[0_12px_30px_rgba(80,163,251,0.55)]
                hover:opacity-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              {submitting ? "Menyimpan..." : "Simpan Event"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewEventPage;
