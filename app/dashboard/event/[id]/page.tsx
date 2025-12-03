"use client";

import { useParams } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";

interface ParticipantRow {
  id: string;
  name: string;
  email: string;
  status: "paid" | "pending";
  ticketType: string;
}

// Status event
type EventStatus = "Draf" | "Aktif" | "Selesai" | "Diblokir";

const EventDetailPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  // Dummy data, nanti tinggal diganti fetch dari API / server
  const event = {
    id,
    title: "Workshop Digital Marketing 2025",
    subtitle: "Pelajari strategi digital marketing terkini untuk bisnis Anda",
    date: "10 Oktober 2025, 09.00 WIB",
    location: "Java Heritage, Purwokerto",
    price: 55000,
    quota: 100,
    registered: 25,
    status: "Diblokir" as EventStatus,
    duration: "8 Jam",
  };

  const [eventStatus, setEventStatus] = useState<EventStatus>(event.status);

  const participants: ParticipantRow[] = [
    {
      id: "1",
      name: "Nama Peserta 1",
      email: "peserta1@example.com",
      status: "paid",
      ticketType: "Reguler",
    },
    {
      id: "2",
      name: "Nama Peserta 2",
      email: "peserta2@example.com",
      status: "pending",
      ticketType: "Reguler",
    },
    {
      id: "3",
      name: "Nama Peserta 3",
      email: "peserta3@example.com",
      status: "paid",
      ticketType: "VIP",
    },
  ];

  const verifiedCount = participants.filter((p) => p.status === "paid").length;
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackInfo, setFeedbackInfo] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusClasses = (status: EventStatus) => {
    switch (status) {
      case "Draf":
        return "bg-slate-100 text-slate-700";
      case "Aktif":
        return "bg-[#E0F4FF] text-[#2563EB]";
      case "Selesai":
        return "bg-emerald-50 text-emerald-700";
      case "Diblokir":
        return "bg-red-50 text-red-600";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getDotColor = (status: EventStatus) => {
    switch (status) {
      case "Draf":
        return "bg-slate-400";
      case "Aktif":
        return "bg-emerald-500";
      case "Selesai":
        return "bg-emerald-600";
      case "Diblokir":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <>
      {/* Header atas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-2">
        <div className="space-y-1">
          <p className="text-xs md:text-sm text-[#34427080]">
            Dashboard / Event Saya /{" "}
            <span className="font-semibold text-[#344270]">Detail Event</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
            {event.title}
          </h1>
          <p className="text-sm md:text-[15px] text-[#34427099]">
            {event.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* STATUS BADGE */}
          {eventStatus === "Diblokir" ? (
            // Kalau diblokir: badge statis, nggak bisa diubah
            <div
              className={`
                inline-flex items-center px-3 py-1.5 
                rounded-full text-xs font-semibold
                border border-[#FCA5A5]
                ${getStatusClasses(eventStatus)}
              `}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${getDotColor(
                  eventStatus
                )}`}
              />
              <span>Diblokir</span>
            </div>
          ) : (
            // Selain diblokir: dropdown status
            <div
              className={`
                inline-flex items-center px-3 py-1.5 
                rounded-full text-xs font-semibold
                border border-[#E4E7F5]
                ${getStatusClasses(eventStatus)}
              `}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${getDotColor(
                  eventStatus
                )}`}
              />
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value as EventStatus)}
                className="
                  bg-transparent border-none outline-none
                  text-xs font-semibold
                  pr-4
                  cursor-pointer
                  appearance-none
                "
              >
                <option value="Draf">Draf</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          )}

          <Link
            href={`/dashboard/event/${id ?? ""}/edit`}
            className="
              hidden md:inline-flex items-center gap-2
              rounded-full border border-[#E4E7F5]
              bg-white/80 text-[#344270]
              px-4 py-2 text-xs md:text-sm font-semibold
              hover:bg-white transition
            "
          >
            Edit Event
          </Link>

          {/* Wrapper titik tiga + menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="
                inline-flex items-center justify-center
                w-9 h-9 rounded-full
                border border-[#E4E7F5]
                bg-white/80 text-[#34427080]
                hover:bg-white hover:text-[#344270]
                transition
              "
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="
                  absolute right-0 mt-2 w-56
                  rounded-2xl bg-white
                  border border-[#E4E7F5]
                  shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                  py-2 z-20
                "
              >
                <Link
                  href={`/dashboard/event/${id ?? ""}/checkin`}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    w-full px-4 py-2.5 text-xs md:text-sm
                    text-[#344270cc] hover:bg-[#F5F6FF]
                  "
                >
                  <TicketPercent className="w-4 h-4 text-[#50A3FB]" />
                  <span>Scan Tiket / Check-in</span>
                </Link>

                <Link
                  href={`/dashboard/event/${id ?? ""}/certificates`}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    w-full px-4 py-2.5 text-xs md:text-sm
                    text-[#344270cc] hover:bg-[#F5F6FF]
                  "
                >
                  <CheckCircle2 className="w-4 h-4 text-[#50A3FB]" />
                  <span>Pengaturan Sertifikat</span>
                </Link>

                <Link
                  href={`/seminar/${id ?? ""}`}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    w-full px-4 py-2.5 text-xs md:text-sm
                    text-[#344270cc] hover:bg-[#F5F6FF]
                  "
                >
                  <Calendar className="w-4 h-4 text-[#50A3FB]" />
                  <span>Lihat Halaman Publik Event</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Kolom: Info event + ringkasan */}
      <section className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Info Event */}
        <div
          className="
            md:col-span-2
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-5 md:px-6 py-5 md:py-6
          "
        >
          <h2 className="text-sm font-semibold text-[#34427099] mb-3">
            Info Event
          </h2>
          <div className="space-y-3 text-sm md:text-[15px] text-[#344270cc]">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#50A3FB] mt-[2px]" />
              <div>
                <p className="text-xs text-[#34427099]">Tanggal & Waktu</p>
                <p className="font-medium text-[#344270]">{event.date}</p>
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
                <p className="font-medium text-[#344270]">{event.duration}</p>
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

        {/* Ringkasan Peserta */}
        <div
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-5 md:px-6 py-5 md:py-6
            flex flex-col justify-between gap-4
          "
        >
          <div>
            <h2 className="text-sm font-semibold text-[#34427099] mb-3">
              Ringkasan Peserta
            </h2>
            <div className="space-y-3 text-sm md:text-[15px] text-[#344270cc]">
              <div className="flex items-center justify-between">
                <span>Total Terdaftar</span>
                <span className="font-semibold text-[#344270]">
                  {event.registered}/{event.quota}
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
                  {event.registered - verifiedCount} peserta
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="
              mt-2 inline-flex items-center justify-center
              w-full rounded-2xl
              pastel-gradient text-[#344270]
              font-semibold text-sm py-2.5
              shadow-[0_12px_30px_rgba(148,163,216,0.45)]
              hover:opacity-95 transition
            "
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
              // TODO: call API kirim WA/email feedback link
              setTimeout(() => {
                setSendingFeedback(false);
                setFeedbackInfo(
                  "Link feedback dikirim ke semua peserta yang terdaftar (dummy)."
                );
              }, 800);
            }}
            className="
    w-full md:w-auto mt-3
    inline-flex items-center justify-center
    rounded-2xl
    bg-white text-[#344270]
    border border-[#E4E7F5]
    px-4 py-2.5 text-xs md:text-sm font-semibold
    hover:bg-[#F5F6FF]
    disabled:opacity-60 disabled:cursor-not-allowed
    transition
  "
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
      <section
        className="
    rounded-3xl bg-white/90 border border-white/70
    backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
    px-4 md:px-6 py-5 md:py-6
  "
      >
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

        {/* dummy list petugas */}
        <div className="space-y-3 mb-4 text-sm text-[#344270cc]">
          {/* Owner */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#344270]">Galih Trisna</p>
              <p className="text-[11px] text-[#34427080]">
                galih@example.com • Organizer
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E0F4FF] text-[#2563EB] text-[11px] px-3 py-1 font-semibold">
                OWNER
              </span>
              {/* Owner tidak bisa dihapus */}
            </div>
          </div>

          {/* Scanner */}
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

              {/* Tombol hapus */}
              <button
                type="button"
                onClick={() => alert("Dummy: Petugas dihapus.")}
                className="
            p-2 rounded-xl
            text-[#34427080]
            hover:bg-red-50 hover:text-red-500
            transition
          "
              >
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
              </button>
            </div>
          </div>
        </div>

        {/* Form undang petugas baru */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Dummy: invite dikirim ke email petugas scan.");
          }}
          className="flex flex-col md:flex-row gap-2 md:gap-3"
        >
          <input
            type="email"
            placeholder="Email petugas scan..."
            className="
        flex-1 rounded-2xl border border-[#E4E7F5]
        bg-white/80 px-4 py-2.5
        text-sm text-[#344270]
        placeholder:text-[#34427066]
        focus:outline-none focus:ring-2 focus:ring-[#50A3FB]/60 focus:border-transparent
      "
          />
          <button
            type="submit"
            className="
        rounded-2xl bg-[#50A3FB] text-white
        text-sm font-semibold px-4 md:px-5 py-2.5
        shadow-[0_10px_26px_rgba(80,163,251,0.55)]
        hover:opacity-95 transition
      "
          >
            Tambah Petugas
          </button>
        </form>
      </section>

      {/* Peserta Terbaru */}
      <section
        className="
          rounded-[28px] bg-white/90 border border-white/70
          backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          px-4 md:px-6 lg:px-8 py-5 md:py-6
        "
      >
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
            href={`/dashboard/event/${id ?? ""}/participants`}
            className="
              text-xs md:text-sm font-semibold
              text-[#50A3FB] hover:text-[#2563EB]
            "
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

export default EventDetailPage;
