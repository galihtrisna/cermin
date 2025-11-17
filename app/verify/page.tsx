"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

const VerifyCertificatePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Kode sertifikat tidak boleh kosong.");
      return;
    }
    setError(null);
    // nanti ganti dengan call API verifikasi
    console.log("Verifikasi kode:", code);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main
        className="
        h-[calc(100vh-80px)]
        mt-[80px]
        flex flex-col items-center justify-center
        px-4
      "
      >
        {/* Title & subtitle */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#344270] mb-3">
            Verifikasi Sertifikat
          </h1>
          <p className="text-sm md:text-base text-[#344270b3] max-w-2xl mx-auto">
            Masukkan kode sertifikat atau scan QR code untuk memverifikasi
            keaslian sertifikat
          </p>
        </div>

        {/* Card */}
        <div
          className="
          w-full max-w-3xl
          rounded-[28px]
          bg-white/90
          border border-white/70
          shadow-[0_10px_35px_rgba(0,0,0,0.05)]
          backdrop-blur-2xl
          px-6 md:px-8 py-6 md:py-7
        "
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="code"
                className="block text-sm font-semibold text-[#344270]"
              >
                Kode Sertifikat
              </label>

              <div
                className="
                flex items-stretch
                rounded-2xl
                bg-white/95
                border border-[#E4E7F5]
                overflow-hidden
              "
              >
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Masukkan kode sertifikat..."
                  className="
                  flex-1 px-4 py-3
                  bg-transparent outline-none
                  text-sm md:text-[15px]
                  text-[#344270]
                  placeholder:text-[#34427066]
                "
                />
                <button
                  type="submit"
                  className="
                  flex items-center gap-2
                  px-5 md:px-6
                  bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
                  text-white text-sm md:text-[15px] font-semibold
                  shrink-0
                  hover:opacity-95
                  transition
                "
                >
                  <Search className="w-4 h-4" />
                  <span>Verifikasi</span>
                </button>
              </div>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <p className="text-xs md:text-[13px] text-[#34427099] mt-2">
              Sertifikat yang terverifikasi memiliki QR code unik yang hanya
              dapat diverifikasi sekali.
            </p>
          </form>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default VerifyCertificatePage;
