"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  TicketPercent,
  CheckCircle2,
  Clock,
  Download,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";

// Import actions
import { getEventById, updateEvent, type EventItem } from "@/app/actions/event";
import { getOrdersByEvent, type OrderItem } from "@/app/actions/order";
import { checkUser } from "@/app/actions/auth";
import type { Users as UserType } from "@/lib/definitions";
import { createAxiosJWT } from "@/lib/axiosJwt"; // Import axios wrapper

// Status event sesuai DB
type EventStatus = "Draf" | "Aktif" | "Selesai" | "Diblokir" | "Dibatalkan";

// Tipe untuk Scanner
interface ScannerMember {
  id: string; // ID dari tabel event_staff (untuk staff) atau user_id (untuk owner)
  email: string;
  name?: string; // Tambahan opsi nama biar lebih lengkap (opsional)
  role: "Scanner" | "Owner";
}

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  // --- STATE DATA ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [event, setEvent] = useState<EventItem | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // Data Peserta (Real dari DB)
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // State UI
  const [eventStatus, setEventStatus] = useState<EventStatus>("Draf");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<string | null>(null);

  // State Tim Presensi (Real)
  const [scanners, setScanners] = useState<ScannerMember[]>([]);
  const [newScannerEmail, setNewScannerEmail] = useState("");
  const [addingScanner, setAddingScanner] = useState(false); // Loading state saat add staff

  const axiosJWT = createAxiosJWT();

  // --- FETCH DATA & PROTEKSI ---
  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // 1. Ambil data User, Event, dan Orders (Peserta) secara paralel
        const [userData, eventData, ordersData] = await Promise.all([
          checkUser(),
          getEventById(id),
          getOrdersByEvent(id),
        ]);

        // 2. Proteksi Akses (Hanya Owner & Superadmin)
        const isOwner = userData.id === eventData.owner_id;
        const isSuperAdmin = userData.role === "superadmin";

        if (!isOwner && !isSuperAdmin) {
          router.replace("/dashboard");
          return;
        }

        // 3. Set Data ke State
        setCurrentUser(userData);
        setEvent(eventData);
        setOrders(ordersData);
        setEventStatus(eventData.status as EventStatus);

        // 4. Fetch Real Staff List
        // Owner selalu ada di list paling atas
        const ownerItem: ScannerMember = {
          id: "owner",
          email: userData.email, // Asumsi owner adalah current user (jika role superadmin buka, ini perlu disesuaikan tp logic dasar ok)
          role: "Owner",
          name: userData.name,
        };

        try {
          const res = await axiosJWT.get(`/api/events/${id}/staff`);
          const staffList = res.data.data.map((item: any) => ({
            id: item.id, // ID dari tabel event_staff (penting untuk delete)
            email: item.user.email,
            name: item.user.name,
            role: "Scanner" as const,
          }));

          setScanners([ownerItem, ...staffList]);
        } catch (staffErr) {
          console.error("Gagal ambil staff:", staffErr);
          // Fallback: tetap tampilkan owner
          setScanners([ownerItem]);
        }
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat detail event.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, router]);

  // --- LOGIC CALCULATIONS ---
  const quota = event?.capacity || 0;
  const registeredCount = orders.length;
  const verifiedCount = orders.filter((o) =>
    ["paid", "settlement", "success"].includes(o.status.toLowerCase())
  ).length;
  const pendingCount = registeredCount - verifiedCount;

  // --- HANDLERS ---

  // 1. Update Status Event
  const handleStatusChange = async (newStatus: EventStatus) => {
    if (!event || !id) return;
    setEventStatus(newStatus); // Optimistic UI Update

    try {
      await updateEvent(id, { status: newStatus });
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal mengubah status event. Coba lagi.");
      setEventStatus(event.status as EventStatus); // Rollback
    }
  };

  // 2. Tambah Petugas Scan (Real API Call)
  const handleAddScanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScannerEmail.trim() || !id) return;

    setAddingScanner(true);
    try {
      // Panggil API add staff
      await axiosJWT.post(`/api/events/${id}/staff`, {
        email: newScannerEmail,
      });

      // Refresh list staff
      const res = await axiosJWT.get(`/api/events/${id}/staff`);
      const newStaffList = res.data.data.map((item: any) => ({
        id: item.id,
        email: item.user.email,
        name: item.user.name,
        role: "Scanner" as const,
      }));

      // Pertahankan owner di index 0
      const owner = scanners.find((s) => s.role === "Owner");
      setScanners(owner ? [owner, ...newStaffList] : [...newStaffList]);

      setNewScannerEmail(""); // Reset input
      alert(`Undangan berhasil dikirim ke ${newScannerEmail}`);
    } catch (err: any) {
      console.error(err);
      // Tampilkan pesan error spesifik dari backend (misal: "Email belum terdaftar" atau "User bukan staff")
      const msg = err.response?.data?.message || "Gagal menambahkan petugas.";
      alert(msg);
    } finally {
      setAddingScanner(false);
    }
  };

  // 3. Hapus Petugas Scan (Real API Call)
  const handleRemoveScanner = async (scannerId: string) => {
    if (!id) return;
    if (confirm("Hapus akses petugas ini?")) {
      try {
        // Panggil API delete staff
        await axiosJWT.delete(`/api/events/${id}/staff/${scannerId}`);
        // Update state lokal
        setScanners(scanners.filter((s) => s.id !== scannerId));
      } catch (err: any) {
        console.error(err);
        alert("Gagal menghapus petugas.");
      }
    }
  };

  // 4. Kirim Feedback
  const handleSendFeedback = () => {
    setFeedbackInfo(null);
    setSendingFeedback(true);
    // Simulasi delay API call
    setTimeout(() => {
      setSendingFeedback(false);
      setFeedbackInfo(
        `Link feedback berhasil dikirim ke ${verifiedCount} peserta terverifikasi.`
      );
    }, 1000);
  };

  // 5. Helper UI
  const getStatusClasses = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
    if (!isoString) return "-";
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

  // --- RENDER VIEW ---

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

  return (
    <>
      {/* --- HEADER --- */}
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
          {/* STATUS SELECTOR */}
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
            {eventStatus === "Diblokir" ? (
              <span>Diblokir (Hubungi Admin)</span>
            ) : (
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
            )}
          </div>

          {/* EDIT BUTTON */}
          <Link
            href={`/dashboard/event/${id}/edit`}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#E4E7F5] bg-white/80 text-[#344270] px-4 py-2 text-xs md:text-sm font-semibold hover:bg-white transition"
          >
            Edit Event
          </Link>

          {/* MORE MENU */}
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
                  href={`/events/${id}`}
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

      {/* --- GRID UTAMA --- */}
      <section className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* KOLOM 1: INFO EVENT */}
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

        {/* KOLOM 2: RINGKASAN PESERTA (STATS) */}
        <div className="rounded-3xl bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-5 md:px-6 py-5 md:py-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#34427099] mb-3">
              Ringkasan Peserta
            </h2>
            <div className="space-y-3 text-sm md:text-[15px] text-[#344270cc]">
              <div className="flex items-center justify-between">
                <span>Total Terdaftar</span>
                <span className="font-semibold text-[#344270]">
                  {registeredCount}/{quota > 0 ? quota : "∞"}
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
                  {pendingCount} peserta
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Fitur export CSV akan segera tersedia!")}
            className="mt-2 inline-flex items-center justify-center w-full rounded-2xl pastel-gradient text-[#344270] font-semibold text-sm py-2.5 shadow-[0_12px_30px_rgba(148,163,216,0.45)] hover:opacity-95 transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data Peserta (.CSV)
          </button>

          <button
            type="button"
            disabled={sendingFeedback}
            onClick={handleSendFeedback}
            className="w-full md:w-auto mt-3 inline-flex items-center justify-center rounded-2xl bg-white text-[#344270] border border-[#E4E7F5] px-4 py-2.5 text-xs md:text-sm font-semibold hover:bg-[#F5F6FF] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {sendingFeedback ? "Mengirim..." : "Kirim Link Feedback"}
          </button>

          {feedbackInfo && (
            <p className="mt-2 text-[11px] text-[#34427080] animate-pulse">
              {feedbackInfo}
            </p>
          )}
        </div>
      </section>

      {/* --- TIM PRESENSI (SCANNER TEAM) --- */}
      <section className="rounded-3xl bg-white/90 border border-white/70 backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)] px-4 md:px-6 py-5 md:py-6 mt-4 md:mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-[#344270]">
              Tim Presensi & Akses Scan
            </h2>
            <p className="text-[11px] md:text-xs text-[#34427080]">
              Undang akun staff lain (role: Staff) untuk membantu scan QR saat
              check-in.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4 text-sm text-[#344270cc]">
          {/* List Scanners */}
          {scanners.map((scanner) => (
            <div key={scanner.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#344270]">
                  {scanner.name || scanner.email.split("@")[0]}
                </p>
                <p className="text-[11px] text-[#34427080]">
                  {scanner.email} •{" "}
                  {scanner.role === "Owner" ? "Organizer" : "Petugas Scan"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {scanner.role === "Owner" ? (
                  <span className="rounded-full bg-[#E0F4FF] text-[#2563EB] text-[11px] px-3 py-1 font-semibold">
                    OWNER
                  </span>
                ) : (
                  <>
                    <span className="rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] px-3 py-1 font-semibold">
                      SCANNER
                    </span>
                    <button
                      onClick={() => handleRemoveScanner(scanner.id)}
                      className="p-2 rounded-xl text-[#34427080] hover:bg-red-50 hover:text-red-500 transition"
                      title="Hapus Petugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Tambah Petugas */}
        <form
          onSubmit={handleAddScanner}
          className="flex flex-col md:flex-row gap-2 md:gap-3"
        >
          <input
            type="email"
            value={newScannerEmail}
            onChange={(e) => setNewScannerEmail(e.target.value)}
            placeholder="Email staff yang sudah terdaftar..."
            className="flex-1 rounded-2xl border border-[#E4E7F5] bg-white/80 px-4 py-2.5 text-sm text-[#344270] placeholder:text-[#34427066] focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={addingScanner}
            className="rounded-2xl bg-[#50A3FB] text-white text-sm font-semibold px-4 md:px-5 py-2.5 shadow-[0_10px_26px_rgba(80,163,251,0.55)] hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {addingScanner ? "Menambahkan..." : "Tambah Petugas"}
          </button>
        </form>
      </section>

      {/* --- TABEL PESERTA TERBARU (REAL DATA) --- */}
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
                <th className="py-3 md:py-4 pr-4 font-semibold">Nominal</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#F0F2FF] last:border-0"
                >
                  <td className="py-3 md:py-4 pr-4">
                    {order.participant?.name || "Tanpa Nama"}
                  </td>
                  <td className="py-3 md:py-4 pr-4">
                    {order.participant?.email || "-"}
                  </td>
                  <td className="py-3 md:py-4 pr-4">
                    Rp {order.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 md:py-4 pr-4">
                    {["paid", "settlement", "success"].includes(
                      order.status
                    ) ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-[#F97316]">
                        {order.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
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

export default EventDetailPage;
