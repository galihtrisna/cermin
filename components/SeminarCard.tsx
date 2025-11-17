"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

interface SeminarCardProps {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  participants: number;
  image: string;
}

const SeminarCard = ({
  id,
  title,
  organizer,
  date,
  location,
  participants,
  image,
}: SeminarCardProps) => {
  return (
    <Link
      href={`/events/${id}`}
      className="
        group block overflow-hidden 
        rounded-2xl 
        border border-white/30 
        bg-white/10 
        backdrop-blur-xl 
        shadow-[0_10px_30px_rgba(15,23,42,0.15)]
        transition-all duration-300 
        hover:-translate-y-[2px] 
        hover:bg-white/20 
        hover:border-white/50
      "
    >
      {/* Image */}
      <div className="relative w-full aspect-[14/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-3 md:p-5">
        <h3 className="text-[13px] md:text-lg font-semibold mb-1.5 md:mb-2 line-clamp-2 text-[#344270]">
          {title}
        </h3>

        <p className="text-[11px] md:text-sm mb-3 md:mb-4 text-[#344270b3]">
          by {organizer}
        </p>

        <div className="space-y-1 mb-4 md:mb-5 text-[11px] md:text-sm text-[#344270cc]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#50A3FB]" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#50A3FB]" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#50A3FB]" />
            <span>{participants} peserta terdaftar</span>
          </div>
        </div>

        {/* Bottom area */}
        <div className="pt-3 md:pt-4 border-t border-white/40">
          <div className="w-full pastel-gradient rounded-xl py-2 text-center font-medium text-[#344270] pointer-events-none text-[12px] md:text-[15px]">
            Lihat Detail
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SeminarCard;
