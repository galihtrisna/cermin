"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  CameraOff,
} from "lucide-react";
import { createAxiosJWT } from "@/lib/axiosJwt";
import { Html5QrcodeScanner } from "html5-qrcode";

interface AttendanceRow {
  participant_name: string;
  participant_email: string;
  status: string;
  scanned_at: string | null;
}

export default function EventCheckinPage() {
  const params = useParams();
  const id = params?.id as string;
  const axiosJWT = createAxiosJWT();

  // State Data
  const [participants, setParticipants] = useState<AttendanceRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [eventName, setEventName] = useState("Loading...");

  // State Scan
  const [manualToken, setManualToken] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error";
    msg: string;
    data?: any;
  } | null>(null);

  // State Webcam
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // 1. Fetch Event Info & Attendance List
  const loadData = useCallback(async () => {
    try {
      // Ambil Info Event (Judul)
      const eventRes = await axiosJWT.get(`/api/events/${id}`);
      setEventName(eventRes.data.data.title);

      // Ambil List Peserta & Status
      const listRes = await axiosJWT.get(`/api/attendance/${id}`);
      setParticipants(listRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  // 2. Fungsi Scan / Check-in
  // Menggunakan useCallback agar tidak re-create saat render ulang (penting untuk scanner)
  const handleScanProcess = useCallback(
    async (qrToken: string) => {
      if (!qrToken) return;

      // Cegah double submit jika sedang processing
      // Note: Kita pakai ref atau cek state, tapi karena processing state async,
      // kita biarkan logic API yang handle concurrency atau UI disabled.
      setProcessing(true);
      setScanResult(null);

      try {
        const res = await axiosJWT.post("/api/attendance/scan", {
          event_id: id,
          qr_token: qrToken,
        });

        // Sukses
        setScanResult({
          status: "success",
          msg: `Berhasil: ${res.data.data.participant.name}`,
          data: res.data.data,
        });

        // Refresh list agar status terupdate realtime
        loadData();

        // Jika pakai scanner, kita bisa pause sebentar agar user lihat hasilnya
        if (scannerRef.current) {
          scannerRef.current.pause(true);
          setTimeout(() => {
            if (scannerRef.current) scannerRef.current.resume();
          }, 2000);
        }
      } catch (err: any) {
        // Gagal (Token salah, event beda, atau sudah hadir)
        const msg =
          err.response?.data?.message || "Scan gagal / Token invalid.";
        setScanResult({ status: "error", msg });

        // Pause scanner sebentar saat error juga
        if (scannerRef.current) {
          scannerRef.current.pause(true);
          setTimeout(() => {
            if (scannerRef.current) scannerRef.current.resume();
          }, 2000);
        }
      } finally {
        setProcessing(false);
        setManualToken(""); // Reset input field
      }
    },
    [id, loadData]
  );

  // 3. Effect untuk Scanner HTML5
  useEffect(() => {
    if (showScanner) {
      // Pastikan elemen 'reader' sudah ada di DOM sebelum inisialisasi
      const timer = setTimeout(() => {
        if (!scannerRef.current) {
          const scanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              handleScanProcess(decodedText);
            },
            (errorMessage) => {
              // console.warn("Scan error:", errorMessage);
            }
          );
          scannerRef.current = scanner;
        }
      }, 100); // delay dikit biar DOM ready

      return () => clearTimeout(timer);
    } else {
      // Cleanup jika scanner ditutup
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
    }

    // Cleanup saat unmount component
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Failed to clear scanner", err));
        scannerRef.current = null;
      }
    };
  }, [showScanner, handleScanProcess]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 text-xs text-[#34427080]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-[#50A3FB] hover:underline"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            Scan Presensi
          </h1>
          <p className="text-sm text-[#34427099]">{eventName}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6">
        {/* KIRI: SCANNER AREA */}
        <div className="space-y-6">
          {/* Card Input / Scanner */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#344270]">Input Tiket</h2>
              <button
                onClick={() => setShowScanner(!showScanner)}
                className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-2 transition ${
                  showScanner
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-blue-50 text-blue-600 border-blue-200"
                }`}
              >
                {showScanner ? (
                  <>
                    <CameraOff className="w-3 h-3" /> Matikan Kamera
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3" /> Gunakan Kamera
                  </>
                )}
              </button>
            </div>

            {/* Feedback Pesan */}
            {scanResult && (
              <div
                className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${
                  scanResult.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {scanResult.status === "success" ? (
                  <CheckCircle2 className="mt-0.5" />
                ) : (
                  <XCircle className="mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    {scanResult.status === "success"
                      ? "Check-in Sukses!"
                      : "Gagal!"}
                  </p>
                  <p className="text-sm">{scanResult.msg}</p>
                </div>
              </div>
            )}

            {/* Area Scanner Kamera */}
            {showScanner && (
              <div className="mb-6 rounded-xl overflow-hidden bg-black relative">
                <div id="reader" className="w-full h-full"></div>
                <p className="text-[10px] text-white/70 text-center py-1 absolute bottom-0 w-full bg-black/50">
                  Arahkan QR Code ke kamera
                </p>
              </div>
            )}

            {/* Input Manual */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanProcess(manualToken);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Token / Kode QR (Manual)
                </label>
                <input
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Scan dengan alat USB atau ketik..."
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#50A3FB] outline-none text-[#344270]"
                  autoFocus={!showScanner} // Autofocus jika kamera mati
                />
              </div>
              <button
                disabled={processing || !manualToken}
                type="submit"
                className="w-full bg-[#50A3FB] text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {processing ? "Memproses..." : "Check In Manual"}
              </button>
            </form>

            {!showScanner && (
              <p className="text-xs text-center text-slate-400 mt-4">
                *Klik tombol "Gunakan Kamera" di atas untuk menggunakan webcam
                laptop/HP.
              </p>
            )}
          </div>

          {/* Stats Ringkas */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">Total Peserta Lunas</p>
              <p className="text-xl font-bold text-[#344270]">
                {participants.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Sudah Hadir</p>
              <p className="text-xl font-bold text-green-600">
                {participants.filter((p) => p.status === "Hadir").length}
              </p>
            </div>
          </div>
        </div>

        {/* KANAN: LIST PESERTA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <h2 className="text-lg font-bold text-[#344270] mb-4">
            Daftar Kehadiran
          </h2>

          {loadingList ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#50A3FB]" />
            </div>
          ) : (
            <div className="overflow-y-auto pr-2 space-y-2 flex-1 custom-scrollbar">
              {participants.length === 0 ? (
                <p className="text-center text-slate-400 text-sm mt-10">
                  Belum ada peserta yang lunas.
                </p>
              ) : (
                participants.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex justify-between items-center transition ${
                      p.status === "Hadir"
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm text-[#344270] truncate">
                        {p.participant_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {p.participant_email}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          p.status === "Hadir"
                            ? "bg-green-200 text-green-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {p.status}
                      </span>
                      {p.scanned_at && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(p.scanned_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
