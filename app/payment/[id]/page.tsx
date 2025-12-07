// "use client";

// import { useParams } from "next/navigation";
// import Image from "next/image";
// import { Clock, Info } from "lucide-react";

// const PaymentPage = () => {
//   const params = useParams();
//   const id = params?.id as string | undefined;

//   const amount = 55000;
//   const expiredText = "05:00";

//   return (
//     <main
//       className="
//         h-[calc(100vh-80px)]
//         flex items-center justify-center
//         px-4 mt-[80px]
//       "
//     >
//       <div
//         className="
//           w-full max-w-md md:max-w-lg
//           rounded-[32px]
//           bg-white/90
//           backdrop-blur-2xl
//           border border-white/70
//           shadow-[0_8px_30px_rgba(0,0,0,0.06)]
//           overflow-hidden
//         "
//       >
//         {/* Header gradient */}
//         <header className="bg-gradient-to-r from-[#50A3FB] to-[#A667E4] px-6 md:px-8 py-6 text-center">
//           <h1 className="text-xl md:text-2xl font-semibold text-white mb-1">
//             Pembayaran
//           </h1>
//           <p className="text-xs md:text-sm text-white/80">
//             Silahkan selesaikan pembayaran Anda
//           </p>
//         </header>

//         {/* Body */}
//         <div className="px-6 md:px-8 py-6 md:py-7 space-y-6 md:space-y-7">
//           {/* Total Pembayaran */}
//           <section className="rounded-2xl bg-white/95 border border-white/70 px-4 py-4 md:px-5 md:py-5 flex flex-col gap-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm md:text-[15px] font-semibold text-[#344270]">
//                 Total Pembayaran
//               </span>
//               <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#50A3FB] to-[#A667E4] bg-clip-text text-transparent">
//                 Rp {amount.toLocaleString("id-ID")}
//               </span>
//             </div>
//             <div className="flex items-center gap-2 text-xs md:text-[13px] text-[#34427099]">
//               <Clock className="w-4 h-4" />
//               <span>
//                 Batas waktu pembayaran:{" "}
//                 <span className="font-semibold">{expiredText}</span>
//               </span>
//             </div>
//           </section>

//           {/* QR Code */}
//           <section className="flex flex-col items-center text-center">
//             <div
//               className="
//                 rounded-3xl bg-white
//                 border border-white/80
//                 shadow-[0_10px_30px_rgba(0,0,0,0.06)]
//                 p-4
//               "
//             >
//               <div className="bg-white rounded-2xl p-3">
//                 <Image
//                   src="/qr-sample.png" // taruh file QR dummy di /public/qr-sample.png
//                   alt="QRIS"
//                   width={220}
//                   height={220}
//                   className="object-contain"
//                 />
//               </div>
//             </div>
//             <p className="mt-3 text-xs md:text-[13px] text-[#34427099]">
//               Scan QR Code untuk Membayar
//             </p>
//             <p className="mt-1 text-[11px] md:text-[12px] text-[#34427080] max-w-xs">
//               Silakan pindai kode QR di atas menggunakan aplikasi mobile banking
//               atau e-wallet Anda.
//             </p>
//           </section>

//           {/* Cara Pembayaran */}
//           <section className="rounded-2xl bg-white/95 border border-white/70 px-4 py-4 md:px-5 md:py-5">
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-6 h-6 rounded-full border border-[#34427033] flex items-center justify-center">
//                 <Info className="w-3.5 h-3.5 text-[#34427099]" />
//               </div>
//               <h2 className="text-sm md:text-[15px] font-semibold text-[#344270]">
//                 Cara Pembayaran
//               </h2>
//             </div>
//             <ol className="space-y-1.5 text-xs md:text-[13px] text-[#344270b3] pl-4 list-decimal">
//               <li>Buka aplikasi mobile banking atau e-wallet Anda.</li>
//               <li>Pilih menu scan QR atau QRIS.</li>
//               <li>Arahkan kamera ke QR code di atas.</li>
//               <li>Periksa detail pembayaran dan konfirmasi.</li>
//             </ol>
//           </section>

//           {/* Action buttons */}
//           <section className="flex flex-col md:flex-row gap-3 md:gap-4">
//             <button
//               type="button"
//               className="
//                 w-full rounded-2xl
//                 bg-white
//                 border border-[#E4E7F5]
//                 text-[#344270]
//                 font-semibold
//                 py-3 text-sm md:text-[15px]
//                 hover:bg-[#f5f6ff]
//                 transition
//               "
//               onClick={() => history.back()}
//             >
//               &lt; Kembali
//             </button>
//             <button
//               type="button"
//               className="
//                 w-full rounded-2xl
//                 bg-gradient-to-r from-[#50A3FB] to-[#A667E4]
//                 text-white font-semibold
//                 py-3 text-sm md:text-[15px]
//                 shadow-[0_12px_30px_rgba(80,163,251,0.4)]
//                 hover:opacity-95
//                 transition
//               "
//             >
//               Unduh QR
//             </button>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default PaymentPage;
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createAxiosJWT } from "@/lib/axiosJwt";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [paid, setPaid] = useState(false);
  const [expiry, setExpiry] = useState("");

  const axiosJWT = createAxiosJWT();

  // 1. Fetch QRIS Image saat load
  useEffect(() => {
    const fetchQris = async () => {
      try {
        const res = await axiosJWT.post("/api/payments/qris", { order_id: orderId });
        setQrUrl(res.data.qr_url);
        setAmount(res.data.amount);
        setExpiry(res.data.expiry_time);
      } catch (error: any) {
        console.error("Error fetching QRIS:", error);
        if (error.response?.status === 400 && error.response?.data?.message === "Order already paid") {
           setPaid(true); // Jika ternyata sudah bayar
        } else {
           alert("Gagal memuat QRIS. Silakan refresh.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchQris();
  }, [orderId]);

  // 2. Polling Status Pembayaran (Setiap 5 detik)
  useEffect(() => {
    if (paid) return;

    const checkStatus = async () => {
      try {
        // Kita bisa gunakan endpoint GET Order by ID untuk cek status
        // Pastikan endpoint GET /api/orders/:id public atau user auth
        // Disini saya asumsi kita bisa cek detail order
        const res = await axiosJWT.get(`/api/orders?id=${orderId}`); // Perlu endpoint detail order
        // Note: Kalau belum ada endpoint detail order spesifik public, bisa buat route baru
        // Atau gunakan logika webhook yang mengupdate DB, lalu kita cek DB.
        
        // Alternatif cepat: cek via endpoint custom check-status kalau ada
        // Untuk sekarang, kita mock atau asumsi user klik "Cek Status" manual jika polling berat
      } catch (e) { /* ignore polling error */ }
    };

    // Polling interval
    const interval = setInterval(async () => {
        // Cek status ke backend
        try {
             // Panggil endpoint backend yg me-return status order
             // Asumsi endpoint: GET /api/events/check-order/:id (perlu dibuat jika belum ada)
             // Atau gunakan endpoint payment notification manual check
        } catch(e) {}
    }, 5000);

    return () => clearInterval(interval);
  }, [paid, orderId]);

  // Fungsi Manual Cek Status (Agar user bisa klik jika polling belum realtime)
  const handleCheckStatus = async () => {
    try {
        setLoading(true);
        // Kita panggil endpoint get detail order (yg kita pakai di register tadi atau semacamnya)
        // Disini saya fetch ulang QR endpoint, biasanya backend akan reject kalau sudah paid
        const res = await axiosJWT.post("/api/payments/qris", { order_id: orderId });
        // Kalau masih sukses return QR, berarti belum paid.
        alert("Pembayaran belum terdeteksi. Mohon tunggu sebentar setelah membayar.");
    } catch (error: any) {
        if (error.response?.data?.message === "Order already paid") {
            setPaid(true);
        }
    } finally {
        setLoading(false);
    }
  };
  
  // Jika Sukses Bayar
  if (paid) {
      return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#344270] mb-2">Pembayaran Berhasil!</h2>
                    <p className="text-gray-500 mb-6">Tiket seminar telah dikirim ke email Anda.</p>
                    <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-xl bg-[#50A3FB] text-white font-semibold">
                        Ke Dashboard Saya
                    </button>
                </div>
            </main>
        </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 max-w-md w-full text-center relative overflow-hidden">
            {/* Hiasan background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#50A3FB] to-[#A667E4]" />

            <h2 className="text-xl font-semibold text-[#344270] mb-1">Scan QRIS</h2>
            <p className="text-sm text-gray-500 mb-6">Scan QR di bawah ini dengan E-Wallet Anda</p>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
                </div>
            ) : qrUrl ? (
                <div className="space-y-6">
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl inline-block bg-white">
                        {/* Tampilkan QR Code */}
                        <img src={qrUrl} alt="QRIS Code" className="w-64 h-64 object-contain" />
                    </div>
                    
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Pembayaran</p>
                        <p className="text-3xl font-bold text-[#344270]">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)}
                        </p>
                    </div>

                    <div className="bg-yellow-50 text-yellow-800 text-xs px-4 py-3 rounded-xl">
                        QRIS ini berlaku hingga {expiry ? new Date(expiry).toLocaleTimeString() : "-"}
                    </div>

                    <button 
                        onClick={handleCheckStatus}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#344270] font-medium transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Cek Status Pembayaran
                    </button>
                </div>
            ) : (
                <div className="text-red-500 py-10">Gagal memuat QR Code</div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}