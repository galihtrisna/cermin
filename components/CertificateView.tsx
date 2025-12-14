// components/CertificateView.tsx
"use client";

import { useState, useRef } from "react";
import { Download, ShieldCheck, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import { CertificateData } from "@/app/actions/certificate"; // Import tipe dari action

export default function CertificateView({ data }: { data: CertificateData }) {
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // Fungsi Download PDF (Sama seperti sebelumnya)
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      const element = certRef.current;

      // Tunggu sebentar agar render ulang background (jika ada delay)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true, // Tetap true
        allowTaint: true, // Tambahan
        backgroundColor: null, // Agar transparan jika ada bagian kosong
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Sertifikat-${data.participant.name}.pdf`);
    } catch (error) {
      console.error("Gagal generate PDF", error);
      alert("Gagal mendownload sertifikat.");
    } finally {
      setDownloading(false);
    }
  };

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/certificate/${data.id}`;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center gap-6">
      {/* Header Info */}
      <div className="text-center space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          Sertifikat Terverifikasi
        </div>
        <h1 className="text-2xl font-bold text-slate-800">E-Certificate</h1>
        <p className="text-slate-500 text-sm">
          Diberikan kepada <b>{data.participant.name}</b> atas partisipasi pada
          event <b>{data.event.title}</b>.
        </p>
      </div>

      {/* --- AREA SERTIFIKAT --- */}
      <div className="relative w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden bg-white">
        <div
          ref={certRef}
          className="relative w-full aspect-[297/210] text-slate-900"
          style={{
            backgroundImage: `url(${data.event.cert_background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-[5%]">
            <h1 className="text-[3vw] md:text-[24px] lg:text-[32px] font-bold tracking-wide uppercase font-serif text-[#1e293b]">
              {data.participant.name}
            </h1>
            <div className="w-[40%] h-[2px] bg-slate-800 my-[1.5%]"></div>
            <p className="text-[1.2vw] md:text-[12px] font-medium text-slate-600">
              No: {data.cert_no}
            </p>
          </div>

          <div className="absolute bottom-[8%] right-[5%] flex flex-col items-center gap-2 bg-white/90 p-2 rounded-lg border border-slate-200 shadow-sm">
            <QRCodeSVG
              value={verificationUrl}
              size={80}
              level={"H"}
              className="w-[10%] h-auto max-w-[80px]"
            />
            <span className="text-[8px] text-slate-500 font-mono tracking-tighter">
              ID: {data.id.split("-")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-70"
        >
          {downloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {downloading ? "Memproses PDF..." : "Download PDF"}
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        &copy; {new Date().getFullYear()} Cermin Event Platform. Scan QR untuk
        verifikasi keaslian.
      </p>
    </div>
  );
}
