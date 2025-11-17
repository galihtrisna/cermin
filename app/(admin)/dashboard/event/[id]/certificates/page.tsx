"use client";

import { useParams } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  Info,
  Type,
  Hash,
  QrCode,
  Bold,
  Italic,
} from "lucide-react";
import { Rnd } from "react-rnd";

type FontWeight = "400" | "600" | "700";

interface TextBoxState {
  x: number;
  y: number;
  fontSize: number;
  fontWeight: FontWeight;
  italic: boolean;
}

interface QrBoxState {
  x: number;
  y: number;
  size: number;
}

const CertificateSettingsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const event = {
    id,
    title: "Workshop Digital Marketing 2025",
  };

  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200"
  );

  // Nama Peserta
  const [nameBox, setNameBox] = useState<TextBoxState>({
    x: 260,
    y: 260,
    fontSize: 28,
    fontWeight: "600",
    italic: false,
  });

  // Nomor Sertifikat
  const [numberBox, setNumberBox] = useState<TextBoxState>({
    x: 260,
    y: 330,
    fontSize: 14,
    fontWeight: "400",
    italic: false,
  });

  // QR Sertifikat
  const [qrBox, setQrBox] = useState<QrBoxState>({
    x: 800,
    y: 360,
    size: 120,
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const payload = {
      backgroundUrl,
      nameBox,
      numberBox,
      qrBox,
      rules: {
        requireAttendance: true,
        requireFeedback: true,
      },
    };

    console.log("to-save certificate template", payload);

    // TODO: kirim ke API
    setTimeout(() => {
      setSaving(false);
      setMessage("Pengaturan sertifikat disimpan. (dummy)");
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

  // Helper buat update angka bebas tapi tetap aman
  const safeNumber = (value: string, fallback: number) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return n;
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
            Atur posisi{" "}
            <span className="font-semibold">
              nama peserta, nomor sertifikat, dan QR verifikasi
            </span>{" "}
            di atas template A4 landscape.
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
          Background sudah berisi desain fix (logo, penanggung jawab, dll). Di
          sini kamu hanya mengatur <b>teks dinamis</b> dan <b>QR</b>. Teks
          langsung nempel ke background tanpa box.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="grid lg:grid-cols-[1.5fr,1fr] gap-4 md:gap-6"
      >
        {/* PREVIEW A4 LANDSCAPE */}
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
                Drag teks dan QR di kanvas. Font size diatur dari panel kanan.
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
                aspect-[297/210]  /* A4 landscape ratio */
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8] text-xs">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span>Belum ada background. Isi URL di panel kanan.</span>
                </div>
              )}

              {/* Lapisan tipis */}
              <div className="absolute inset-0 bg-white/10" />

              {/* Nama Peserta */}
              <Rnd
                bounds="parent"
                enableResizing={false}
                position={{ x: nameBox.x, y: nameBox.y }}
                onDragStop={(_, d) =>
                  setNameBox((prev) => ({
                    ...prev,
                    x: d.x,
                    y: d.y,
                  }))
                }
                className="cursor-move"
              >
                <div
                  className="select-none"
                  style={{
                    fontSize: nameBox.fontSize,
                    fontWeight: Number(nameBox.fontWeight),
                    fontStyle: nameBox.italic ? "italic" : "normal",
                    color: "#111827",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  Nama Peserta
                </div>
              </Rnd>

              {/* Nomor Sertifikat */}
              <Rnd
                bounds="parent"
                enableResizing={false}
                position={{ x: numberBox.x, y: numberBox.y }}
                onDragStop={(_, d) =>
                  setNumberBox((prev) => ({
                    ...prev,
                    x: d.x,
                    y: d.y,
                  }))
                }
                className="cursor-move"
              >
                <div
                  className="select-none"
                  style={{
                    fontSize: numberBox.fontSize,
                    fontWeight: Number(numberBox.fontWeight),
                    fontStyle: numberBox.italic ? "italic" : "normal",
                    color: "#111827",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  No. Sertifikat: CERMIN-2025-0001
                </div>
              </Rnd>

              {/* QR Sertifikat */}
              {/* QR Sertifikat */}
              <Rnd
                bounds="parent"
                enableResizing={false}
                size={{ width: qrBox.size, height: qrBox.size }}
                position={{ x: qrBox.x, y: qrBox.y }}
                onDragStop={(_, d) =>
                  setQrBox((prev) => ({
                    ...prev,
                    x: d.x,
                    y: d.y,
                  }))
                }
                className="
    cursor-move
    flex items-center justify-center
    bg-white           /* FULL putih */
    rounded-xl
    border border-[#C7D2FE]
    shadow-[0_8px_20px_rgba(15,23,42,0.18)]
  "
              >
                {/* QR Container */}
                <div className="relative w-[75%] h-[75%] bg-white flex items-center justify-center">
                  {/* 3 FINDER PATTERN (sudut QR) */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-[3px] border-black bg-white flex items-center justify-center">
                    <div className="w-5 h-5 border-[3px] border-black flex items-center justify-center">
                      <div className="w-3 h-3 bg-black" />
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-8 h-8 border-[3px] border-black bg-white flex items-center justify-center">
                    <div className="w-5 h-5 border-[3px] border-black flex items-center justify-center">
                      <div className="w-3 h-3 bg-black" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-8 h-8 border-[3px] border-black bg-white flex items-center justify-center">
                    <div className="w-5 h-5 border-[3px] border-black flex items-center justify-center">
                      <div className="w-3 h-3 bg-black" />
                    </div>
                  </div>

                  {/* GRID TENGAH – pola acak tapi mirip QR */}
                  <div className="absolute inset-0 px-3 py-3">
                    <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
                      {[
                        1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0,
                        0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1,
                        0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1,
                        0, 1, 0, 1, 0, 1, 1,
                      ].map((v, i) => (
                        <div
                          key={i}
                          className={v === 1 ? "bg-black" : "bg-white"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Rnd>
            </div>

            <p className="mt-2 text-[11px] text-[#34427080]">
              Kanvas ini menyesuaikan rasio A4 landscape. Di backend, posisi
              disimpan dalam koordinat pixel relatif ke ukuran asli sertifikat.
            </p>
          </div>
        </section>

        {/* PANEL PENGATURAN */}
        <section
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-4 md:px-6 py-5 md:py-6
            flex flex-col gap-4
          "
        >
          {/* Background URL */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#344270]">
              URL Background Sertifikat
            </label>
            <div
              className="
                flex items-center gap-2
                rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-3 py-2.5
                focus-within:ring-2 focus-within:ring-[#50A3FB]/60
                focus-within:border-transparent
              "
            >
              <ImageIcon className="w-4 h-4 text-[#50A3FB]" />
              <input
                type="text"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                placeholder="https://contoh.com/certificate-bg.png"
                className="
                  w-full bg-transparent outline-none
                  text-xs md:text-sm text-[#344270]
                  placeholder:text-[#34427066]
                "
              />
            </div>
            <p className="text-[10px] text-[#34427080]">
              Background dibuat di luar (Canva/Figma). CERMIN cuma nambahin teks
              dan QR di atasnya.
            </p>
          </div>

          {/* Nama Peserta controls */}
          <div className="space-y-2 border-t border-[#E4E7F5] pt-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#50A3FB]" />
              <p className="text-xs font-semibold text-[#344270]">
                Nama Peserta
              </p>
            </div>

            {/* Font size bebas */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#34427080]">
                Ukuran font (px)
              </span>
              <input
                type="number"
                value={nameBox.fontSize}
                onChange={(e) =>
                  setNameBox((prev) => ({
                    ...prev,
                    fontSize: safeNumber(e.target.value, prev.fontSize),
                  }))
                }
                className="
                  w-24 rounded-xl border border-[#E4E7F5]
                  bg-white/80 px-2 py-1.5
                  text-xs text-[#344270]
                  focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
                  text-right
                "
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setNameBox((prev) => ({
                    ...prev,
                    fontWeight: prev.fontWeight === "700" ? "400" : "700",
                  }))
                }
                className={`
                  flex-1 inline-flex items-center justify-center gap-1
                  rounded-2xl border px-2 py-2 text-xs font-semibold
                  ${
                    nameBox.fontWeight === "700"
                      ? "border-[#50A3FB] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-[#E4E7F5] bg-white text-[#34427099]"
                  }
                `}
              >
                <Bold className="w-3 h-3" />
                <span>Bold</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNameBox((prev) => ({
                    ...prev,
                    italic: !prev.italic,
                  }))
                }
                className={`
                  flex-1 inline-flex items-center justify-center gap-1
                  rounded-2xl border px-2 py-2 text-xs font-semibold
                  ${
                    nameBox.italic
                      ? "border-[#50A3FB] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-[#E4E7F5] bg-white text-[#34427099]"
                  }
                `}
              >
                <Italic className="w-3 h-3" />
                <span>Italic</span>
              </button>
            </div>

            <p className="text-[10px] text-[#34427080]">
              Posisi diatur dengan drag teks &quot;Nama Peserta&quot; di
              preview.
            </p>
          </div>

          {/* Nomor Sertifikat controls */}
          <div className="space-y-2 border-t border-[#E4E7F5] pt-3">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#50A3FB]" />
              <p className="text-xs font-semibold text-[#344270]">
                Nomor Sertifikat
              </p>
            </div>

            {/* Font size bebas */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#34427080]">
                Ukuran font (px)
              </span>
              <input
                type="number"
                value={numberBox.fontSize}
                onChange={(e) =>
                  setNumberBox((prev) => ({
                    ...prev,
                    fontSize: safeNumber(e.target.value, prev.fontSize),
                  }))
                }
                className="
                  w-24 rounded-xl border border-[#E4E7F5]
                  bg-white/80 px-2 py-1.5
                  text-xs text-[#344270]
                  focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
                  text-right
                "
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setNumberBox((prev) => ({
                    ...prev,
                    fontWeight: prev.fontWeight === "700" ? "400" : "700",
                  }))
                }
                className={`
                  flex-1 inline-flex items-center justify-center gap-1
                  rounded-2xl border px-2 py-2 text-xs font-semibold
                  ${
                    numberBox.fontWeight === "700"
                      ? "border-[#50A3FB] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-[#E4E7F5] bg-white text-[#34427099]"
                  }
                `}
              >
                <Bold className="w-3 h-3" />
                <span>Bold</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNumberBox((prev) => ({
                    ...prev,
                    italic: !prev.italic,
                  }))
                }
                className={`
                  flex-1 inline-flex items-center justify-center gap-1
                  rounded-2xl border px-2 py-2 text-xs font-semibold
                  ${
                    numberBox.italic
                      ? "border-[#50A3FB] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-[#E4E7F5] bg-white text-[#34427099]"
                  }
                `}
              >
                <Italic className="w-3 h-3" />
                <span>Italic</span>
              </button>
            </div>

            <p className="text-[10px] text-[#34427080]">
              Posisi diatur dengan drag teks &quot;No. Sertifikat&quot; di
              preview.
            </p>
          </div>

          {/* QR controls */}
          <div className="space-y-2 border-t border-[#E4E7F5] pt-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#50A3FB]" />
              <p className="text-xs font-semibold text-[#344270]">
                QR Sertifikat
              </p>
            </div>

            {/* Ukuran QR bebas */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#34427080]">
                Ukuran sisi (px)
              </span>
              <input
                type="number"
                value={qrBox.size}
                onChange={(e) =>
                  setQrBox((prev) => ({
                    ...prev,
                    size: safeNumber(e.target.value, prev.size),
                  }))
                }
                className="
                  w-24 rounded-xl border border-[#E4E7F5]
                  bg-white/80 px-2 py-1.5
                  text-xs text-[#344270]
                  focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
                  text-right
                "
              />
            </div>

            <p className="text-[10px] text-[#34427080]">
              Posisi QR diatur dengan drag box QR di preview. Di versi real,
              kotak tersebut akan berisi QR valid untuk verifikasi sertifikat.
            </p>
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
