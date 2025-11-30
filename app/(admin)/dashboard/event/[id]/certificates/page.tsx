"use client";

import { useParams } from "next/navigation";
import {
  useState,
  FormEvent,
  DragEvent,
  ChangeEvent,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  Info,
  Download as DownloadIcon,
} from "lucide-react";

const CertificateSettingsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const event = {
    id,
    title: "Workshop Digital Marketing 2025",
  };

  // File yang diupload + URL untuk preview
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const payload = {
      // nanti diintegrasikan dengan upload ke storage
      // sekarang masih dummy: kirim info kalau ada file
      hasBackgroundFile: !!backgroundFile,
      layout: "fixed-a4-landscape",
    };

    console.log("to-save certificate template", payload);

    setTimeout(() => {
      setSaving(false);
      setMessage(
        "Pengaturan sertifikat disimpan (dummy, file belum benar-benar diupload ke server)."
      );
    }, 700);
  };

  const handleGeneratePreview = () => {
    setMessage(null);
    setGenerating(true);

    // TODO: panggil API generate sertifikat contoh
    setTimeout(() => {
      setGenerating(false);
      setMessage(
        "Sertifikat contoh berhasil digenerate. (dummy – nanti bisa jadi link download)."
      );
    }, 900);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar (PNG/JPG).");
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <>
      {/* Header top */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-[#34427080]">
            Dashboard / Event Saya /{" "}
            <Link
              href={`/dashboard/event/${id ?? ""}`}
              className="text-[#50A3FB] hover:text-[#2563EB]"
            >
              Detail Event
            </Link>{" "}
            / <span className="font-semibold text-[#344270]">Sertifikat</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            Pengaturan Sertifikat
          </h1>
          <p className="text-sm md:text-[15px] text-[#34427099]">
            Layout sudah fix:{" "}
            <span className="font-semibold">
              nama besar di tengah, nomor sertifikat di bawahnya, QR di pojok
              kanan bawah.
            </span>{" "}
            Kamu hanya mengatur background dan menyimpan template.
          </p>
        </div>

        <Link
          href={`/dashboard/event/${id ?? ""}`}
          className="
            inline-flex items-center gap-2
            rounded-full border border-[#E4E7F5]
            bg-white/80 text-[#344270]
            px-4 py-2 text-xs md:text-sm font-semibold
            hover:bg-white transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Event</span>
        </Link>
      </div>

      {/* Info banner */}
      <div
        className="
          mb-4
          flex gap-3 items-start
          rounded-2xl border border-[#E4E7F5]
          bg-[#F5F6FF]
          px-4 py-3
          text-xs md:text-sm text-[#34427099]
        "
      >
        <Info className="w-4 h-4 mt-[2px] text-[#50A3FB]" />
        <p>
          Background berisi desain fix (logo, penanggung jawab, tanda tangan,
          dsb). CERMIN otomatis menambahkan{" "}
          <b>nama peserta, nomor sertifikat, dan QR verifikasi</b> sesuai layout
          bawaan A4 landscape.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="grid lg:grid-cols-[1.5fr,1fr] gap-4 md:gap-6"
      >
        {/* PREVIEW A4 LANDSCAPE (LAYOUT FIX) */}
        <section
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-4 md:px-6 py-5 md:py-6
            flex flex-col gap-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-base font-semibold text-[#344270]">
                Preview Sertifikat (A4 Landscape)
              </h2>
              <p className="text-[11px] md:text-xs text-[#34427080]">
                Layout teks & QR sudah dikunci. Background mengikuti gambar yang
                kamu upload.
              </p>
            </div>
          </div>

          <div className="mt-2">
            <div
              className="
                relative w-full
                rounded-3xl overflow-hidden
                border border-[#E4E7F5]
                bg-[#E5E7FEE6]
                aspect-[297/210]
              "
            >
              {/* Background */}
              {backgroundUrl ? (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${backgroundUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8] text-xs px-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span>
                    Belum ada background. Upload gambar di panel kanan
                    (drag & drop / pilih file).
                  </span>
                </div>
              )}

              {/* Lapisan tipis */}
              <div className="absolute inset-0 bg-white/5" />

              {/* Nama & Nomor – CENTER tengah */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%]">
                <div className="text-2xl md:text-3xl font-semibold text-[#111827] text-center">
                  Nama Peserta
                </div>
                <div className="mt-2 text-xs md:text-sm text-[#111827CC] text-center">
                  No. Sertifikat: CERMIN-2025-0001
                </div>
              </div>

              {/* QR – pojok kanan bawah */}
              <div className="absolute bottom-8 right-8 w-20 md:w-24 aspect-square bg-white rounded-xl border border-[#C7D2FE] shadow-[0_8px_20px_rgba(15,23,42,0.18)] flex items-center justify-center">
                <div className="relative w-[78%] h-[78%] bg-white flex items-center justify-center">
                  {/* Finder pattern */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-[2px] border-black bg-white flex items-center justify-center">
                    <div className="w-4 h-4 border-[2px] border-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-[2px] border-black bg-white flex items-center justify-center">
                    <div className="w-4 h-4 border-[2px] border-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-[2px] border-black bg-white flex items-center justify-center">
                    <div className="w-4 h-4 border-[2px] border-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black" />
                    </div>
                  </div>

                  {/* Grid tengah (pattern acak) */}
                  <div className="absolute inset-0 px-2.5 py-2.5">
                    <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-[2px]">
                      {[
                        1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1,
                        0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0,
                        0, 1, 0, 1, 1, 0, 1, 0, 1,
                      ].map((v, i) => (
                        <div
                          key={i}
                          className={v === 1 ? "bg-black" : "bg-white"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-[#34427080]">
              Di sistem, layout ini dikunci sebagai template A4 landscape. Saat
              generate, teks & QR akan dirender di posisi yang sama seperti
              preview ini.
            </p>
          </div>
        </section>

        {/* PANEL PENGATURAN SEDERHANA */}
        <section
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-4 md:px-6 py-5 md:py-6
            flex flex-col gap-4
          "
        >
          {/* Download template kosong */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#344270]">
              Template Kosong Sertifikat
            </p>
            <p className="text-[11px] text-[#34427080]">
              Download file template A4 landscape, edit di Canva/Figma/Photoshop
              (tambahkan logo, tanda tangan, dll), lalu export sebagai gambar
              dan upload lagi di sini.
            </p>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Dummy: di sini nanti download file template sertifikat (PNG/PDF)."
                )
              }
              className="
                inline-flex items-center gap-2
                rounded-2xl border border-[#E4E7F5]
                bg-white/80 text-[#344270]
                px-3 py-2 text-xs md:text-sm font-semibold
                hover:bg-white transition
              "
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download Template Kosong (A4)</span>
            </button>
          </div>

          {/* Upload background (drag & drop) */}
          <div className="space-y-2 border-t border-[#E4E7F5] pt-3">
            <label className="block text-xs font-semibold text-[#344270]">
              Upload Background Sertifikat
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                flex flex-col items-center justify-center gap-2
                rounded-2xl border
                px-4 py-6
                text-center
                cursor-pointer
                transition-all
                ${
                  dragActive
                    ? "border-[#50A3FB] bg-[#E0F2FE]"
                    : "border-[#E4E7F5] bg-white/80"
                }
              `}
              onClick={() => {
                const input = document.getElementById(
                  "bg-upload-input"
                ) as HTMLInputElement | null;
                input?.click();
              }}
            >
              <ImageIcon className="w-6 h-6 text-[#50A3FB]" />
              <div className="text-xs text-[#344270] font-medium">
                Tarik & jatuhkan gambar ke sini
              </div>
              <div className="text-[11px] text-[#34427080]">
                atau <span className="font-semibold">klik untuk pilih file</span>{" "}
                (PNG/JPG, rasio A4 landscape).
              </div>
              {backgroundFile && (
                <p className="mt-2 text-[11px] text-[#34427080]">
                  File terpilih:{" "}
                  <span className="font-semibold">
                    {backgroundFile.name}
                  </span>
                </p>
              )}
            </div>

            <input
              id="bg-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <p className="text-[10px] text-[#34427080]">
              Disarankan: ukuran minimal 2480×1754 px (A4 300 DPI) agar hasil
              cetak tetap tajam.
            </p>
          </div>

          {/* Info layout (read-only) */}
          <div className="space-y-1 border-t border-[#E4E7F5] pt-3">
            <p className="text-xs font-semibold text-[#344270]">
              Layout Dinamis (Terkunci)
            </p>
            <ul className="text-[11px] text-[#34427080] list-disc list-inside space-y-1">
              <li>Nama peserta: huruf besar di tengah sertifikat (bold).</li>
              <li>Nomor sertifikat: tepat di bawah nama (regular).</li>
              <li>QR verifikasi: pojok kanan bawah, di atas background.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-col gap-2">
            <button
              type="submit"
              disabled={saving}
              className="
                w-full rounded-2xl 
                bg-[#50A3FB] 
                text-white 
                font-semibold 
                py-3 
                text-sm md:text-[15px]
                shadow-[0_12px_30px_rgba(80,163,251,0.55)]
                hover:opacity-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>

            <button
              type="button"
              onClick={handleGeneratePreview}
              disabled={generating}
              className="
                w-full rounded-2xl 
                border border-[#E4E7F5]
                bg-white/80 
                text-[#344270]
                font-semibold 
                py-3 
                text-sm md:text-[15px]
                hover:bg-white
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
                inline-flex items-center justify-center gap-2
              "
            >
              {generating && (
                <span className="w-3 h-3 rounded-full border-2 border-[#50A3FB] border-t-transparent animate-spin" />
              )}
              <span>
                {generating
                  ? "Membuat Sertifikat Contoh..."
                  : "Generate Sertifikat Contoh"}
              </span>
            </button>

            {message && (
              <p className="mt-1 text-[11px] text-[#34427080]">{message}</p>
            )}
          </div>
        </section>
      </form>
    </>
  );
};

export default CertificateSettingsPage;
