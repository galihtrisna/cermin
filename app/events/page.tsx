"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import SeminarCard from "@/components/SeminarCard"; // sesuaikan kalau path beda
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

type Seminar = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  participants: number;
  image: string;
};

// dummy data (boleh kamu ganti ke data beneran)
const ALL_SEMINARS: Seminar[] = [
  {
    id: "1",
    title: "Workshop Digital Marketing 2025",
    organizer: "Handoklo Digital",
    date: "30 Oktober 2025, 09.00 WIB",
    location: "Java Heritage",
    participants: 113,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "2",
    title: "Stay Productive With Canva",
    organizer: "Handoklo Digital",
    date: "30 Oktober 2025, 09.00 WIB",
    location: "Java Heritage",
    participants: 113,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "3",
    title: "Potensial Masalah Pemanfaatan Literasi Digital",
    organizer: "Handoklo Digital",
    date: "01 Desember 2025, 14.30 WIB",
    location: "Pullman Bandung Grand Central",
    participants: 118,
    image: "/seminar-illustration.jpg",
  },
  // biar keliatan efek infinite scroll, duplikat saja
  // (nanti bisa diganti fetch dari API)
  {
    id: "4",
    title: "Branding UMKM di Era Digital",
    organizer: "Cermin Academy",
    date: "10 Januari 2026, 19.00 WIB",
    location: "Online (Zoom)",
    participants: 220,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "5",
    title: "Public Speaking untuk Pemula",
    organizer: "Cermin Academy",
    date: "15 Januari 2026, 19.00 WIB",
    location: "Online (Zoom)",
    participants: 180,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "6",
    title: "UI/UX Design Basic Bootcamp",
    organizer: "Pixel Lab",
    date: "22 Januari 2026, 09.00 WIB",
    location: "Purwokerto",
    participants: 95,
    image: "/seminar-illustration.jpg",
  },
  // tambah beberapa lagi
  {
    id: "7",
    title: "Kelas Copywriting untuk Sosmed",
    organizer: "Handoklo Digital",
    date: "29 Januari 2026, 19.00 WIB",
    location: "Online (Zoom)",
    participants: 140,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "8",
    title: "Manajemen Event Profesional",
    organizer: "Cermin Event Lab",
    date: "05 Februari 2026, 13.00 WIB",
    location: "Java Heritage",
    participants: 160,
    image: "/seminar-illustration.jpg",
  },
  {
    id: "9",
    title: "Dasar-dasar Data Analytics",
    organizer: "DataCamp ID",
    date: "12 Februari 2026, 09.00 WIB",
    location: "Bandung",
    participants: 130,
    image: "/seminar-illustration.jpg",
  },
];

const SeminarsPage = () => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6); // awal 6 card
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // lokasi unik buat filter
  const locations = useMemo(
    () => ["all", ...Array.from(new Set(ALL_SEMINARS.map((s) => s.location)))],
    []
  );

  // apply search + filter
  const filtered = useMemo(() => {
    return ALL_SEMINARS.filter((s) => {
      const matchSearch =
        !search.trim() ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.organizer.toLowerCase().includes(search.toLowerCase());

      const matchLocation =
        locationFilter === "all" || s.location === locationFilter;

      return matchSearch && matchLocation;
    });
  }, [search, locationFilter]);

  const visibleSeminars = filtered.slice(0, visibleCount);

  // infinite scroll pakai IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 3); // load 3 lagi
            setLoadingMore(false);
          }, 600); // biar kerasa "pelan"
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [filtered.length, visibleCount, loadingMore]);

  // reset pagination kalau filter/search berubah
  useEffect(() => {
    setVisibleCount(6);
  }, [search, locationFilter]);

  return (
    <div className="min-h-screen flex flex-col">
        <Navbar/>
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

        {/* Search + Filter */}
        <div className="relative mb-10">
          <div
            className="
              flex items-center gap-3
              rounded-2xl
              bg-white/90
              border border-white/70
              shadow-[0_10px_35px_rgba(0,0,0,0.05)]
              backdrop-blur-2xl
              px-4 md:px-6 py-3
            "
          >
            <Search className="w-5 h-5 text-[#34427066]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Seminar"
              className="
                flex-1 bg-transparent outline-none
                text-sm md:text-[15px]
                text-[#344270]
                placeholder:text-[#34427066]
              "
            />
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="
                flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-white
                border border-[#E4E7F5]
                shadow-[0_4px_12px_rgba(0,0,0,0.04)]
                text-[#34427099]
                hover:bg-[#f5f6ff]
                transition
              "
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Panel filter */}
          {filterOpen && (
            <div
              className="
                absolute right-0 mt-3
                w-56
                rounded-2xl
                bg-white/95
                border border-white/70
                shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                backdrop-blur-xl
                p-4
                z-20
              "
            >
              <p className="text-xs font-semibold text-[#344270] mb-2">
                Filter Lokasi
              </p>
              <div className="space-y-1.5 text-xs text-[#344270b3]">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setLocationFilter(loc);
                      // jangan auto-tutup kalau mau bisa multi klik;
                      // kalau mau tutup otomatis, tambahin: setFilterOpen(false);
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-xl
                      transition
                      ${
                        locationFilter === loc
                          ? "bg-[#EBDCFF] text-[#344270]"
                          : "hover:bg-[#f3f4ff]"
                      }
                    `}
                  >
                    {loc === "all" ? "Semua Lokasi" : loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid Seminar */}
        {visibleSeminars.length === 0 ? (
          <p className="text-sm text-[#34427099]">
            Tidak ada seminar yang cocok dengan pencarian / filter.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {visibleSeminars.map((seminar) => (
              <SeminarCard key={seminar.id} {...seminar} />
            ))}
          </div>
        )}

        {/* Sentinel untuk infinite scroll */}
        {visibleCount < filtered.length && (
          <div
            ref={loadMoreRef}
            className="mt-8 h-10 flex items-center justify-center"
          >
            {loadingMore && (
              <span className="text-xs text-[#34427099]">Memuat lagi...</span>
            )}
          </div>
        )}
      </div>
    </main>
    <Footer/>
    </div>
  );
};

export default SeminarsPage;
