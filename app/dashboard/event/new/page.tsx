"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Tag, Users, ImageIcon, Loader2 } from "lucide-react";
import { createEvent } from "@/app/actions/event"; // Pastikan import action ini ada
import { checkUser } from "@/app/actions/auth"; // Untuk cek role
import type { Users as UserType } from "@/lib/definitions";

const NewEventPage = () => {
  const router = useRouter();

  // State untuk otorisasi & loading
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Proteksi Halaman (Client-side protection)
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const user: UserType = await checkUser();

        // Cek apakah role admin atau superadmin
        if (user.role === "admin" || user.role === "superadmin") {
          setIsAuthorized(true);
        } else {
          // Jika bukan admin, lempar ke dashboard utama
          router.replace("/dashboard");
        }
      } catch (err) {
        // Jika token mati/error, lempar ke login
        router.replace("/auth?login");
      } finally {
        setIsLoadingAuth(false);
      }
    };

    verifyAccess();
  }, [router]);

  // 2. Handle Submit ke Backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi sederhana
    if (!title.trim()) {
      setError("Judul event wajib diisi.");
      return;
    }
    if (!dateTime) {
      setError("Tanggal & waktu wajib diisi.");
      return;
    }
    if (!location.trim()) {
      setError("Lokasi wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      // Panggil action createEvent
      // Note: Pastikan format tanggal sesuai format timestampDB (ISO String biasanya aman)
      const payload = {
        title,
        description,
        datetime: new Date(dateTime).toISOString(), // Konversi ke ISO String
        location,
        organizer: "Self", // Nanti backend akan overwrite ini dengan user login (owner_id)
        image: bannerUrl, // Dikirim, tapi pastikan backend controller menerimanya jika ingin disimpan

        // Tambahan field yang dibutuhkan backend controller (sesuai file controller yang kamu upload)
        // Backend mengharapkan 'capacity' bukan 'quota'
        capacity: parseInt(quota) || 0,
        price: parseInt(price) || 0,
        status: "Aktif", // Default status saat buat baru
      };

      await createEvent(payload);

      // Redirect ke list event jika sukses
      router.push("/dashboard/event");
    } catch (err: any) {
      console.error(err);
      // Menangkap pesan error dari backend
      const msg =
        err?.response?.data?.message || err.message || "Gagal membuat event.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Tampilan Loading saat cek role
  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-[#344270]">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#50A3FB]" />
        <p className="text-sm font-medium">Memverifikasi akses admin...</p>
      </div>
    );
  }

  // Jika tidak punya akses (sebelum redirect selesai), jangan render apa-apa
  if (!isAuthorized) return null;

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
              Judul Event <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
              <Tag className="w-4 h-4 text-[#50A3FB]" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Workshop Digital Marketing 2025"
                className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
                required
              />
            </div>
          </div>

          {/* Tanggal & Lokasi */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Tanggal & Waktu <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <Calendar className="w-4 h-4 text-[#50A3FB]" />
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[#344270]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#344270]">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
                <MapPin className="w-4 h-4 text-[#50A3FB]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Offline / Online (Zoom, GMeet)"
                  className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
                  required
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
                  min="0"
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
                  min="1"
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
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://... (Link gambar poster event)"
                className="w-full bg-transparent outline-none text-sm text-[#344270] placeholder:text-[#34427066]"
              />
            </div>
            <p className="text-[10px] text-[#34427080] ml-1">
              *Fitur upload file langsung belum tersedia, gunakan URL gambar
              (misal dari Google Drive/Imgur/dsb).
            </p>
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
                flex items-center justify-center gap-2
              "
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Menyimpan..." : "Simpan Event"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewEventPage;
