"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

type Status = "paid" | "pending";

interface Participant {
  id: string;
  name: string;
  email: string;
  ticketType: "Reguler" | "VIP";
  status: Status;
}

const ParticipantsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  // Dummy event info (nanti bisa diambil dari API / server)
  const eventTitle = "Workshop Digital Marketing 2025";

  // Dummy peserta
  const allParticipants: Participant[] = [
    {
      id: "1",
      name: "Galih Trisna",
      email: "galih@example.com",
      ticketType: "Reguler",
      status: "paid",
    },
    {
      id: "2",
      name: "Ayu Fitri",
      email: "ayu.fitri@example.com",
      ticketType: "Reguler",
      status: "pending",
    },
    {
      id: "3",
      name: "Bima Pratama",
      email: "bima.p@example.com",
      ticketType: "VIP",
      status: "paid",
    },
    {
      id: "4",
      name: "Siti Nurhaliza",
      email: "siti.nur@example.com",
      ticketType: "Reguler",
      status: "paid",
    },
    {
      id: "5",
      name: "Raka Nugraha",
      email: "raka.n@example.com",
      ticketType: "VIP",
      status: "pending",
    },
  ];

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [ticketFilter, setTicketFilter] = useState<"all" | "Reguler" | "VIP">(
    "all"
  );

  // Hitung ringkasan
  const total = allParticipants.length;
  const paidCount = allParticipants.filter((p) => p.status === "paid").length;
  const pendingCount = total - paidCount;

  // Filter
  const filtered = allParticipants.filter((p) => {
    const matchQuery =
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.email.toLowerCase().includes(query.toLowerCase());

    const matchStatus =
      statusFilter === "all" ? true : p.status === statusFilter;

    const matchTicket =
      ticketFilter === "all" ? true : p.ticketType === ticketFilter;

    return matchQuery && matchStatus && matchTicket;
  });

  return (
    <>
      {/* Header atas */}
      <div className="flex flex-col gap-3 mb-3 md:mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs md:text-sm text-[#34427080]">
            <Link
              href={`/dashboard/event/${id ?? ""}`}
              className="inline-flex items-center gap-1 text-[#50A3FB] hover:text-[#2563EB]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Kembali ke Detail Event</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
              Peserta Event
            </h1>
            <p className="text-sm text-[#34427099]">{eventTitle}</p>
          </div>

          <button
            type="button"
            className="
              inline-flex items-center justify-center
              rounded-full
              pastel-gradient text-[#344270]
              text-xs md:text-sm font-semibold
              px-4 md:px-5 py-2
              shadow-[0_10px_26px_rgba(148,163,216,0.45)]
              hover:opacity-95 transition
            "
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Ringkasan + Filter */}
      <section className="grid md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Ringkasan */}
        <div
          className="
            md:col-span-2
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-5 md:px-6 py-5 md:py-6
          "
        >
          <h2 className="text-sm font-semibold text-[#34427099] mb-3">
            Ringkasan Peserta
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[#34427080]">Total Terdaftar</span>
              <span className="text-lg md:text-xl font-semibold text-[#344270] flex items-center gap-1">
                <Users className="w-4 h-4 text-[#50A3FB]" />
                {total}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#34427080]">Lunas</span>
              <span className="text-lg md:text-xl font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {paidCount}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#34427080]">Menunggu</span>
              <span className="text-lg md:text-xl font-semibold text-[#F97316] flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {pendingCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div
          className="
            rounded-3xl bg-white/90 border border-white/70
            backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            px-5 md:px-6 py-5 md:py-6
            flex flex-col gap-3
          "
        >
          <h2 className="text-sm font-semibold text-[#34427099]">Filter</h2>

          {/* Status Filter */}
          <div className="space-y-1">
            <p className="text-[11px] text-[#34427080]">Status Pembayaran</p>
            <div className="inline-flex bg-white/70 rounded-full p-1 border border-[#E4E7F5]">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  statusFilter === "all"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("paid")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  statusFilter === "paid"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                Lunas
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  statusFilter === "pending"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                Menunggu
              </button>
            </div>
          </div>

          {/* Ticket Filter */}
          <div className="space-y-1">
            <p className="text-[11px] text-[#34427080]">Tipe Tiket</p>
            <div className="inline-flex bg-white/70 rounded-full p-1 border border-[#E4E7F5]">
              <button
                type="button"
                onClick={() => setTicketFilter("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  ticketFilter === "all"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter("Reguler")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  ticketFilter === "Reguler"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                Reguler
              </button>
              <button
                type="button"
                onClick={() => setTicketFilter("VIP")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${
                  ticketFilter === "VIP"
                    ? "pastel-gradient text-[#344270] shadow-[0_6px_16px_rgba(15,23,42,0.18)]"
                    : "text-[#34427099]"
                }`}
              >
                VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Tabel */}
      <section
        className="
          rounded-[28px] bg-white/90 border border-white/70
          backdrop-blur-2xl shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          px-4 md:px-6 lg:px-8 py-5 md:py-6
        "
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#344270]">
              Daftar Peserta
            </h2>
            <p className="text-xs md:text-sm text-[#34427099] mt-1">
              {filtered.length} dari {total} peserta ditampilkan.
            </p>
          </div>

          <div className="w-full md:max-w-xs">
            <div
              className="
                flex items-center gap-2
                rounded-2xl border border-[#E4E7F5]
                bg-white/80 px-3 py-2.5
                focus-within:ring-2 focus-within:ring-[#50A3FB]/60 focus-within:border-transparent
              "
            >
              <Search className="w-4 h-4 text-[#34427080]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama atau email..."
                className="
                  w-full bg-transparent outline-none
                  text-sm text-[#344270]
                  placeholder:text-[#34427066]
                "
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-[15px] text-[#344270cc]">
            <thead>
              <tr className="border-b border-[#E4E7F5] text-left">
                <th className="py-3 md:py-4 pr-4 font-semibold">Nama</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Email</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">Tipe Tiket</th>
                <th className="py-3 md:py-4 pr-4 font-semibold">
                  Status Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
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

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-sm text-[#34427099]"
                  >
                    Tidak ada peserta yang cocok dengan filter.
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

export default ParticipantsPage;
