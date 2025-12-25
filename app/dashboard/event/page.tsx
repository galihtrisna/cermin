"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import EventTable, { type EventRow } from "@/components/dashboard/EventTable";
import { getMyEvents } from "@/app/actions/event";

const EventListPage = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "ended">(
    "all"
  );
  const [loading, setLoading] = useState(true);

  // Fetch event user login
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Filter frontend
  const filtered = events.filter((ev) => {
    const matchQuery =
      !query.trim() || ev.title.toLowerCase().includes(query.toLowerCase());

    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? ev.status.toLowerCase() === "aktif"
        : ev.status.toLowerCase() !== "aktif";

    return matchQuery && matchStatus;
  });

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
          Event Saya
        </h1>
        <p className="text-sm text-[#34427099]">
          Kelola semua event yang kamu buat.
        </p>
      </div>

      {/* Filter Bar */}
      <section
        className="
          rounded-3xl bg-white/90 border border-white/70
          backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.06)]
          px-4 md:px-6 py-4 md:py-5
          flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center justify-between
        "
      >
        {/* Search */}
        <div className="w-full md:max-w-sm">
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
              placeholder="Cari judul event..."
              className="
                w-full bg-transparent outline-none
                text-sm text-[#344270]
                placeholder:text-[#34427066]
              "
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="hidden md:inline text-xs text-[#34427099]">
            Filter status:
          </span>

          <div className="inline-flex bg-white/70 rounded-full p-1 border border-[#E4E7F5]">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === "all"
                  ? "pastel-gradient text-[#344270] shadow"
                  : "text-[#34427099]"
              }`}
            >
              Semua
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === "active"
                  ? "pastel-gradient text-[#344270] shadow"
                  : "text-[#34427099]"
              }`}
            >
              Aktif
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("ended")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                statusFilter === "ended"
                  ? "pastel-gradient text-[#344270] shadow"
                  : "text-[#34427099]"
              }`}
            >
              Selesai
            </button>
          </div>
        </div>
      </section>

      {/* Event Table */}
      {loading ? (
        <p className="text-sm text-slate-500">Memuat event...</p>
      ) : (
        <EventTable events={filtered} />
      )}
    </>
  );
};

export default EventListPage;