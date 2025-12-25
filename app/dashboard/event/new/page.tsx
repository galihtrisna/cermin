"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Tag, Users, Loader2, Upload, X, DollarSign } from "lucide-react";
import { createEvent, uploadEventImage } from "@/app/actions/event"; 
import { checkUser } from "@/app/actions/auth"; 
import type { Users as UserType } from "@/lib/definitions";

const NewEventPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk otorisasi & loading
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1. Proteksi Halaman
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const user: UserType = await checkUser();
        if (user.role === "admin" || user.role === "superadmin") {
          setIsAuthorized(true);
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        router.replace("/auth?login");
      } finally {
        setIsLoadingAuth(false);
      }
    };

    verifyAccess();
  }, [router]);

  // 2. Handle Upload Gambar
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG/PNG).");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadEventImage(file);
      setBannerUrl(url);
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  // 3. Handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

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
      const payload = {
        title,
        description,
        datetime: new Date(dateTime).toISOString(),
        location,
        organizer: "Self",
        image: bannerUrl,
        capacity: parseInt(quota) || 0,
        price: parseInt(price) || 0,
        status: "Aktif",
      };

      await createEvent(payload);
      router.push("/dashboard/event");
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Gagal membuat event.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-900">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#50A3FB]" />
        <p className="text-sm font-medium">Memverifikasi akses admin...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <>
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Buat Event Baru
        </h1>
        <p className="text-sm text-gray-600">
          Atur detail event, harga, dan kuota peserta.
        </p>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-200 px-4 md:px-8 py-6 md:py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Banner Dropzone */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Banner / Poster Event
            </label>
            
            {!bannerUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                  relative group cursor-pointer
                  border-2 border-dashed border-gray-300 hover:border-[#50A3FB] hover:bg-blue-50
                  rounded-2xl p-8 transition-all bg-gray-50
                  flex flex-col items-center justify-center gap-3
                  ${isUploading ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#50A3FB] group-hover:scale-110 transition-transform shadow-sm">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700 group-hover:text-[#50A3FB] transition-colors">
                    {isUploading ? "Sedang mengunggah..." : "Klik atau seret gambar ke sini"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG (Max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
                <img 
                  src={bannerUrl} 
                  alt="Banner Preview" 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => setBannerUrl("")}
                  className="absolute top-3 right-3 p-2 bg-white shadow-md rounded-full text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Judul */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <Tag className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Workshop Digital Marketing 2025"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Deskripsi Event
            </label>
            <div className="rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan detail event, pembicara, materi, dan benefit..."
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Tanggal & Waktu <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-900 font-medium"
                required
              />
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <MapPin className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Offline / Online (Zoom, GMeet)"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          {/* Harga Tiket */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Harga Tiket (Rp)
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <span className="text-sm font-bold text-gray-500">Rp</span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 untuk gratis"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Kuota */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-900">
              Kuota Peserta
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#50A3FB] focus-within:border-transparent transition-all">
              <Users className="w-5 h-5 text-gray-500" />
              <input
                type="number"
                min="1"
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                placeholder="Contoh: 100"
                className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || isUploading}
              className="
                w-full rounded-xl 
                bg-[#50A3FB] 
                text-white 
                font-bold 
                py-4 
                text-base
                shadow-lg shadow-blue-200
                hover:bg-[#3f8ce0] hover:shadow-xl hover:shadow-blue-300
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting ? "Menyimpan Event..." : "Simpan Event"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewEventPage;