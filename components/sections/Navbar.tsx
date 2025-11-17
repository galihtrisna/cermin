"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <nav className="bg-white/70 backdrop-blur-xl shadow-lg border border-[#E7ECF7] rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-lg cursor-pointer text-[#344270]">
          <Image src="/cermin-logo.png" alt="logo" width={100} height={20} />
        </div>

        <div className="hidden md:flex items-center gap-6 ml-auto text-[15px] font-semibold text-[#344270]">
          <Link href="/events" className="hover:opacity-70">
            Seminar
          </Link>
          <Link href="/verify" className="hover:opacity-70">
            Verifikasi
          </Link>
          <Link href="/auth" className="hover:opacity-70">
            Login
          </Link>
          <Link href="/auth?register">
            <button className="px-4 py-2 rounded-xl pastel-gradient hover:opacity-90 text-[#344270] font-semibold">
              Daftar Penyelenggara
            </button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[#344270]"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#344270"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-2 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-4 text-base font-semibold text-[#344270]">
            <Link href="/events" className="hover:opacity-70">
              Seminar
            </Link>
            <Link href="/verify" className="hover:opacity-70">
              Verifikasi
            </Link>
            <Link href="/auth" className="hover:opacity-70">
              Login
            </Link>
            <Link href="/auth?register">
              <button className="w-full px-4 py-2 rounded-xl pastel-gradient font-semibold text-[#344270]">
                Daftar Penyelenggara
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
