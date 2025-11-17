// components/dashboard/StatsCard.tsx
"use client";

import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

const StatsCard = ({ label, value, icon }: StatsCardProps) => {
  return (
    <div
      className="
        rounded-3xl
        bg-white/90
        border border-white/70
        backdrop-blur-2xl
        shadow-[0_12px_35px_rgba(0,0,0,0.06)]
        px-5 py-4 md:px-6 md:py-5
        flex items-center justify-between
      "
    >
      <div>
        <p className="text-xs md:text-sm text-[#34427099] mb-1">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-semibold text-[#344270]">
          {value}
        </p>
      </div>
      <div
        className="
          w-11 h-11 md:w-12 md:h-12
          rounded-2xl
          pastel-gradient
          flex items-center justify-center
        "
      >
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
