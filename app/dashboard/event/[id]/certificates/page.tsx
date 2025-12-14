"use client";

import { useParams } from "next/navigation";
import { useState, FormEvent, DragEvent, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  Info,
  Download as DownloadIcon,
  Save,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
// Pastikan Anda sudah install axios: npm install axios
import axios from "axios";

import {
  getEventCertificateSettings,
  uploadCertificateBackground,
  updateEventCertificateBackground,
  issueCertificates,
} from "@/app/actions/certificate";

const CertificateSettingsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  // State
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null); // URL untuk preview
  const [existingBackground, setExistingBackground] = useState<string | null>(
    null
  ); // URL dari database (jika sudah ada)

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 1. Fetch data event saat load (untuk melihat apakah sudah ada template sebelumnya)
  useEffect(() => {
    if (!id) return;
    const fetchEventSettings = async () => {
      try {
        const event = await getEventCertificateSettings(id);
        if (event?.cert_background) {
          setExistingBackground(event.cert_background);
          setBackgroundUrl(event.cert_background);
        }
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchEventSettings();
  }, [id]);

  // 2. Fungsi Upload & Simpan Template
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      if (!id) throw new Error("Event ID tidak ditemukan.");

      let finalUrl = existingBackground;

      // Kalau ada file baru, upload dulu
      if (backgroundFile) {
        const uploadedUrl = await uploadCertificateBackground(backgroundFile);
        if (!uploadedUrl) {
          throw new Error("Gagal upload gambar background.");
        }
        finalUrl = uploadedUrl;
      }

      if (!finalUrl) {
        throw new Error("Silakan pilih gambar background terlebih dahulu.");
      }

      const ok = await updateEventCertificateBackground(id, finalUrl);
      if (!ok) {
        throw new Error("Gagal menyimpan pengaturan sertifikat.");
      }

      setExistingBackground(finalUrl);
      setBackgroundUrl(finalUrl);
      setMessage({
        type: "success",
        text: "Template sertifikat berhasil disimpan!",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan pengaturan.",
      });
    } finally {
      setSaving(false);
    }
  };

  // 3. Fungsi Terbitkan & Kirim Email (Fitur Utama)
  const handleIssueCertificates = async () => {
    if (!existingBackground) {
      alert(
        "Harap simpan template background terlebih dahulu sebelum mengirim."
      );
      return;
    }

    if (!id) {
      alert("Event ID tidak ditemukan.");
      return;
    }

    const confirmMsg =
      "Sertifikat akan dikirim via email kepada seluruh peserta yang status kehadirannya 'Hadir'. Lanjutkan?";
    if (!confirm(confirmMsg)) return;

    setSending(true);
    setMessage(null);

    try {
      const res = await issueCertificates(id);

      if (!res) {
        throw new Error("Gagal mengirim sertifikat.");
      }

      setMessage({
        type: "success",
        text: `Berhasil! Email sertifikat telah dikirim ke ${
          res.issued_count ?? 0
        } peserta.`,
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Gagal mengirim sertifikat.",
      });
    } finally {
      setSending(false);
    }
  };

  // --- Helper Functions untuk UI (Drag & Drop) ---
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "File harus berupa gambar (PNG/JPG).",
      });
      return;
    }
    setBackgroundFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBackgroundUrl(objectUrl);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      {/* Header & Navigasi */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-[#34427080]">
            Dashboard / Event /{" "}
            <span className="font-semibold text-[#344270]">Sertifikat</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            Pengaturan Sertifikat
          </h1>
        </div>
        <Link
          href={`/dashboard/event/${id ?? ""}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#E4E7F5] bg-white px-4 py-2 text-xs md:text-sm font-semibold text-[#344270] hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Pesan Alert / Notifikasi */}
      {message && (
        <div
          className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
        {/* KOLOM KIRI: PREVIEW (Visualisasi) */}
        <section className="space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#344270]">
                Preview Hasil
              </h2>
              <p className="text-xs text-slate-500">
                Sistem akan otomatis menimpa nama peserta di atas gambar
                background ini.
              </p>
            </div>

            {/* Area Canvas Preview (Ratio A4 Landscape) */}
            <div className="relative w-full aspect-[297/210] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              {/* Background Image */}
              {backgroundUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${backgroundUrl})` }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="text-xs">Belum ada background</span>
                </div>
              )}

              {/* Overlay Text (Simulasi posisi) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-[5%]">
                <div className="text-[2.5vw] font-serif font-bold text-slate-900 tracking-wide">
                  Nama Peserta
                </div>
                <div className="mt-[1%] w-[30%] h-[1px] bg-slate-800/60"></div>
                <div className="mt-[1%] text-[1vw] font-medium text-slate-600">
                  No: CRT/2025/XXXX
                </div>
              </div>

              {/* QR Code Placeholder (Pojok Kanan Bawah) */}
              <div className="absolute bottom-[8%] right-[5%] w-[10%] aspect-square bg-white/80 rounded-lg border border-white flex items-center justify-center">
                <div className="w-[80%] h-[80%] bg-slate-900 opacity-20"></div>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-slate-400 text-center">
              *Tampilan di atas hanyalah simulasi posisi teks.
            </p>
          </div>
        </section>

        {/* KOLOM KANAN: KONTROL (Upload & Kirim) */}
        <section className="space-y-4">
          {/* 1. Panel Upload */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#344270] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Upload Desain
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan file .JPG/.PNG ukuran A4 (Landscape). Pastikan area
                tengah kosong untuk nama.
              </p>
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => document.getElementById("bg-upload")?.click()}
              className={`
                    border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                    ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                    }
                `}
            >
              <input
                id="bg-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && processFile(e.target.files[0])
                }
              />
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <ImageIcon className="w-5 h-5" />
              </div>
              {backgroundFile ? (
                <p className="text-xs font-medium text-slate-700">
                  {backgroundFile.name}
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Klik atau drag gambar ke sini
                </p>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !backgroundUrl}
              className="w-full py-2.5 rounded-xl bg-[#344270] text-white text-sm font-semibold hover:bg-[#2a365c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Template
            </button>
          </div>

          {/* 2. Panel Kirim (Hanya aktif jika template sudah disimpan) */}
          <div
            className={`rounded-3xl border p-6 shadow-sm transition-all ${
              existingBackground
                ? "bg-white border-slate-200"
                : "bg-slate-50 border-slate-200 opacity-70"
            }`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#344270] flex items-center gap-2">
                <Send className="w-4 h-4 text-green-600" />
                Terbitkan Sertifikat
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kirim email berisi link sertifikat ke semua peserta yang hadir.
              </p>
            </div>

            <div className="bg-blue-50 text-blue-800 text-[11px] p-3 rounded-lg mb-4 leading-relaxed">
              <Info className="w-3 h-3 inline mr-1 mb-0.5" />
              Pastikan template sudah benar. Aksi ini akan mengirim email
              massal.
            </div>

            <button
              onClick={handleIssueCertificates}
              disabled={sending || !existingBackground}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {sending ? "Sedang Mengirim..." : "Kirim ke Semua Peserta"}
            </button>
          </div>

          {/* Download Template Kosong Helper */}
          <div className="text-center">
            <button className="text-[11px] text-slate-400 hover:text-blue-500 underline flex items-center justify-center gap-1 w-full">
              <DownloadIcon className="w-3 h-3" />
              Download contoh ukuran A4
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default CertificateSettingsPage;
