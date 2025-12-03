"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useState,
  FormEvent,
  DragEvent,
  ChangeEvent,
  useCallback,
} from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Users,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

const EditEventPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  // Dummy event, nanti ganti pakai data dari API
  const initialEvent = {
    title: "Workshop Digital Marketing 2025",
    dateTime: "2025-10-10T09:00",
    location: "Java Heritage, Purwokerto",
    price: 55000,
    quota: 100,
    bannerUrl: "https://example.com/banner-digital-marketing.jpg",
    description:
      "Workshop intensif membahas strategi digital marketing terkini untuk UMKM dan bisnis online.",
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialEvent.title);
  const [dateTime, setDateTime] = useState(initialEvent.dateTime);
  const [location, setLocation] = useState(initialEvent.location);
  const [price, setPrice] = useState(String(initialEvent.price));
  const [quota, setQuota] = useState(String(initialEvent.quota));
  const [bannerUrl, setBannerUrl] = useState(initialEvent.bannerUrl);
  const [description, setDescription] = useState(initialEvent.description);

  // state untuk drag & drop + preview
  const [isDragging, setIsDragging] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    initialEvent.bannerUrl
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null); // nanti buat upload ke server

  const handleBannerFile = useCallback((file: File | null) => {
    if (!file) return;
    setBannerFile(file);

    const url = URL.createObjectURL(file);
    setBannerPreview(url);

    // optional: kalau mau langsung kosongin bannerUrl biar jelas sumbernya dari file
    // setBannerUrl("");
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleBannerFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      handleBannerFile(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Judul event wajib diisi.");
      return;
    }

    setSubmitting(true);

    // Contoh payload
    const payload = {
      title,
      dateTime,
      location,
      price: Number(price) || 0,
      quota: Number(quota) || 0,
      bannerUrl,
      // bannerFile: kalau mau dikirim ke API pakai FormData
      description,
    };

    console.log("Edit event payload (dummy):", payload);

    // TODO: ganti pakai update ke API
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("Perubahan event berhasil disimpan. (dummy message)");
    }, 800);
  };

  const handleCancel = () => {
    router.push(`/dashboard/event/${id ?? ""}`);
  };

  return (
    <>
      {/* Header */}
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

        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            Edit Event
          </h1>
          <p className="text-sm text-[#34427099]">
            Perbarui informasi event yang sudah terdaftar.
          </p>
        </div>
      </div>

      {/* Card Form */}
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

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700">
              {success}
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
              <div className="flex items-center  gap-2 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent">
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

          {/* Banner Upload + URL */}
          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#344270]">
              Banner / Poster Event
            </label>

            {/* Dropzone */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setBannerFile(file);
                  setBannerPreview(URL.createObjectURL(file));
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onClick={() => {
                document.getElementById("banner-file-input")?.click();
              }}
              className={`
      relative w-full cursor-pointer
      rounded-2xl border-2 border-dashed px-4 py-6
      flex flex-col items-center justify-center gap-2
      transition
      ${
        isDragging
          ? "border-[#50A3FB] bg-[#EFF6FF]"
          : "border-[#E4E7F5] bg-white/80"
      }
    `}
            >
              <input
                id="banner-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    setBannerFile(file);
                    setBannerPreview(URL.createObjectURL(file));
                  }
                }}
              />

              <ImageIcon className="w-6 h-6 text-[#50A3FB]" />
              <p className="text-sm font-semibold text-[#344270]">
                Drag & drop gambar di sini atau klik untuk pilih file
              </p>
              <p className="text-[11px] text-[#34427080] text-center">
                Format PNG / JPG. Preview akan muncul otomatis.
              </p>
            </div>

            {/* Preview — muncul hanya jika ada gambar */}
            {bannerPreview && (
              <div
                className="
        mt-3 rounded-2xl overflow-hidden 
        border border-[#E4E7F5] bg-[#F9FAFF]
      "
              >
                <div className="w-full aspect-video bg-[#E5E7F0]">
                  <img
                    src={bannerPreview}
                    alt="Preview Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
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

          {/* Tombol aksi */}
          <div className="pt-3 flex flex-col md:flex-row gap-3 md:gap-4 md:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="
                w-full md:w-auto
                rounded-2xl border border-[#E4E7F5]
                bg-white/80 text-[#344270]
                font-semibold text-sm md:text-[15px]
                px-5 py-3
                hover:bg-white transition
              "
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                w-full md:w-auto
                rounded-2xl 
                bg-[#50A3FB] 
                text-white 
                font-semibold 
                px-6 py-3.5 
                text-sm md:text-[15px]
                shadow-[0_12px_30px_rgba(80,163,251,0.55)]
                hover:opacity-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditEventPage;
