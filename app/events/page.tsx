"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import SeminarCard from "@/components/SeminarCard";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { getAllEvents, EventItem } from "@/app/actions/event"; // Import Action

// Format tanggal agar mudah dibaca
const formatDate = (dateString: string) => {
  if(!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SeminarsPage = () => {
  const [seminars, setSeminars] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 1. FETCH DATA DARI BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        setSeminars(data || []); // Pastikan array
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. LOGIKA FILTER (Sama seperti sebelumnya, tapi pakai data API)
  const locations = useMemo(
    () => ["all", ...Array.from(new Set(seminars.map((s) => s.location)))],
    [seminars]
  );

  const filtered = useMemo(() => {
    return seminars.filter((s) => {
      // Mapping field API ke kebutuhan search
      const title = s.title || "";
      const organizer = "Penyelenggara"; // Backend belum kirim nama organizer (hanya owner_id), set default dulu
      
      const matchSearch =
        !search.trim() ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        organizer.toLowerCase().includes(search.toLowerCase());

      const matchLocation =
        locationFilter === "all" || s.location === locationFilter;

      return matchSearch && matchLocation;
    });
  }, [search, locationFilter, seminars]);

  const visibleSeminars = filtered.slice(0, visibleCount);

  // Infinite scroll logic
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 3);
            setLoadingMore(false);
          }, 600);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount, loadingMore]);

  // Reset pagination saat filter berubah
  useEffect(() => {
    setVisibleCount(6);
  }, [search, locationFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#344270]">
              Seminar Tersedia
            </h1>
            <p className="text-sm md:text-base text-[#344270b3] mt-1">
              Jelajahi berbagai seminar dan workshop dari penyelenggara terpercaya
            </p>
          </div>

          {/* Search + Filter UI (Sama seperti sebelumnya) */}
          <div className="relative mb-10">
            <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-white/70 shadow-[0_10px_35px_rgba(0,0,0,0.05)] backdrop-blur-2xl px-4 md:px-6 py-3">
              <Search className="w-5 h-5 text-[#34427066]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Seminar"
                className="flex-1 bg-transparent outline-none text-sm md:text-[15px] text-[#344270] placeholder:text-[#34427066]"
              />
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#E4E7F5] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[#34427099] hover:bg-[#f5f6ff] transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Filter Lokasi */}
            {filterOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 border border-white/70 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl p-4 z-20">
                <p className="text-xs font-semibold text-[#344270] mb-2">Filter Lokasi</p>
                <div className="space-y-1.5 text-xs text-[#344270b3]">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocationFilter(loc)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        locationFilter === loc ? "bg-[#EBDCFF] text-[#344270]" : "hover:bg-[#f3f4ff]"
                      }`}
                    >
                      {loc === "all" ? "Semua Lokasi" : loc}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#344270]" />
            </div>
          ) : (
            <>
              {/* GRID SEMINAR */}
              {visibleSeminars.length === 0 ? (
                <p className="text-sm text-[#34427099]">Tidak ada seminar yang cocok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {visibleSeminars.map((seminar) => (
                    <SeminarCard
                      key={seminar.id}
                      id={seminar.id}
                      title={seminar.title}
                      organizer={"Penyelenggara"} // Placeholder karena backend blm kirim nama user
                      date={formatDate(seminar.datetime || seminar.date || "")} // Support legacy field date/datetime
                      location={seminar.location}
                      participants={seminar.capacity || 0} // Gunakan capacity sebagai info
                      image={seminar.image || "/seminar-illustration.jpg"} // Fallback image
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sentinel Infinite Scroll */}
          {!loading && visibleCount < filtered.length && (
            <div ref={loadMoreRef} className="mt-8 h-10 flex items-center justify-center">
              {loadingMore && <span className="text-xs text-[#34427099]">Memuat lagi...</span>}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeminarsPage;