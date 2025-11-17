"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Clock, Info } from "lucide-react";

const PaymentPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const amount = 55000;
  const expiredText = "05:00";

  return (
    <main
      className="
        h-[calc(100vh-80px)]
        flex items-center justify-center
        px-4 mt-[80px]
      "
    >
      <div
        className="
          w-full max-w-md md:max-w-lg
          rounded-[32px]
          bg-white/90
          backdrop-blur-2xl
          border border-white/70
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          overflow-hidden
        "
      >
        {/* Header gradient */}
        <header className="bg-gradient-to-r from-[#50A3FB] to-[#A667E4] px-6 md:px-8 py-6 text-center">
          <h1 className="text-xl md:text-2xl font-semibold text-white mb-1">
            Pembayaran
          </h1>
          <p className="text-xs md:text-sm text-white/80">
            Silahkan selesaikan pembayaran Anda
          </p>
        </header>

        {/* Body */}
        <div className="px-6 md:px-8 py-6 md:py-7 space-y-6 md:space-y-7">
          {/* Total Pembayaran */}
          <section className="rounded-2xl bg-white/95 border border-white/70 px-4 py-4 md:px-5 md:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-[15px] font-semibold text-[#344270]">
                Total Pembayaran
              </span>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#50A3FB] to-[#A667E4] bg-clip-text text-transparent">
                Rp {amount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-[13px] text-[#34427099]">
              <Clock className="w-4 h-4" />
              <span>
                Batas waktu pembayaran:{" "}
                <span className="font-semibold">{expiredText}</span>
              </span>
            </div>
          </section>

          {/* QR Code */}
          <section className="flex flex-col items-center text-center">
            <div
              className="
                rounded-3xl bg-white
                border border-white/80
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                p-4
              "
            >
              <div className="bg-white rounded-2xl p-3">
                <Image
                  src="/qr-sample.png" // taruh file QR dummy di /public/qr-sample.png
                  alt="QRIS"
                  width={220}
                  height={220}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-3 text-xs md:text-[13px] text-[#34427099]">
              Scan QR Code untuk Membayar
            </p>
            <p className="mt-1 text-[11px] md:text-[12px] text-[#34427080] max-w-xs">
              Silakan pindai kode QR di atas menggunakan aplikasi mobile banking
              atau e-wallet Anda.
            </p>
          </section>

          {/* Cara Pembayaran */}
          <section className="rounded-2xl bg-white/95 border border-white/70 px-4 py-4 md:px-5 md:py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full border border-[#34427033] flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-[#34427099]" />
              </div>
              <h2 className="text-sm md:text-[15px] font-semibold text-[#344270]">
                Cara Pembayaran
              </h2>
            </div>
            <ol className="space-y-1.5 text-xs md:text-[13px] text-[#344270b3] pl-4 list-decimal">
              <li>Buka aplikasi mobile banking atau e-wallet Anda.</li>
              <li>Pilih menu scan QR atau QRIS.</li>
              <li>Arahkan kamera ke QR code di atas.</li>
              <li>Periksa detail pembayaran dan konfirmasi.</li>
            </ol>
          </section>

          {/* Action buttons */}
          <section className="flex flex-col md:flex-row gap-3 md:gap-4">
            <button
              type="button"
              className="
                w-full rounded-2xl
                bg-white
                border border-[#E4E7F5]
                text-[#344270]
                font-semibold
                py-3 text-sm md:text-[15px]
                hover:bg-[#f5f6ff]
                transition
              "
              onClick={() => history.back()}
            >
              &lt; Kembali
            </button>
            <button
              type="button"
              className="
                w-full rounded-2xl
                bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
                text-white font-semibold
                py-3 text-sm md:text-[15px]
                shadow-[0_12px_30px_rgba(80,163,251,0.4)]
                hover:opacity-95
                transition
              "
            >
              Unduh QR
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
