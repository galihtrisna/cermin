"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  TicketPercent,
  CheckCircle2,
  Clock,
  Download,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";

// Import actions
import { getEventById, updateEvent, type EventItem } from "@/app/actions/event";
import { checkUser } from "@/app/actions/auth";
import type { Users as UserType } from "@/lib/definitions";

// Tipe data untuk peserta (sementara mock/dummy karena belum ada endpoint khusus orders per event di action)
interface ParticipantRow {
  id: string;
  name: string;
  email: string;
  status: "paid" | "pending";
  ticketType: string;
}

// Status event
type EventStatus = "Draf" | "Aktif" | "Selesai" | "Diblokir" | "Dibatalkan";

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // State UI
  const [eventStatus, setEventStatus] = useState<EventStatus>("Draf");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<string | null>(null);

  // Dummy participants (nanti bisa diganti dengan fetch orders)
  const [participants, setParticipants] = useState<ParticipantRow[]>([
    {
      id: "1",
      name: "Contoh Peserta 1",
      email: "peserta1@example.com",
      status: "paid",
      ticketType: "Reguler",
    },
    {
      id: "2",
      name: "Contoh Peserta 2",
      email: "peserta2@example.com",
      status: "pending",
      ticketType: "Reguler",
    },
  ]);

  // --- FETCH DATA & PROTEKSI ---
  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // 1. Ambil data user & event paralel
        const [userData, eventData] = await Promise.all([
          checkUser(),
          getEventById(id),
        ]);

        // 2. Proteksi Akses (Owner / Superadmin only)
        const isOwner = userData.id === eventData.owner_id;
        const isSuperAdmin = userData.role === "superadmin";

        if (!isOwner && !isSuperAdmin) {
          // Redirect jika bukan haknya
          router.replace("/dashboard");
          return;
        }

        setCurrentUser(userData);
        setEvent(eventData);
        setEventStatus(eventData.status as EventStatus); // Set status awal dari DB
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat detail event.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, router]);

  // --- HANDLERS ---

  // Update Status Event ke Backend
  const handleStatusChange = async (newStatus: EventStatus) => {
    if (!event || !id) return;

    // Update UI optimistic
    setEventStatus(newStatus);

    try {
      await updateEvent(id, { status: newStatus });
      // console.log("Status updated to", newStatus);
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal mengubah status event");
      setEventStatus(event.status as EventStatus); // Rollback jika gagal
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "draf":
        return "bg-slate-100 text-slate-700";
      case "aktif":
        return "bg-[#E0F4FF] text-[#2563EB]";
      case "selesai":
        return "bg-emerald-50 text-emerald-700";
      case "diblokir":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getDotColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draf":
        return "bg-slate-400";
      case "aktif":
        return "bg-emerald-500";
      case "selesai":
        return "bg-emerald-600";
      case "diblokir":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const formatDate = (isoString: string) => {
    return (
      new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#50A3FB]" />
        <p className="text-sm">Memuat detail event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p>{error || "Event tidak ditemukan"}</p>
        <Link
          href="/dashboard/event"
          className="text-[#50A3FB] hover:underline"
        >
          Kembali ke daftar event
        </Link>
      </div>
    );
  }

  // Hitungan ringkasan (Dummy logic based on dummy participants)
  // Nanti jika sudah ada API orders, ganti logic ini
  const verifiedCount = participants.filter((p) => p.status === "paid").length;
  // Jika event.capacity ada, gunakan. Jika tidak, default 100.
  const quota = event.capacity || 100;
  // Registered bisa diambil dari participants.length atau field registered di event jika ada (backend belum kirim field ini, jadi pakai dummy length)
  const registeredCount = participants.length;

  return (
    <>
      {/* Header atas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-2">
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-[#34427080] flex items-center gap-1">
            <Link href="/dashboard/event" className="hover:text-[#50A3FB]">
              Event Saya
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#344270]">Detail Event</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            {event.title}
          </h1>
          <p className="text-sm md:text-[15px] text-[#34427099] line-clamp-1">
            {event.description || "Tidak ada deskripsi singkat."}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* STATUS BADGE / DROPDOWN */}
          {eventStatus === "Diblokir" ? (
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-[#FCA5A5] ${getStatusClasses(
                eventStatus
              )}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${getDotColor(
                  eventStatus
                )}`}
              />
              <span>Diblokir</span>
            </div>
          ) : (
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E4E7F5] ${getStatusClasses(
                eventStatus
              )}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${getDotColor(
                  eventStatus
                )}`}
              />
              <select
                value={eventStatus}
                onChange={(e) =>
                  handleStatusChange(e.target.value as EventStatus)
                }
                className="bg-transparent border-none outline-none text-xs font-semibold pr-2 cursor-pointer appearance-none"
              >
                <option value="Draf">Draf</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          )}

          {/* EDIT BUTTON (FUNGSIONAL) */}
          <Link
            href={`/dashboard/event/${id}/edit`}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#E4E7F5] bg-white/80 text-[#344270] px-4 py-2 text-xs md:text-sm font-semibold hover:bg-white transition"
          >
            Edit Event
          </Link>

          {/* Wrapper titik tiga + menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E4E7F5] bg-white/80 text-[#34427080] hover:bg-white hover:text-[#344270] transition"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E4E7F5] shadow-[0_18px_45px_rgba(15,23,42,0.16)] py-2 z-20">
                <Link
                  href={`/dashboard/event/${id}/checkin`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs md:text-sm text-[#344270cc] hover:bg-[#F5F6FF]"
                >
                  <TicketPercent className="w-4 h-4 text-[#50A3FB]" />
                  <span>Scan Tiket / Check-in</span>
                </Link>

                <Link
                  href={`/dashboard/event/${id}/certificates`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs md:text-sm text-[#344270cc] hover:bg-[#F5F6FF]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#50A3FB]" />
                  <span>Pengaturan Sertifikat</span>
                </Link>

                <Link
                  href={`/events/${id}`} // Arahkan ke public page yang sebenarnya
                  target="_blank"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-xs md:text-sm text-[#344270cc] hover:bg-[#F5F6FF]"
                >
                  <Calendar className="w-4 h-4 text-[#50A3FB]" />
                  <span>Lihat Halaman Publik</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Kolom: Info event + ringkasan */}
      <section className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Info Event (Dinamis) */}
        <div className="md:col-span-2 rounded-3xl bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-5 md:px-6 py-5 md:py-6">
          <h2 className="text-sm font-semibold text-[#34427099] mb-3">
            Info Event
          </h2>
          <div className="space-y-3 text-sm md:text-[15px] text-[#344270cc]">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#50A3FB] mt-[2px]" />
              <div>
                <p className="text-xs text-[#34427099]">Tanggal & Waktu</p>
                <p className="font-medium text-[#344270]">
                  {event.datetime ? formatDate(event.datetime) : "Belum diatur"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#50A3FB] mt-[2px]" />
              <div>
                <p className="text-xs text-[#34427099]">Lokasi</p>
                <p className="font-medium text-[#344270]">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#50A3FB] mt-[2px]" />
              <div>
                <p className="text-xs text-[#34427099]">Durasi</p>
                {/* Duration tidak ada di DB, kita hardcode atau hitung nanti */}
                <p className="font-medium text-[#344270]">Sesuai jadwal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TicketPercent className="w-4 h-4 text-[#50A3FB] mt-[2px]" />
              <div>
                <p className="text-xs text-[#34427099]">Harga Tiket</p>
                <p className="font-medium text-[#344270]">
                  {event.price === 0
                    ? "Gratis"
                    : `Rp ${event.price.toLocaleString("id-ID")}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Peserta (Dinamis dari state/dummy) */}
        <div className="rounded-3xl bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-5 md:px-6 py-5 md:py-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#34427099] mb-3">
              Ringkasan Peserta
            </h2>
            <div className="space-y-3 text-sm md:text-[15px] text-[#344270cc]">
              <div className="flex items-center justify-between">
                <span>Total Terdaftar</span>
                <span className="font-semibold text-[#344270]">
                  {registeredCount}/{quota}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Terverifikasi (lunas)</span>
                <span className="font-semibold text-emerald-600">
                  {verifiedCount} peserta
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Menunggu pembayaran</span>
                <span className="font-semibold text-[#F97316]">
                  {registeredCount - verifiedCount} peserta
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-2 inline-flex items-center justify-center w-full rounded-2xl pastel-gradient text-[#344270] font-semibold text-sm py-2.5 shadow-[0_12px_30px_rgba(148,163,216,0.45)] hover:opacity-95 transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data Peserta (.CSV)
          </button>

          <button
            type="button"
            disabled={sendingFeedback}
            onClick={() => {
              setFeedbackInfo(null);
              setSendingFeedback(true);
              setTimeout(() => {
                setSendingFeedback(false);
                setFeedbackInfo(
                  "Link feedback dikirim ke semua peserta (dummy)."
                );
              }, 800);
            }}
            className="w-full md:w-auto mt-3 inline-flex items-center justify-center rounded-2xl bg-white text-[#344270] border border-[#E4E7F5] px-4 py-2.5 text-xs md:text-sm font-semibold hover:bg-[#F5F6FF] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {sendingFeedback
              ? "Mengirim link..."
              : "Kirim Link Feedback ke Peserta"}
          </button>

          {feedbackInfo && (
            <p className="mt-2 text-[11px] text-[#34427080]">{feedbackInfo}</p>
          )}
        </div>
      </section>

      {/* Tim Presensi */}
      <section className="rounded-3xl bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-4 md:px-6 py-5 md:py-6 mt-4 md:mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-[#344270]">
              Tim Presensi & Akses Scan
            </h2>
            <p className="text-[11px] md:text-xs text-[#34427080]">
              Undang akun lain untuk membantu scan QR saat check-in.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4 text-sm text-[#344270cc]">
          {/* Owner (Dinamis dari session) */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#344270]">
                {currentUser?.name || "Organizer"}
              </p>
              <p className="text-[11px] text-[#34427080]">
                {currentUser?.email} • Organizer
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E0F4FF] text-[#2563EB] text-[11px] px-3 py-1 font-semibold">
                OWNER
              </span>
            </div>
          </div>

          {/* Dummy Scanner */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#344270]">Petugas Scan 1</p>
              <p className="text-[11px] text-[#34427080]">
                scan1@example.com • Petugas Scan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] px-3 py-1 font-semibold">
                SCANNER
              </span>
              <button
                onClick={() => alert("Dummy: Petugas dihapus.")}
                className="p-2 rounded-xl text-[#34427080] hover:bg-red-50 hover:text-red-500 transition"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Dummy: invite dikirim.");
          }}
          className="flex flex-col md:flex-row gap-2 md:gap-3"
        >
          <input
            type="email"
            placeholder="Email petugas scan..."
            className="flex-1 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 text-sm text-[#344270] placeholder:text-[#34427066] focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent"
          />
          <button
            type="submit"
            className="rounded-2xl bg-[#50A3FB] text-white text-sm font-semibold px-4 md:px-5 py-2.5 shadow-[0_10px_26px_rgba(80,163,251,0.55)] hover:opacity-95 transition"
          >
            Tambah Petugas
          </button>
        </form>
      </section>

      {/* Peserta Terbaru (Table) */}
      <section className="rounded-[28px] bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-4 md:px-6 lg:px-8 py-5 md:py-6 mt-4 md:mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#344270]">
              Peserta Terbaru
            </h2>
            <p className="text-xs md:text-sm text-[#34427099] mt-1">
              Beberapa peserta terakhir yang mendaftar event ini.
            </p>
          </div>
          <Link
            href={`/dashboard/event/${id}/participants`}
            className="text-xs md:text-sm font-semibold text-[#50A3FB] hover:text-[#2563EB]"
          >
            Lihat semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-[15px] text-[#344270cc]">
            <thead>
              <tr className="border-b border-[#E4E7F5] text-left">
                <th className="py-3 md:py-4 pr-4 font-semibold">Nama</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Email</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Tipe Tiket</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#F0F2FF] last:border-0"
                >
                  <td className="py-3 md:py-4 pr-4">{p.name}</td>
                  <td className="py-3 md:py-4 pr-4">{p.email}</td>
                  <td className="py-3 md:py-4 pr-4">{p.ticketType}</td>
                  <td className="py-3 md:py-4 pr-4">
                    {p.status === "paid" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-[#F97316]">
                        Menunggu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-sm text-[#34427099]"
                  >
                    Belum ada peserta yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

// Helper component icon
function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export default EventDetailPage;
