"use client";

import { Search } from "lucide-react";
import SeminarCard from "../SeminarCard";
// import SeminarCard dari tempatmu sendiri
// import SeminarCard from "@/components/SeminarCard";

type Seminar = {
  id: string;
  // ...field lain
};

interface SeminarsSectionProps {
  seminars: Seminar[];
}

export default function SeminarsSection({ seminars }: SeminarsSectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
          <div className="glass-card p-2 flex items-center gap-2">
            <Search className="w-5 h-5 ml-2 text-[#34427080]" />
            <input
              type="text"
              placeholder="Cari seminar, workshop, atau pelatihan..."
              className="w-full bg-transparent border-0 outline-none text-[#344270] placeholder:text-[#34427080]"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-[#344270]">
            Seminar{" "}
            <span className="text-brand-gradient">Terbaru</span>
          </h2>
          <p className="text-[#344270b3] max-w-2xl mx-auto">
            Temukan berbagai seminar, workshop, dan pelatihan dari penyelenggara
            terpercaya
          </p>
        </div>

        {/* Seminars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {seminars.map((seminar) => (
            <SeminarCard title={""} organizer={""} date={""} location={""} participants={0} image={""} key={seminar.id} {...seminar} />
          ))}
        </div>
      </div>
    </section>
  );
}
